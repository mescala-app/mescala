import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  Plus, 
  Mail, 
  Clock,
  UserPlus,
  Settings,
  RefreshCw,
  Send,
  User,
  Trash2,
  Save
} from 'lucide-react';

interface Equipe {
  id: string;
  nome: string;
  lider_id: string | null;
  quantidade_por_culto: number | null;
  quantidade_suplentes: number | null;
  dia_formulario_ausencia: string | null;
  horario_formulario_ausencia: string | null;
  igreja_id: string;
  igreja?: {
    nome: string;
  };
}

// Member from member_contacts (offline registration)
interface MemberContact {
  id: string;
  nome: string;
  email: string;
  whatsapp: string | null;
  status: 'pending' | 'invited' | 'active';
  user_id: string | null;
}

// Legacy member from user_roles (authenticated users)
interface Membro {
  id: string;
  user_id: string;
  profile?: {
    nome_completo: string;
    email: string;
    whatsapp: string | null;
  };
}

interface ConvitePendente {
  id: string;
  email: string;
  status: string;
}

export default function EquipePainel() {
  const { equipeId } = useParams<{ equipeId: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [equipe, setEquipe] = useState<Equipe | null>(null);
  const [memberContacts, setMemberContacts] = useState<MemberContact[]>([]);
  const [membros, setMembros] = useState<Membro[]>([]); // Legacy authenticated members
  const [convitesPendentes, setConvitesPendentes] = useState<ConvitePendente[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberWhatsapp, setNewMemberWhatsapp] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [quantidadePorCulto, setQuantidadePorCulto] = useState<number>(3);
  const [quantidadeSuplentes, setQuantidadeSuplentes] = useState<number>(0);
  const [isLider, setIsLider] = useState(false);
  const [isOrganizador, setIsOrganizador] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (equipeId && user) {
      fetchEquipeData();
    }
  }, [equipeId, user, authLoading]);

  const fetchEquipeData = async () => {
    try {
      // Fetch equipe with igreja name
      const { data: equipeData, error: equipeError } = await supabase
        .from('equipes')
        .select(`
          *,
          igrejas (id, nome, organizador_id)
        `)
        .eq('id', equipeId)
        .single();

      if (equipeError) throw equipeError;
      
      const equipeWithIgreja = {
        ...equipeData,
        igreja: equipeData.igrejas as { nome: string },
      };
      
      // Check if current user is the leader of this team
      const userIsLider = equipeData.lider_id === user!.id;
      
      // Check if current user is the organizador of this church
      const userIsOrganizador = (equipeData.igrejas as any)?.organizador_id === user!.id;
      
      // If user is neither leader nor organizador, deny access
      if (!userIsLider && !userIsOrganizador) {
        toast.error('Acesso negado. Você não é líder desta equipe.');
        navigate('/lider');
        return;
      }
      
      setIsLider(userIsLider);
      setIsOrganizador(userIsOrganizador);
      setEquipe(equipeWithIgreja);
      setQuantidadePorCulto(equipeWithIgreja.quantidade_por_culto || 3);
      setQuantidadeSuplentes(equipeWithIgreja.quantidade_suplentes || 0);

      // Fetch membros
      const { data: membrosData, error: membrosError } = await supabase
        .from('user_roles')
        .select('id, user_id')
        .eq('equipe_id', equipeId)
        .eq('role', 'membro');

      if (membrosError) throw membrosError;

      // Fetch profiles for each member
      const membrosWithProfiles = await Promise.all(
        (membrosData || []).map(async (membro) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('nome_completo, email, whatsapp')
            .eq('user_id', membro.user_id)
            .single();

          return {
            ...membro,
            profile: profile || undefined,
          };
        })
      );

      setMembros(membrosWithProfiles);

      // Fetch member_contacts (offline registered members)
      const { data: contactsData, error: contactsError } = await supabase
        .from('member_contacts')
        .select('id, nome, email, whatsapp, status, user_id')
        .eq('equipe_id', equipeId)
        .order('created_at', { ascending: true });

      if (contactsError) {
        console.error('Error fetching member contacts:', contactsError);
      } else {
        setMemberContacts((contactsData || []) as MemberContact[]);
      }

      // Fetch pending member invites (legacy system)
      const { data: convitesData, error: convitesError } = await supabase
        .from('convites')
        .select('id, email, status')
        .eq('equipe_id', equipeId)
        .eq('tipo', 'membro')
        .eq('status', 'pending');

      if (convitesError) throw convitesError;
      setConvitesPendentes(convitesData || []);

    } catch (error) {
      console.error('Error fetching equipe data:', error);
      toast.error('Erro ao carregar dados da equipe');
      navigate('/lider');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!newMemberName.trim() || !newMemberEmail.trim() || !equipe || !user) {
      toast.error('Nome e email são obrigatórios');
      return;
    }

    const email = newMemberEmail.toLowerCase().trim();
    const nome = newMemberName.trim();

    if (!email.includes('@') || !email.includes('.')) {
      toast.error('Email inválido');
      return;
    }

    // Check if already exists in member_contacts
    const existingContact = memberContacts.find(m => m.email === email);
    if (existingContact) {
      toast.error('Este email já está cadastrado na equipe');
      return;
    }

    // Check if already a legacy member
    const existingMember = membros.find(m => m.profile?.email === email);
    if (existingMember) {
      toast.error('Este email já é um membro da equipe');
      return;
    }

    setIsAddingMember(true);

    try {
      // Create member_contact (offline registration - no invite required)
      const { error: contactError } = await supabase
        .from('member_contacts')
        .insert({
          equipe_id: equipe.id,
          nome,
          email,
          whatsapp: newMemberWhatsapp.trim() || null,
          status: 'pending',
          created_by: user.id,
        });

      if (contactError) throw contactError;

      toast.success('Membro cadastrado com sucesso!');
      setNewMemberName('');
      setNewMemberEmail('');
      setNewMemberWhatsapp('');
      setDialogOpen(false);
      fetchEquipeData();
    } catch (error: any) {
      console.error('Error adding member:', error);
      toast.error('Erro ao cadastrar membro', {
        description: error.message,
      });
    } finally {
      setIsAddingMember(false);
    }
  };

  const handleSendMemberInvite = async (memberContact: MemberContact) => {
    if (!equipe || !user) return;

    try {
      // Create convite for this member
      const { error: conviteError } = await supabase
        .from('convites')
        .insert({
          token: crypto.randomUUID(),
          email: memberContact.email,
          tipo: 'membro',
          igreja_id: equipe.igreja_id,
          equipe_id: equipe.id,
          convidado_por: user.id,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        });

      if (conviteError) throw conviteError;

      // Update member_contact status to 'invited'
      await supabase
        .from('member_contacts')
        .update({ status: 'invited' })
        .eq('id', memberContact.id);

      toast.success('Convite criado! Clique em "Enviar Convites" para enviar por email.');
      fetchEquipeData();
    } catch (error: any) {
      console.error('Error creating invite:', error);
      toast.error('Erro ao criar convite');
    }
  };

  const handleDeleteMemberContact = async (memberContactId: string) => {
    try {
      const { error } = await supabase
        .from('member_contacts')
        .delete()
        .eq('id', memberContactId);

      if (error) throw error;

      toast.success('Membro removido');
      fetchEquipeData();
    } catch (error: any) {
      console.error('Error deleting member:', error);
      toast.error('Erro ao remover membro');
    }
  };

  const handleSendInvites = async () => {
    if (convitesPendentes.length === 0 || !equipe) return;

    try {
      const response = await supabase.functions.invoke('enviar-convites', {
        body: { igreja_id: equipe.igreja_id },
      });

      if (response.error) throw response.error;

      toast.success('Convites enviados por email!');
      fetchEquipeData();
    } catch (error: any) {
      console.error('Error sending invites:', error);
      toast.error('Erro ao enviar convites');
    }
  };

  const handleSaveSettings = async () => {
    if (!equipeId) return;

    setIsSavingSettings(true);
    try {
      const { error } = await supabase
        .from('equipes')
        .update({
          quantidade_por_culto: quantidadePorCulto,
          quantidade_suplentes: quantidadeSuplentes,
        })
        .eq('id', equipeId);

      if (error) throw error;

      setEquipe(prev => prev ? {
        ...prev,
        quantidade_por_culto: quantidadePorCulto,
        quantidade_suplentes: quantidadeSuplentes,
      } : null);

      toast.success('Configurações salvas!');
      setSettingsDialogOpen(false);
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsSavingSettings(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
            <Skeleton className="h-10 w-10" />
            <Skeleton className="h-8 w-32" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Logo size="md" />
          </div>
          <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Configurações da Equipe</DialogTitle>
                <DialogDescription>
                  Defina quantas pessoas serão escaladas por culto
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Membros oficiais por culto</Label>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={quantidadePorCulto}
                    onChange={(e) => setQuantidadePorCulto(parseInt(e.target.value) || 1)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Quantidade de membros que serão escalados para cada evento
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Suplentes por culto (opcional)</Label>
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    value={quantidadeSuplentes}
                    onChange={(e) => setQuantidadeSuplentes(parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Membros que ficam de sobreaviso caso algum oficial não possa comparecer
                  </p>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleSaveSettings}
                  disabled={isSavingSettings}
                >
                  {isSavingSettings ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Salvar Configurações
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-1">{equipe?.igreja?.nome}</p>
          <h1 className="text-2xl font-display font-bold text-foreground mb-1">
            {equipe?.nome}
          </h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {memberContacts.length + membros.length} membro(s)
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {equipe?.quantidade_por_culto || 3} oficiais
              {(equipe?.quantidade_suplentes || 0) > 0 && ` + ${equipe.quantidade_suplentes} suplente(s)`}
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Members Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Membros
              </h2>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <UserPlus className="h-4 w-4 mr-1" />
                    Adicionar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cadastrar Membro</DialogTitle>
                    <DialogDescription>
                      Cadastre um membro para escalar. O convite por email é opcional.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Nome Completo *</Label>
                      <Input
                        placeholder="Nome do membro"
                        value={newMemberName}
                        onChange={(e) => setNewMemberName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        placeholder="email@exemplo.com"
                        value={newMemberEmail}
                        onChange={(e) => setNewMemberEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>WhatsApp (opcional)</Label>
                      <Input
                        placeholder="(00) 00000-0000"
                        value={newMemberWhatsapp}
                        onChange={(e) => setNewMemberWhatsapp(e.target.value)}
                      />
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={handleAddMember}
                      disabled={isAddingMember || !newMemberName.trim() || !newMemberEmail.trim()}
                    >
                      {isAddingMember ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <UserPlus className="h-4 w-4 mr-2" />
                      )}
                      Cadastrar Membro
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      O membro pode ser escalado mesmo sem aceitar convite
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Pending Invites */}
            {convitesPendentes.length > 0 && (
              <Card className="mb-4 border-amber-500/50 bg-amber-50 dark:bg-amber-900/20">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <p className="font-medium text-amber-900 dark:text-amber-100">
                      {convitesPendentes.length} convite(s) pendente(s)
                    </p>
                    <Button 
                      size="sm"
                      onClick={handleSendInvites}
                      className="bg-amber-600 hover:bg-amber-700"
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Enviar
                    </Button>
                  </div>
                  <div className="space-y-1">
                    {convitesPendentes.map((convite) => (
                      <div key={convite.id} className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                        <Mail className="h-3 w-3" />
                        <span>{convite.email}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Members List */}
            {memberContacts.length === 0 && membros.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">
                    Nenhum membro na equipe ainda
                  </p>
                  <Button onClick={() => setDialogOpen(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Cadastrar Primeiro Membro
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-2">
                {/* Member Contacts (offline registered) */}
                {memberContacts.map((contact) => (
                  <Card key={contact.id} className="shadow-sm">
                    <CardContent className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            contact.status === 'active' ? 'bg-green-100' : 
                            contact.status === 'invited' ? 'bg-amber-100' : 'bg-muted'
                          }`}>
                            <User className={`h-5 w-5 ${
                              contact.status === 'active' ? 'text-green-600' : 
                              contact.status === 'invited' ? 'text-amber-600' : 'text-muted-foreground'
                            }`} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{contact.nome}</p>
                              <Badge 
                                variant={contact.status === 'active' ? 'default' : 'secondary'}
                                className="text-xs"
                              >
                                {contact.status === 'active' ? 'Ativo' : 
                                 contact.status === 'invited' ? 'Convite enviado' : 'Pendente'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{contact.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {contact.status === 'pending' && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleSendMemberInvite(contact)}
                              title="Enviar convite por email"
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => handleDeleteMemberContact(contact.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {/* Legacy authenticated members */}
                {membros.map((membro) => (
                  <Card key={membro.id} className="shadow-sm">
                    <CardContent className="py-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">
                                {membro.profile?.nome_completo || 'Sem nome'}
                              </p>
                              <Badge variant="default" className="text-xs">Ativo</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {membro.profile?.email}
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  Ações Rápidas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Ver Escalas
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Configurar Ausências
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar Lembrete
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base">Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Oficiais:</span>
                  <span className="font-medium">{equipe?.quantidade_por_culto || 3} por culto</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Suplentes:</span>
                  <span className="font-medium">{equipe?.quantidade_suplentes || 0} por culto</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Formulário:</span>
                  <span className="font-medium">
                    {equipe?.dia_formulario_ausencia 
                      ? `${equipe.dia_formulario_ausencia} ${equipe.horario_formulario_ausencia?.slice(0,5) || ''}`
                      : 'Não configurado'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

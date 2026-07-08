import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
  CheckCircle2,
  AlertCircle,
  Send,
  Copy
} from 'lucide-react';

interface Igreja {
  id: string;
  nome: string;
  endereco: string | null;
}

interface Equipe {
  id: string;
  nome: string;
  lider_id: string | null;
  quantidade_por_culto: number | null;
  liderProfile?: {
    nome_completo: string;
    email: string;
  } | null;
  membrosCount: number;
}

interface Evento {
  id: string;
  nome: string | null;
  dia_semana: string;
  horario: string;
}

interface Convite {
  id: string;
  email: string;
  tipo: string;
  status: string;
  equipe_id: string | null;
  token: string;
}

export default function IgrejaDetalhes() {
  const { igrejaId } = useParams<{ igrejaId: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [igreja, setIgreja] = useState<Igreja | null>(null);
  const [equipes, setEquipes] = useState<Equipe[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [convitesPendentes, setConvitesPendentes] = useState<Convite[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingInvites, setSendingInvites] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (igrejaId && user) {
      checkAccessAndFetch();
    }
  }, [igrejaId, user, authLoading]);

  const checkAccessAndFetch = async () => {
    try {
      // First check if user is the organizador of this igreja
      const { data: igrejaData, error: igrejaError } = await supabase
        .from('igrejas')
        .select('*')
        .eq('id', igrejaId)
        .single();

      if (igrejaError) throw igrejaError;

      // Only organizador can access this page
      if (igrejaData.organizador_id !== user!.id) {
        toast.error('Acesso negado. Apenas organizadores podem acessar esta página.');
        navigate('/dashboard');
        return;
      }

      setIgreja(igrejaData);
      await fetchEquipesAndEventos();
    } catch (error) {
      console.error('Error checking access:', error);
      toast.error('Erro ao carregar dados da igreja');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchEquipesAndEventos = async () => {
    try {
      // Fetch equipes with leader info
      const { data: equipesData, error: equipesError } = await supabase
        .from('equipes')
        .select('*')
        .eq('igreja_id', igrejaId);

      if (equipesError) throw equipesError;

      // For each equipe with lider_id, fetch the profile
      const equipesWithLeaders = await Promise.all(
        (equipesData || []).map(async (equipe) => {
          let liderProfile = null;
          if (equipe.lider_id) {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('nome_completo, email')
              .eq('user_id', equipe.lider_id)
              .single();
            liderProfile = profileData;
          }

          // Count members
          const { count } = await supabase
            .from('user_roles')
            .select('*', { count: 'exact', head: true })
            .eq('equipe_id', equipe.id)
            .eq('role', 'membro');

          return {
            ...equipe,
            liderProfile,
            membrosCount: count || 0,
          };
        })
      );

      setEquipes(equipesWithLeaders);

      // Fetch eventos
      const { data: eventosData, error: eventosError } = await supabase
        .from('eventos')
        .select('*')
        .eq('igreja_id', igrejaId);

      if (eventosError) throw eventosError;
      setEventos(eventosData || []);

      // Fetch pending invites
      const { data: convitesData, error: convitesError } = await supabase
        .from('convites')
        .select('id, email, tipo, status, equipe_id, token')
        .eq('igreja_id', igrejaId)
        .eq('status', 'pending');

      if (convitesError) throw convitesError;
      setConvitesPendentes(convitesData || []);
    } catch (error) {
      console.error('Error fetching igreja data:', error);
      toast.error('Erro ao carregar dados da igreja');
    }
  };


  const handleSendInvites = async () => {
    if (convitesPendentes.length === 0) {
      toast.info('Não há convites pendentes para enviar');
      return;
    }

    setSendingInvites(true);
    try {
      const response = await supabase.functions.invoke('enviar-convites', {
        body: { 
          igreja_id: igrejaId 
        },
      });

      if (response.error) throw response.error;

      toast.success(`${convitesPendentes.length} convite(s) enviado(s) por email!`);
      fetchEquipesAndEventos();
    } catch (error: any) {
      console.error('Error sending invites:', error);
      toast.error('Erro ao enviar convites', {
        description: error.message,
      });
    } finally {
      setSendingInvites(false);
    }
  };

  const getDiaSemanaLabel = (dia: string) => {
    const dias: Record<string, string> = {
      domingo: 'Domingo',
      segunda: 'Segunda-feira',
      terca: 'Terça-feira',
      quarta: 'Quarta-feira',
      quinta: 'Quinta-feira',
      sexta: 'Sexta-feira',
      sabado: 'Sábado',
    };
    return dias[dia] || dia;
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-40" />
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
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Logo size="md" />
          </div>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 animate-fade-in">
        {/* Igreja Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground mb-1">
            {igreja?.nome}
          </h1>
          <p className="text-muted-foreground">
            {igreja?.endereco || 'Endereço não informado'}
          </p>
        </div>

        {/* Convites Pendentes Alert */}
        {convitesPendentes.length > 0 && (
          <Card className="mb-6 border-amber-500/50 bg-amber-50 dark:bg-amber-900/20">
            <CardContent className="py-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600" />
                  <div>
                    <p className="font-medium text-amber-900 dark:text-amber-100">
                      {convitesPendentes.length} convite(s) pendente(s)
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Envie os convites por email para os líderes
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleSendInvites} 
                  disabled={sendingInvites}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {sendingInvites ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  Enviar Convites
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Equipes Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Equipes ({equipes.length})
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/igreja/${igrejaId}/equipes`)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Adicionar
              </Button>
            </div>

            {equipes.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">
                    Nenhuma equipe cadastrada ainda
                  </p>
                  <Button onClick={() => navigate(`/igreja/${igrejaId}/equipes`)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Cadastrar Equipes
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {equipes.map((equipe) => {
                  const convitePendente = convitesPendentes.find(
                    c => c.equipe_id === equipe.id && c.tipo === 'lider'
                  );

                  return (
                    <Card
                      key={equipe.id}
                      className="shadow-card hover:shadow-elegant transition-shadow cursor-pointer"
                      onClick={() => navigate(`/equipe/${equipe.id}`)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{equipe.nome}</CardTitle>
                          <Badge variant={equipe.lider_id ? "default" : "secondary"}>
                            {equipe.lider_id ? 'Ativo' : 'Sem líder'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm">
                          {equipe.liderProfile ? (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span>Líder: {equipe.liderProfile.nome_completo}</span>
                            </div>
                          ) : convitePendente ? (
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-4 w-4 text-amber-600" />
                                <span>Convite pendente: {convitePendente.email}</span>
                              </div>
                              <div 
                                className="flex items-center gap-2 text-xs bg-muted rounded px-2 py-1 cursor-pointer hover:bg-muted/80"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const link = `${window.location.origin}/aceitar-convite?token=${convitePendente.token}`;
                                  navigator.clipboard.writeText(link);
                                  toast.success('Link copiado!');
                                }}
                              >
                                <Copy className="h-3 w-3" />
                                <span className="truncate max-w-[180px]">Copiar link do convite</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <UserPlus className="h-4 w-4" />
                              <span>Nenhum líder definido</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{equipe.membrosCount} membro(s)</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{equipe.quantidade_por_culto || 3} por culto</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Eventos Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Cultos ({eventos.length})
              </h2>
            </div>

            {eventos.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-6 text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">
                    Nenhum culto cadastrado
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-card">
                <CardContent className="py-4">
                  <div className="space-y-3">
                    {eventos.map((evento) => (
                      <div 
                        key={evento.id} 
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <div>
                          <p className="font-medium text-sm">
                            {evento.nome || 'Culto'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getDiaSemanaLabel(evento.dia_semana)}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {evento.horario.slice(0, 5)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <div className="mt-6 space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Gerar Escalas
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Enviar Notificações
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

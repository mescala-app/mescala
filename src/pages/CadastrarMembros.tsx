import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  Users, 
  Mail, 
  UserPlus,
  RefreshCw,
  Send,
  ArrowRight,
  SkipForward,
  Plus,
  Trash2,
  Check
} from 'lucide-react';

interface EquipeInfo {
  id: string;
  nome: string;
  igreja: {
    id: string;
    nome: string;
  };
}

interface ConvitePendente {
  id: string;
  email: string;
}

export default function CadastrarMembros() {
  const { equipeId } = useParams<{ equipeId: string }>();
  const [searchParams] = useSearchParams();
  const isOnboarding = searchParams.get('onboarding') === 'true';
  
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [equipe, setEquipe] = useState<EquipeInfo | null>(null);
  const [convitesPendentes, setConvitesPendentes] = useState<ConvitePendente[]>([]);
  const [loading, setLoading] = useState(true);
  const [emails, setEmails] = useState<string[]>(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user && equipeId) {
      fetchEquipeData();
    }
  }, [user, authLoading, equipeId, navigate]);

  const fetchEquipeData = async () => {
    try {
      const { data: equipeData, error: equipeError } = await supabase
        .from('equipes')
        .select(`
          id,
          nome,
          igrejas (id, nome)
        `)
        .eq('id', equipeId)
        .single();

      if (equipeError) throw equipeError;

      setEquipe({
        id: equipeData.id,
        nome: equipeData.nome,
        igreja: {
          id: (equipeData.igrejas as any)?.id,
          nome: (equipeData.igrejas as any)?.nome || 'Igreja'
        }
      });

      // Fetch pending invites
      const { data: convitesData, error: convitesError } = await supabase
        .from('convites')
        .select('id, email')
        .eq('equipe_id', equipeId)
        .eq('tipo', 'membro')
        .eq('status', 'pending');

      if (!convitesError) {
        setConvitesPendentes(convitesData || []);
      }
    } catch (error) {
      console.error('Error fetching equipe:', error);
      toast.error('Erro ao carregar equipe');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmail = () => {
    setEmails([...emails, '']);
  };

  const handleRemoveEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index));
  };

  const handleEmailChange = (index: number, value: string) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  const handleCreateInvites = async () => {
    if (!equipe || !user) return;

    const validEmails = emails
      .map(e => e.toLowerCase().trim())
      .filter(e => e.includes('@') && e.includes('.'));

    if (validEmails.length === 0) {
      toast.error('Adicione pelo menos um email válido');
      return;
    }

    // Check for duplicates with pending invites
    const existingEmails = convitesPendentes.map(c => c.email);
    const newEmails = validEmails.filter(e => !existingEmails.includes(e));

    if (newEmails.length === 0) {
      toast.error('Todos os emails já possuem convites pendentes');
      return;
    }

    setIsSubmitting(true);

    try {
      const convites = newEmails.map(email => ({
        token: crypto.randomUUID(),
        email,
        tipo: 'membro' as const,
        igreja_id: equipe.igreja.id,
        equipe_id: equipe.id,
        convidado_por: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }));

      const { error } = await supabase
        .from('convites')
        .insert(convites);

      if (error) throw error;

      toast.success(`${newEmails.length} convite(s) criado(s)!`);
      setEmails(['']);
      fetchEquipeData();
    } catch (error: any) {
      console.error('Error creating invites:', error);
      toast.error('Erro ao criar convites');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendInvites = async () => {
    if (!equipe || convitesPendentes.length === 0) return;

    setIsSending(true);

    try {
      const response = await supabase.functions.invoke('enviar-convites', {
        body: { igreja_id: equipe.igreja.id }
      });

      if (response.error) throw response.error;

      toast.success('Convites enviados por email!');
      fetchEquipeData();
    } catch (error: any) {
      console.error('Error sending invites:', error);
      toast.error('Erro ao enviar convites');
    } finally {
      setIsSending(false);
    }
  };

  const handleContinue = () => {
    navigate(`/equipe/${equipeId}`);
  };

  const handleSkip = () => {
    navigate(`/equipe/${equipeId}`);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-8 w-48 mx-auto mb-4" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <Logo size="lg" className="mx-auto mb-4" />
          <CardTitle>Cadastrar Membros</CardTitle>
          <CardDescription>
            {equipe?.nome} - {equipe?.igreja.nome}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isOnboarding && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                🎉 Cadastro de líder concluído! Agora adicione os membros da sua equipe.
              </p>
            </div>
          )}

          {/* Email inputs */}
          <div className="space-y-3">
            <Label>Emails dos membros</Label>
            {emails.map((email, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="email@exemplo.com"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                />
                {emails.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleRemoveEmail(index)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleAddEmail}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar mais um email
            </Button>
          </div>

          <Button 
            className="w-full" 
            onClick={handleCreateInvites}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4 mr-2" />
            )}
            Criar Convites
          </Button>

          {/* Pending invites */}
          {convitesPendentes.length > 0 && (
            <Card className="border-amber-500/50 bg-amber-50 dark:bg-amber-900/20">
              <CardContent className="py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-medium text-amber-900 dark:text-amber-100">
                    {convitesPendentes.length} convite(s) pendente(s)
                  </p>
                  <Button 
                    size="sm"
                    onClick={handleSendInvites}
                    disabled={isSending}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    {isSending ? (
                      <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4 mr-1" />
                    )}
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

          {/* Navigation buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleSkip}
              className="flex-1"
            >
              <SkipForward className="h-4 w-4 mr-1" />
              Pular
            </Button>
            <Button 
              onClick={handleContinue}
              className="flex-1"
            >
              Continuar
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

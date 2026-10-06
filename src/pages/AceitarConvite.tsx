import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, CheckCircle, AlertCircle, Church, Users } from 'lucide-react';
import { PROFILES } from '@/lib/profiles';

interface ConviteData {
  id: string;
  email: string;
  tipo: 'lider' | 'membro';
  status: string;
  igreja_id: string;
  equipe_id: string | null;
  igreja?: {
    nome: string;
  };
  equipe?: {
    nome: string;
  } | null;
}

export default function AceitarConvite() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { user } = useAuth();

  const [convite, setConvite] = useState<ConviteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nome: '',
    apelido: '',
    email: '',
    whatsapp: '',
    password: '',
    confirmPassword: '',
  });

  const profileLabel = convite ? PROFILES.find((p) => p.value === convite.tipo)?.label : null;

  useEffect(() => {
    if (!token) {
      setError('Token de convite não fornecido');
      setLoading(false);
      return;
    }

    fetchConvite();
  }, [token]);

  const fetchConvite = async () => {
    try {
      // First fetch the convite with basic info
      const { data, error: conviteError } = await supabase
        .from('convites')
        .select(`
          id,
          email,
          tipo,
          status,
          igreja_id,
          equipe_id,
          expires_at
        `)
        .eq('token', token)
        .eq('status', 'pending')
        .maybeSingle();

      if (conviteError || !data) {
        console.error('Convite error:', conviteError);
        setError('Convite inválido ou já utilizado');
        setLoading(false);
        return;
      }

      // Check if expired
      if (new Date(data.expires_at) < new Date()) {
        setError('Este convite expirou. Solicite um novo convite ao organizador.');
        setLoading(false);
        return;
      }

      // Fetch igreja and equipe names using RPC or direct query
      // For unauthenticated users, we need to use a workaround
      let igrejaName = null;
      let equipeName = null;

      // Try to fetch igreja name
      const { data: igrejaData } = await supabase
        .from('igrejas')
        .select('nome')
        .eq('id', data.igreja_id)
        .maybeSingle();
      
      if (igrejaData) {
        igrejaName = igrejaData.nome;
      }

      // Try to fetch equipe name
      if (data.equipe_id) {
        const { data: equipeData } = await supabase
          .from('equipes')
          .select('nome')
          .eq('id', data.equipe_id)
          .maybeSingle();
        
        if (equipeData) {
          equipeName = equipeData.nome;
        }
      }

      console.log('Fetched convite data:', { igrejaName, equipeName, tipo: data.tipo });

      setConvite({
        ...data,
        tipo: data.tipo as 'lider' | 'membro',
        igreja: igrejaName ? { nome: igrejaName } : null,
        equipe: equipeName ? { nome: equipeName } : null,
      });
      setFormData(prev => ({ ...prev, email: data.email }));
    } catch (err) {
      console.error('Error fetching convite:', err);
      setError('Erro ao carregar convite');
    } finally {
      setLoading(false);
    }
  };

  // Handle accepting invite for already logged-in user
  const handleAcceptAsLoggedUser = async () => {
    if (!convite || !user) return;

    setSubmitting(true);

    try {
      // 1. Create user_role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: convite.tipo,
          igreja_id: convite.igreja_id,
          equipe_id: convite.equipe_id,
        });

      if (roleError) {
        console.error('Role error:', roleError);
        throw roleError;
      }

      // 2. If lider, update equipe.lider_id
      if (convite.tipo === 'lider' && convite.equipe_id) {
        const { error: equipeError } = await supabase
          .from('equipes')
          .update({ lider_id: user.id })
          .eq('id', convite.equipe_id);

        if (equipeError) {
          console.error('Equipe update error:', equipeError);
          throw equipeError;
        }
      }

      // 3. If membro, link to existing member_contact if exists
      if (convite.tipo === 'membro' && convite.equipe_id) {
        const { error: memberContactError } = await supabase
          .from('member_contacts')
          .update({ 
            user_id: user.id,
            status: 'active'
          })
          .eq('equipe_id', convite.equipe_id)
          .eq('email', convite.email);

        if (memberContactError) {
          console.error('Member contact update error:', memberContactError);
        }
      }

      // 4. Update convite status
      const { error: conviteUpdateError } = await supabase
        .from('convites')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString(),
        })
        .eq('id', convite.id);

      if (conviteUpdateError) {
        console.error('Convite update error:', conviteUpdateError);
      }

      toast.success('Convite aceito com sucesso!');
      
      // Redirect based on role
      if (convite.tipo === 'lider' && convite.equipe_id) {
        // Leader flow: go to team panel
        navigate(`/equipe/${convite.equipe_id}`);
      } else {
        // Member flow: go to member panel
        navigate('/membro');
      }
    } catch (error: any) {
      console.error('Error accepting invite:', error);
      toast.error('Erro ao aceitar convite', {
        description: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle registration for new users
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!convite) return;

    if (formData.password !== formData.confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Create the user account via edge function (service role) so it's
      // already confirmed - the invite token itself is the identity proof,
      // it doesn't need a second Supabase "confirm your email" step.
      const { data: cadastroData, error: cadastroError } = await supabase.functions.invoke(
        'aceitar-convite-cadastro',
        {
          body: {
            token,
            email: formData.email,
            password: formData.password,
            nome: formData.nome,
            apelido: formData.apelido || undefined,
            whatsapp: formData.whatsapp || undefined,
          },
        }
      );

      if (cadastroError || cadastroData?.error) {
        throw new Error(cadastroData?.error || cadastroError?.message || 'Erro ao criar usuário');
      }

      // 2. Sign in - the account is already confirmed, so this works right away
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError || !signInData.user) {
        throw signInError || new Error('Erro ao entrar com a conta criada');
      }

      const userId = signInData.user.id;

      // 3. Create user_role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: convite.tipo,
          igreja_id: convite.igreja_id,
          equipe_id: convite.equipe_id,
        });

      if (roleError) {
        console.error('Role error:', roleError);
        throw roleError;
      }

      // 4. If lider, update equipe.lider_id
      if (convite.tipo === 'lider' && convite.equipe_id) {
        const { error: equipeError } = await supabase
          .from('equipes')
          .update({ lider_id: userId })
          .eq('id', convite.equipe_id);

        if (equipeError) {
          console.error('Equipe update error:', equipeError);
          throw equipeError;
        }
      }

      // 5. If membro, link to existing member_contact if exists
      if (convite.tipo === 'membro' && convite.equipe_id) {
        const { error: memberContactError } = await supabase
          .from('member_contacts')
          .update({
            user_id: userId,
            status: 'active'
          })
          .eq('equipe_id', convite.equipe_id)
          .eq('email', convite.email);

        if (memberContactError) {
          console.error('Member contact update error:', memberContactError);
        }
      }

      // 6. Update convite status
      const { error: conviteUpdateError } = await supabase
        .from('convites')
        .update({
          status: 'accepted',
          accepted_at: new Date().toISOString(),
        })
        .eq('id', convite.id);

      if (conviteUpdateError) {
        console.error('Convite update error:', conviteUpdateError);
      }

      toast.success('Cadastro realizado com sucesso!');
      
      // Redirect based on role
      if (convite.tipo === 'lider' && convite.equipe_id) {
        // Leader flow: go to team panel
        navigate(`/equipe/${convite.equipe_id}`);
      } else {
        // Member flow: go to member panel
        navigate('/membro');
      }
    } catch (error: any) {
      console.error('Error accepting invite:', error);
      toast.error('Erro ao aceitar convite', {
        description: error.message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando convite...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="py-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Convite Inválido</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => navigate('/')}>
              Ir para o Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user) {
    // User already logged in - show simplified flow
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Logo size="lg" className="mx-auto mb-4" />
            <CardTitle>Aceitar Convite</CardTitle>
            <CardDescription>
              Você foi convidado para participar de uma equipe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Church className="h-4 w-4 text-primary" />
                <span className="font-medium">{convite?.igreja?.nome}</span>
              </div>
              {convite?.equipe && (
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span>Equipe: {convite.equipe.nome}</span>
                </div>
              )}
              <div className="text-sm text-muted-foreground">
                Função: {profileLabel}
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={handleAcceptAsLoggedUser}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Aceitar Convite
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <Logo size="lg" className="mx-auto mb-4" />
          <CardTitle>Bem-vindo ao Escaleluia!</CardTitle>
          <CardDescription>
            Complete seu cadastro para aceitar o convite como {profileLabel}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Convite Info */}
          <div className="bg-muted rounded-lg p-4 mb-6 space-y-3">
            <div className="flex items-center gap-2">
              <Church className="h-4 w-4 text-primary" />
              <span className="font-medium">{convite?.igreja?.nome}</span>
            </div>
            
            {convite?.equipe && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="font-medium">Equipe: {convite.equipe.nome}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                placeholder="Seu nome completo"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apelido">Como quer ser chamado?</Label>
              <Input
                id="apelido"
                placeholder="Apelido (opcional)"
                value={formData.apelido}
                onChange={(e) => setFormData({ ...formData, apelido: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                O email do convite será usado para sua conta
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp (opcional)</Label>
              <Input
                id="whatsapp"
                placeholder="(00) 00000-0000"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Digite a senha novamente"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Criar Conta e Aceitar Convite
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

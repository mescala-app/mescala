import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, MailCheck } from 'lucide-react';
import { PROFILES, ProfileValue } from '@/lib/profiles';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'login';
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Login form state
  const [loginProfile, setLoginProfile] = useState<ProfileValue>('lider');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [pendingConfirmation, setPendingConfirmation] = useState<{ userId: string } | null>(null);

  // Signup form state
  const [signupEmailSent, setSignupEmailSent] = useState(false);
  const [signupNome, setSignupNome] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupWhatsapp, setSignupWhatsapp] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(loginEmail, loginPassword);

    if (error) {
      toast.error('Erro ao entrar', {
        description: error.message === 'Invalid login credentials'
          ? 'Email ou senha incorretos'
          : error.message,
      });
      setIsLoading(false);
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    const profile = PROFILES.find((p) => p.value === loginProfile)!;

    if (!user) {
      toast.error('Erro ao entrar', { description: 'Não foi possível identificar o usuário.' });
      setIsLoading(false);
      return;
    }

    const { data: profileRow } = await supabase
      .from('profiles')
      .select('confirmado')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profileRow && profileRow.confirmado === false) {
      setPendingConfirmation({ userId: user.id });
      setIsLoading(false);
      return;
    }

    const hasProfile = await userHasProfile(user.id, loginProfile);

    if (!hasProfile) {
      toast.error('Você não possui o perfil selecionado', {
        description: 'Escolha outro perfil ou verifique se aceitou o convite correspondente.',
      });
      setIsLoading(false);
      return;
    }

    toast.success('Bem-vindo de volta!');
    navigate(profile.route);
    setIsLoading(false);
  };

  const handleConfirmTestEmail = async () => {
    if (!pendingConfirmation) return;
    setIsLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update({ confirmado: true })
      .eq('user_id', pendingConfirmation.userId);

    setIsLoading(false);

    if (error) {
      toast.error('Erro ao confirmar', { description: error.message });
      return;
    }

    setPendingConfirmation(null);
    toast.success('Email confirmado (modo teste)!');
    navigate('/cadastrar-igreja');
  };

  const userHasProfile = async (userId: string, profile: ProfileValue) => {
    if (profile === 'organizador') {
      const { data } = await supabase
        .from('igrejas')
        .select('id')
        .eq('organizador_id', userId)
        .limit(1);
      return !!data && data.length > 0;
    }

    if (profile === 'lider') {
      const { data } = await supabase
        .from('equipes')
        .select('id')
        .eq('lider_id', userId)
        .limit(1);
      return !!data && data.length > 0;
    }

    const { data } = await supabase
      .from('user_roles')
      .select('id')
      .eq('user_id', userId)
      .eq('role', 'membro')
      .limit(1);
    return !!data && data.length > 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupPassword !== signupConfirmPassword) {
      toast.error('As senhas não conferem');
      return;
    }

    if (signupPassword.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(signupEmail, signupPassword, signupNome, signupWhatsapp);

    if (error) {
      toast.error('Erro ao criar conta', {
        description: error.message,
      });
    } else {
      setSignupEmailSent(true);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <p className="text-muted-foreground">
            Gerencie escalas da sua igreja com facilidade
          </p>
        </div>

        <Card className="shadow-card">
          {pendingConfirmation ? (
            <CardContent className="py-8 text-center space-y-4">
              <MailCheck className="h-10 w-10 text-primary mx-auto" />
              <div>
                <h3 className="font-semibold mb-1">Confirme seu email (modo teste)</h3>
                <p className="text-sm text-muted-foreground">
                  Em produção você clicaria no link enviado por email. Nos testes,
                  clique no botão abaixo para simular essa confirmação.
                </p>
              </div>
              <Button onClick={handleConfirmTestEmail} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Confirmando...
                  </>
                ) : (
                  'Simular confirmação'
                )}
              </Button>
            </CardContent>
          ) : (
          <Tabs defaultValue={defaultTab}>
            <CardHeader className="pb-2">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar Conta</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              <TabsContent value="login" className="mt-0">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-profile">Perfil</Label>
                    <Select
                      value={loginProfile}
                      onValueChange={(value) => setLoginProfile(value as ProfileValue)}
                      disabled={isLoading}
                    >
                      <SelectTrigger id="login-profile">
                        <SelectValue placeholder="Selecione o perfil" />
                      </SelectTrigger>
                      <SelectContent>
                        {PROFILES.map((profile) => (
                          <SelectItem key={profile.value} value={profile.value}>
                            {profile.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Entrando...
                      </>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-0">
                {signupEmailSent ? (
                  <div className="text-center py-6 space-y-3">
                    <MailCheck className="h-10 w-10 text-primary mx-auto" />
                    <h3 className="font-semibold">Verifique seu email</h3>
                    <p className="text-sm text-muted-foreground">
                      Enviamos um link de confirmação para <strong>{signupEmail}</strong>.
                      Clique nele para ativar sua conta e continuar o cadastro da sua igreja.
                    </p>
                  </div>
                ) : (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-nome">Nome completo</Label>
                    <Input
                      id="signup-nome"
                      type="text"
                      placeholder="Seu nome completo"
                      value={signupNome}
                      onChange={(e) => setSignupNome(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-whatsapp">WhatsApp (opcional)</Label>
                    <Input
                      id="signup-whatsapp"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={signupWhatsapp}
                      onChange={(e) => setSignupWhatsapp(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm">Confirmar senha</Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="Repita a senha"
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando conta...
                      </>
                    ) : (
                      'Criar conta'
                    )}
                  </Button>
                </form>
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
          )}
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Ao continuar, você concorda com nossos Termos de Uso e Política de Privacidade.
        </p>
      </div>
    </div>
  );
}

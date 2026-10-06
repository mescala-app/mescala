import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LogOut, 
  Church, 
  Users, 
  Calendar, 
  Plus,
  Building2,
  ChevronRight
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface Igreja {
  id: string;
  nome: string;
  endereco: string | null;
}

interface UserRole {
  role: 'organizador' | 'lider' | 'membro';
  igreja_id: string | null;
  equipe_id: string | null;
  igrejas?: Igreja;
}

export default function Dashboard() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [igrejas, setIgrejas] = useState<Igreja[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      checkOrganizadorAccess();
    }
  }, [user, authLoading, navigate]);

  // This panel is only for the "Líder de Igreja" profile (organizador),
  // chosen explicitly at login. Users who aren't organizador of any igreja
  // don't belong here - send them back to pick the right profile.
  const checkOrganizadorAccess = async () => {
    try {
      const { data: igrejasData, error: igrejasError } = await supabase
        .from('igrejas')
        .select('id')
        .eq('organizador_id', user!.id)
        .limit(1);

      if (igrejasError) throw igrejasError;

      if (!igrejasData || igrejasData.length === 0) {
        navigate('/auth');
        return;
      }

      fetchUserData();
    } catch (error) {
      console.error('Error checking organizador access:', error);
      navigate('/auth');
    }
  };

  const fetchUserData = async () => {
    try {
      // Fetch user roles with igreja info
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          role,
          igreja_id,
          equipe_id,
          igrejas (
            id,
            nome,
            endereco
          )
        `)
        .eq('user_id', user!.id);

      if (rolesError) throw rolesError;
      setRoles(rolesData as unknown as UserRole[] || []);

      // Fetch igrejas where user is organizador
      const { data: igrejasData, error: igrejasError } = await supabase
        .from('igrejas')
        .select('*')
        .eq('organizador_id', user!.id);

      if (igrejasError) throw igrejasError;
      setIgrejas(igrejasData || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Logo size="md" />
            <Skeleton className="h-10 w-24" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  const hasIgreja = igrejas.length > 0 || roles.some(r => r.igreja_id);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" />
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Olá, {user?.user_metadata?.apelido || user?.user_metadata?.nome_completo?.split(' ')[0] || 'Usuário'}!
          </h1>
          <p className="text-muted-foreground">
            {hasIgreja 
              ? 'Gerencie suas igrejas e equipes abaixo.'
              : 'Comece cadastrando sua igreja para gerenciar escalas.'}
          </p>
        </div>

        {!hasIgreja ? (
          <div className="max-w-lg">
            <Card className="shadow-card border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => navigate('/cadastrar-igreja')}>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Church className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Cadastrar sua Igreja</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Configure sua igreja, equipes e líderes para começar a gerar escalas
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Começar
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Igrejas do Organizador */}
            {igrejas.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Suas Igrejas (Organizador)
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {igrejas.map((igreja) => (
                    <Card 
                      key={igreja.id} 
                      className="shadow-card hover:shadow-elegant transition-shadow cursor-pointer"
                      onClick={() => navigate(`/igreja/${igreja.id}`)}
                    >
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center justify-between">
                          {igreja.nome}
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </CardTitle>
                        <CardDescription>{igreja.endereco || 'Endereço não informado'}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button variant="secondary" size="sm" className="flex-1">
                            <Users className="h-4 w-4 mr-1" />
                            Equipes
                          </Button>
                          <Button variant="secondary" size="sm" className="flex-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            Escalas
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  
                  {/* Add new church card */}
                  <Card 
                    className="shadow-card border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => navigate('/cadastrar-igreja')}
                  >
                    <CardContent className="flex flex-col items-center justify-center h-full min-h-[160px]">
                      <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-muted-foreground text-sm">Adicionar Igreja</span>
                    </CardContent>
                  </Card>
                </div>
              </section>
            )}

            {/* Equipes como Líder/Membro */}
            {roles.filter(r => r.role !== 'organizador' && r.igrejas).length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Suas Equipes
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {roles
                    .filter(r => r.role !== 'organizador' && r.igrejas)
                    .map((role, index) => (
                      <Card key={index} className="shadow-card hover:shadow-elegant transition-shadow cursor-pointer">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              role.role === 'lider' 
                                ? 'bg-accent/20 text-accent-foreground' 
                                : 'bg-secondary text-secondary-foreground'
                            }`}>
                              {role.role === 'lider' ? 'Líder' : 'Membro'}
                            </span>
                          </div>
                          <CardTitle className="text-lg">{role.igrejas?.nome}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Button variant="secondary" size="sm" className="w-full">
                            <Calendar className="h-4 w-4 mr-1" />
                            Ver Escala
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

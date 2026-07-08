import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { 
  LogOut, 
  Calendar, 
  Users,
  Clock,
  Settings,
  Church,
  Eye,
  ChevronRight
} from 'lucide-react';

interface EquipeLider {
  id: string;
  nome: string;
  quantidade_por_culto: number | null;
  quantidade_suplentes: number | null;
  membrosCount: number;
  igreja: {
    id: string;
    nome: string;
  };
}

interface OutraEquipe {
  id: string;
  nome: string;
  liderNome: string | null;
  membrosCount: number;
}

export default function LiderPainel() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [minhasEquipes, setMinhasEquipes] = useState<EquipeLider[]>([]);
  const [outrasEquipes, setOutrasEquipes] = useState<OutraEquipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchLiderData();
    }
  }, [user, authLoading, navigate]);

  const fetchLiderData = async () => {
    try {
      // Fetch equipes where user is lider
      const { data: equipesData, error: equipesError } = await supabase
        .from('equipes')
        .select(`
          id,
          nome,
          quantidade_por_culto,
          quantidade_suplentes,
          igreja_id,
          igrejas (id, nome)
        `)
        .eq('lider_id', user!.id);

      if (equipesError) throw equipesError;

      // Count members for each equipe
      const equipesWithCounts = await Promise.all(
        (equipesData || []).map(async (equipe) => {
          const { count } = await supabase
            .from('user_roles')
            .select('*', { count: 'exact', head: true })
            .eq('equipe_id', equipe.id)
            .eq('role', 'membro');

          return {
            id: equipe.id,
            nome: equipe.nome,
            quantidade_por_culto: equipe.quantidade_por_culto,
            quantidade_suplentes: equipe.quantidade_suplentes,
            membrosCount: count || 0,
            igreja: {
              id: (equipe.igrejas as any)?.id || equipe.igreja_id,
              nome: (equipe.igrejas as any)?.nome || 'Igreja'
            }
          };
        })
      );

      setMinhasEquipes(equipesWithCounts);

      // Fetch outras equipes da mesma igreja (read-only)
      if (equipesWithCounts.length > 0) {
        const igrejaIds = [...new Set(equipesWithCounts.map(e => e.igreja.id))];
        
        const { data: outrasData, error: outrasError } = await supabase
          .from('equipes')
          .select(`
            id,
            nome,
            lider_id
          `)
          .in('igreja_id', igrejaIds)
          .neq('lider_id', user!.id);

        if (!outrasError && outrasData) {
          const outrasWithInfo = await Promise.all(
            outrasData.map(async (equipe) => {
              let liderNome = null;
              if (equipe.lider_id) {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('nome_completo')
                  .eq('user_id', equipe.lider_id)
                  .single();
                liderNome = profile?.nome_completo || null;
              }

              const { count } = await supabase
                .from('user_roles')
                .select('*', { count: 'exact', head: true })
                .eq('equipe_id', equipe.id)
                .eq('role', 'membro');

              return {
                id: equipe.id,
                nome: equipe.nome,
                liderNome,
                membrosCount: count || 0
              };
            })
          );
          setOutrasEquipes(outrasWithInfo);
        }
      }
    } catch (error) {
      console.error('Error fetching lider data:', error);
      toast.error('Erro ao carregar dados');
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
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-40" />
              <Skeleton className="h-40" />
            </div>
          </div>
        </main>
      </div>
    );
  }

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

      <main className="container mx-auto px-4 py-8 max-w-4xl animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Olá, {user?.user_metadata?.nome_completo?.split(' ')[0] || 'Líder'}!
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas equipes e visualize as escalas
          </p>
        </div>

        <Tabs defaultValue="minhas-equipes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="minhas-equipes">Minhas Equipes</TabsTrigger>
            <TabsTrigger value="outras-equipes">Outras Equipes</TabsTrigger>
          </TabsList>

          {/* Minhas Equipes (gerenciáveis) */}
          <TabsContent value="minhas-equipes" className="space-y-4">
            {minhasEquipes.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Você ainda não lidera nenhuma equipe
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {minhasEquipes.map(equipe => (
                  <Card 
                    key={equipe.id} 
                    className="shadow-card hover:shadow-elegant transition-shadow cursor-pointer"
                    onClick={() => navigate(`/equipe/${equipe.id}`)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardDescription className="flex items-center gap-1">
                            <Church className="h-3 w-3" />
                            {equipe.igreja.nome}
                          </CardDescription>
                          <CardTitle className="text-lg mt-1">{equipe.nome}</CardTitle>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {equipe.membrosCount} membro(s)
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {equipe.quantidade_por_culto || 3} por culto
                        </span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="secondary" className="flex-1">
                          <Settings className="h-4 w-4 mr-1" />
                          Gerenciar
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          Escalas
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Outras Equipes (somente leitura) */}
          <TabsContent value="outras-equipes" className="space-y-4">
            <Card className="bg-muted/50 border-dashed mb-4">
              <CardContent className="py-3 flex items-center gap-2 text-sm text-muted-foreground">
                <Eye className="h-4 w-4" />
                <span>Visualização somente leitura das agendas de outras equipes</span>
              </CardContent>
            </Card>

            {outrasEquipes.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-8 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    Não há outras equipes na igreja
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {outrasEquipes.map(equipe => (
                  <Card key={equipe.id} className="shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{equipe.nome}</CardTitle>
                      {equipe.liderNome && (
                        <CardDescription>
                          Líder: {equipe.liderNome}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <Users className="h-4 w-4" />
                        <span>{equipe.membrosCount} membro(s)</span>
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Agenda
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

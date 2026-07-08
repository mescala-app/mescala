import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  LogOut, 
  Calendar, 
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  Church
} from 'lucide-react';

interface EquipeInfo {
  id: string;
  nome: string;
  igreja: {
    nome: string;
  };
}

interface EscalaAssignment {
  id: string;
  confirmado: boolean | null;
  escala: {
    id: string;
    data_escala: string;
    evento: {
      nome: string | null;
      horario: string;
      dia_semana: string;
    };
  };
}

export default function MembroPainel() {
  const { user, signOut, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [equipes, setEquipes] = useState<EquipeInfo[]>([]);
  const [escalas, setEscalas] = useState<EscalaAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchMembroData();
    }
  }, [user, authLoading, navigate]);

  const fetchMembroData = async () => {
    try {
      // Fetch member's equipes
      const { data: rolesData, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          equipe_id,
          equipes (
            id,
            nome,
            igrejas (nome)
          )
        `)
        .eq('user_id', user!.id)
        .eq('role', 'membro');

      if (rolesError) throw rolesError;

      const equipesInfo = (rolesData || [])
        .filter(r => r.equipes)
        .map(r => ({
          id: r.equipes!.id,
          nome: r.equipes!.nome,
          igreja: { nome: (r.equipes as any).igrejas?.nome || 'Igreja' }
        }));

      setEquipes(equipesInfo);

      // Fetch member's escala assignments
      const { data: escalasData, error: escalasError } = await supabase
        .from('escala_membros')
        .select(`
          id,
          confirmado,
          escalas (
            id,
            data_escala,
            eventos (
              nome,
              horario,
              dia_semana
            )
          )
        `)
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (escalasError) throw escalasError;

      const escalasFormatted = (escalasData || [])
        .filter(e => e.escalas)
        .map(e => ({
          id: e.id,
          confirmado: e.confirmado,
          escala: {
            id: e.escalas!.id,
            data_escala: e.escalas!.data_escala,
            evento: {
              nome: (e.escalas as any).eventos?.nome || 'Culto',
              horario: (e.escalas as any).eventos?.horario || '',
              dia_semana: (e.escalas as any).eventos?.dia_semana || ''
            }
          }
        }));

      setEscalas(escalasFormatted);
    } catch (error) {
      console.error('Error fetching membro data:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPresence = async (escalaMembroId: string, confirm: boolean) => {
    try {
      const { error } = await supabase
        .from('escala_membros')
        .update({ confirmado: confirm })
        .eq('id', escalaMembroId);

      if (error) throw error;

      setEscalas(prev => prev.map(e => 
        e.id === escalaMembroId ? { ...e, confirmado: confirm } : e
      ));

      toast.success(confirm ? 'Presença confirmada!' : 'Ausência registrada');
    } catch (error) {
      console.error('Error updating confirmation:', error);
      toast.error('Erro ao atualizar confirmação');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long'
    });
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
            <div className="grid gap-4">
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
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

      <main className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Olá, {user?.user_metadata?.nome_completo?.split(' ')[0] || 'Membro'}!
          </h1>
          <p className="text-muted-foreground">
            Visualize suas escalas e confirme sua presença
          </p>
        </div>

        {/* Equipes do membro */}
        {equipes.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Suas Equipes
            </h2>
            <div className="grid gap-3">
              {equipes.map(equipe => (
                <Card key={equipe.id} className="shadow-sm">
                  <CardContent className="py-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Church className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{equipe.nome}</p>
                      <p className="text-sm text-muted-foreground">{equipe.igreja.nome}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Minhas Escalas */}
        <section>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Minhas Escalas
          </h2>

          {escalas.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Você ainda não foi escalado para nenhum evento
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {escalas.map(escala => (
                <Card key={escala.id} className="shadow-sm">
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {escala.escala.evento.nome || 'Culto'}
                        </p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {formatDate(escala.escala.data_escala)}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{escala.escala.evento.horario?.slice(0, 5)}</span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {escala.confirmado === null ? (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-green-500 text-green-600 hover:bg-green-50"
                              onClick={() => handleConfirmPresence(escala.id, true)}
                            >
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Confirmar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              className="border-red-500 text-red-600 hover:bg-red-50"
                              onClick={() => handleConfirmPresence(escala.id, false)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Ausente
                            </Button>
                          </div>
                        ) : escala.confirmado ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Confirmado
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Ausente
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

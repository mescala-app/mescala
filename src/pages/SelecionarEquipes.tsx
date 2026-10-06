import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Plus, Loader2, Users, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const EQUIPES_PREDEFINIDAS = [
  'Recepção',
  'Mídia',
  'Sonoplastia',
  'Comunicação',
  'Evangelismo',
  'Família',
  'Diaconato',
  'Banda',
  'Músicos',
  'Infantil',
  'Dízimos',
];

interface EquipeSelecionada {
  nome: string;
  emailLider: string;
}

export default function SelecionarEquipes() {
  const { igrejaId } = useParams<{ igrejaId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'selecionar' | 'lideres'>('selecionar');

  const [equipesSelecionadas, setEquipesSelecionadas] = useState<EquipeSelecionada[]>([]);
  const [novaEquipe, setNovaEquipe] = useState('');
  const [igreja, setIgreja] = useState<{ nome: string } | null>(null);

  useEffect(() => {
    if (igrejaId) {
      fetchIgreja();
    }
  }, [igrejaId]);

  const fetchIgreja = async () => {
    const { data, error } = await supabase
      .from('igrejas')
      .select('nome')
      .eq('id', igrejaId)
      .single();

    if (error) {
      toast.error('Igreja não encontrada');
      navigate('/dashboard');
      return;
    }

    setIgreja(data);
  };

  const toggleEquipe = (nome: string) => {
    const existe = equipesSelecionadas.find(e => e.nome === nome);
    if (existe) {
      setEquipesSelecionadas(equipesSelecionadas.filter(e => e.nome !== nome));
    } else {
      setEquipesSelecionadas([...equipesSelecionadas, { nome, emailLider: '' }]);
    }
  };

  const addNovaEquipe = () => {
    if (!novaEquipe.trim()) return;
    if (equipesSelecionadas.find(e => e.nome.toLowerCase() === novaEquipe.toLowerCase())) {
      toast.error('Essa equipe já foi adicionada');
      return;
    }
    setEquipesSelecionadas([...equipesSelecionadas, { nome: novaEquipe.trim(), emailLider: '' }]);
    setNovaEquipe('');
  };

  const updateEmailLider = (nome: string, email: string) => {
    setEquipesSelecionadas(
      equipesSelecionadas.map(e => 
        e.nome === nome ? { ...e, emailLider: email } : e
      )
    );
  };

  const handleContinueToLideres = () => {
    if (equipesSelecionadas.length === 0) {
      toast.error('Selecione pelo menos uma equipe');
      return;
    }
    setStep('lideres');
  };

  const handleSubmit = async () => {
    if (!user || !igrejaId) return;

    // Validate emails
    const emailsMissing = equipesSelecionadas.filter(e => !e.emailLider.trim());
    if (emailsMissing.length > 0) {
      toast.error('Preencha o email de todos os líderes');
      return;
    }

    const invalidEmails = equipesSelecionadas.filter(e => 
      !e.emailLider.includes('@') || !e.emailLider.includes('.')
    );
    if (invalidEmails.length > 0) {
      toast.error(`Email inválido para: ${invalidEmails.map(e => e.nome).join(', ')}`);
      return;
    }

    setIsLoading(true);

    try {
      // Create equipes
      const equipesToInsert = equipesSelecionadas.map(e => ({
        igreja_id: igrejaId,
        nome: e.nome,
      }));

      const { data: equipes, error: equipesError } = await supabase
        .from('equipes')
        .insert(equipesToInsert)
        .select();

      if (equipesError) throw equipesError;

      // Create convites for each lider
      const convitesToInsert = equipesSelecionadas.map((e, index) => ({
        token: crypto.randomUUID(),
        email: e.emailLider.toLowerCase().trim(),
        tipo: 'lider' as const,
        igreja_id: igrejaId,
        equipe_id: equipes[index].id,
        convidado_por: user.id,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
      }));

      const { error: convitesError } = await supabase
        .from('convites')
        .insert(convitesToInsert);

      if (convitesError) throw convitesError;

      toast.success('Equipes criadas! Os convites serão enviados por email.');
      navigate(`/igreja/${igrejaId}`);
    } catch (error: any) {
      console.error('Error creating teams:', error);
      toast.error('Erro ao criar equipes', {
        description: error.code === '42501'
          ? 'Você precisa ser o líder de igreja desta igreja para convidar líderes de equipe.'
          : error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => step === 'lideres' ? setStep('selecionar') : navigate('/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Logo size="md" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl animate-fade-in">
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-1">{igreja?.nome}</p>
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            {step === 'selecionar' ? 'Selecionar Equipes' : 'Cadastrar Líderes'}
          </h1>
          <p className="text-muted-foreground">
            {step === 'selecionar' 
              ? 'Escolha as equipes que sua igreja possui'
              : 'Informe o email de cada líder para enviar o convite'}
          </p>
        </div>

        {step === 'selecionar' ? (
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Equipes Disponíveis
                </CardTitle>
                <CardDescription>
                  Clique para selecionar as equipes da sua igreja
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {EQUIPES_PREDEFINIDAS.map((equipe) => {
                    const selecionada = equipesSelecionadas.some(e => e.nome === equipe);
                    return (
                      <button
                        key={equipe}
                        type="button"
                        onClick={() => toggleEquipe(equipe)}
                        className={cn(
                          "relative p-4 rounded-lg border-2 text-left transition-all duration-200",
                          selecionada 
                            ? "border-primary bg-primary/5 text-primary" 
                            : "border-border hover:border-primary/50 text-foreground"
                        )}
                      >
                        {selecionada && (
                          <div className="absolute top-2 right-2">
                            <Check className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <span className="font-medium">{equipe}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Label className="mb-2 block">Adicionar equipe personalizada</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nome da equipe"
                      value={novaEquipe}
                      onChange={(e) => setNovaEquipe(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNovaEquipe())}
                    />
                    <Button type="button" variant="secondary" onClick={addNovaEquipe}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {equipesSelecionadas.filter(e => !EQUIPES_PREDEFINIDAS.includes(e.nome)).length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {equipesSelecionadas
                      .filter(e => !EQUIPES_PREDEFINIDAS.includes(e.nome))
                      .map((equipe) => (
                        <span
                          key={equipe.nome}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                        >
                          {equipe.nome}
                          <button
                            type="button"
                            onClick={() => toggleEquipe(equipe.nome)}
                            className="hover:text-destructive ml-1"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard')}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button onClick={handleContinueToLideres} className="flex-1">
                Continuar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Email dos Líderes</CardTitle>
                <CardDescription>
                  Os líderes receberão um convite por email para acessar o sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {equipesSelecionadas.map((equipe) => (
                  <div key={equipe.nome} className="space-y-2">
                    <Label>{equipe.nome}</Label>
                    <Input
                      type="email"
                      placeholder="email.do.lider@exemplo.com"
                      value={equipe.emailLider}
                      onChange={(e) => updateEmailLider(equipe.nome, e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep('selecionar')}
                disabled={isLoading}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  'Enviar Convites'
                )}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

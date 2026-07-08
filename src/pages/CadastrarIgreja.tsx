import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Plus, Trash2, Loader2, Church } from 'lucide-react';

type DiaSemana = 'domingo' | 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado';

interface Evento {
  id: string;
  dia_semana: DiaSemana;
  horario: string;
  nome: string;
}

const DIAS_SEMANA = [
  { value: 'domingo', label: 'Domingo' },
  { value: 'segunda', label: 'Segunda-feira' },
  { value: 'terca', label: 'Terça-feira' },
  { value: 'quarta', label: 'Quarta-feira' },
  { value: 'quinta', label: 'Quinta-feira' },
  { value: 'sexta', label: 'Sexta-feira' },
  { value: 'sabado', label: 'Sábado' },
];

export default function CadastrarIgreja() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [nome, setNome] = useState('');
  const [endereco, setEndereco] = useState('');
  const [eventos, setEventos] = useState<Evento[]>([
    { id: crypto.randomUUID(), dia_semana: 'domingo', horario: '10:00', nome: 'Culto' }
  ]);

  const addEvento = () => {
    setEventos([
      ...eventos,
      { id: crypto.randomUUID(), dia_semana: 'domingo' as DiaSemana, horario: '19:00', nome: 'Culto' }
    ]);
  };

  const removeEvento = (id: string) => {
    if (eventos.length > 1) {
      setEventos(eventos.filter(e => e.id !== id));
    }
  };

  const updateEvento = (id: string, field: keyof Evento, value: string | DiaSemana) => {
    setEventos(eventos.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Você precisa estar logado');
      navigate('/auth');
      return;
    }

    if (!nome.trim()) {
      toast.error('Informe o nome da igreja');
      return;
    }

    if (eventos.some(e => !e.dia_semana || !e.horario)) {
      toast.error('Preencha todos os campos dos eventos');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create the church
      const { data: igreja, error: igrejaError } = await supabase
        .from('igrejas')
        .insert({
          nome: nome.trim(),
          endereco: endereco.trim() || null,
          organizador_id: user.id,
        })
        .select()
        .single();

      if (igrejaError) throw igrejaError;

      // 2. Create user role as organizador
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: user.id,
          role: 'organizador',
          igreja_id: igreja.id,
        });

      if (roleError) throw roleError;

      // 3. Create eventos
      const eventosToInsert = eventos.map(e => ({
        igreja_id: igreja.id,
        nome: e.nome || 'Culto',
        dia_semana: e.dia_semana,
        horario: e.horario,
      }));

      const { error: eventosError } = await supabase
        .from('eventos')
        .insert(eventosToInsert);

      if (eventosError) throw eventosError;

      toast.success('Igreja cadastrada com sucesso!');
      navigate(`/igreja/${igreja.id}/equipes`);
    } catch (error: any) {
      console.error('Error creating church:', error);
      toast.error('Erro ao cadastrar igreja', {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <Logo size="md" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-foreground mb-2">
            Cadastrar Igreja
          </h1>
          <p className="text-muted-foreground">
            Informe os dados da sua igreja e os dias/horários dos cultos
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Church className="h-5 w-5 text-primary" />
                Dados da Igreja
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Igreja *</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Igreja Batista Central"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  placeholder="Ex: Rua das Flores, 123 - Centro"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Dias e Horários dos Cultos</CardTitle>
              <CardDescription>
                Adicione os dias e horários em que acontecem cultos ou eventos regulares
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventos.map((evento, index) => (
                <div key={evento.id} className="flex gap-2 items-end animate-fade-in">
                  <div className="flex-1 space-y-2">
                    <Label>Dia da semana</Label>
                    <Select
                      value={evento.dia_semana}
                      onValueChange={(value) => updateEvento(evento.id, 'dia_semana', value)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {DIAS_SEMANA.map((dia) => (
                          <SelectItem key={dia.value} value={dia.value}>
                            {dia.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="w-28 space-y-2">
                    <Label>Horário</Label>
                    <Input
                      type="time"
                      value={evento.horario}
                      onChange={(e) => updateEvento(evento.id, 'horario', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <Label>Nome (opcional)</Label>
                    <Input
                      placeholder="Ex: Culto da Manhã"
                      value={evento.nome}
                      onChange={(e) => updateEvento(evento.id, 'nome', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEvento(evento.id)}
                    disabled={eventos.length === 1 || isLoading}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addEvento}
                disabled={isLoading}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar outro dia/horário
              </Button>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              disabled={isLoading}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}

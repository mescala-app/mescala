import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Bell, ArrowRight, CheckCircle } from 'lucide-react';

export default function Index() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const features = [
    {
      icon: Users,
      title: 'Gerencie Equipes',
      description: 'Cadastre líderes e membros de cada equipe com convites automáticos',
    },
    {
      icon: Calendar,
      title: 'Escalas Automáticas',
      description: 'Gere escalas justas considerando ausências e rodízio',
    },
    {
      icon: Bell,
      title: 'Notificações',
      description: 'Lembre os membros escalados 1 dia, 12h e 1h antes do culto',
    },
  ];

  const benefits = [
    'Coleta automática de ausências',
    'Distribuição equilibrada entre membros',
    'Visualização em calendário',
    'Convites por email',
    'Múltiplas equipes e igrejas',
    'Totalmente gratuito',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Entrar
            </Button>
            <Button onClick={() => navigate('/auth?tab=signup')}>
              Começar Grátis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 animate-fade-in">
            Escalas de igreja{' '}
            <span className="text-primary">sem complicação</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            Organize suas equipes, colete ausências e gere escalas automaticamente.
            Seus membros recebem notificações antes dos cultos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button size="lg" onClick={() => navigate('/auth?tab=signup')} className="text-lg px-8">
              Começar Grátis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/auth')} className="text-lg px-8">
              Já tenho conta
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Tudo que você precisa
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className="bg-card p-6 rounded-xl shadow-card animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="h-12 w-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Funcionalidades incluídas
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div 
                key={benefit} 
                className="flex items-center gap-3 p-4 rounded-lg bg-muted/30 animate-slide-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                <span className="text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 gradient-primary">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-6">
            Pronto para organizar suas escalas?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-8">
            Cadastre sua igreja agora e comece a usar gratuitamente
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={() => navigate('/auth?tab=signup')}
            className="text-lg px-8"
          >
            Criar minha conta
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="container mx-auto text-center">
          <Logo size="sm" />
          <p className="text-sm text-muted-foreground mt-4">
            © {new Date().getFullYear()} Escaleluia. Feito com ❤️ para igrejas.
          </p>
        </div>
      </footer>
    </div>
  );
}

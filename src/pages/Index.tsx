import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ArrowRight, BookOpen, Users, Trophy, Download } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: "Cursos Gratuitos",
      description: "Acesse planos curriculares completos de cursos superiores utilizando conteúdos gratuitos da internet."
    },
    {
      icon: Users,
      title: "Comunidade Ativa",
      description: "Interaja com outros estudantes, tire dúvidas e compartilhe conhecimento em nossa comunidade."
    },
    {
      icon: Trophy,
      title: "Acompanhe seu Progresso",
      description: "Monitore seu avanço através das unidades curriculares e celebre suas conquistas."
    },
    {
      icon: Download,
      title: "Repositório de Materiais",
      description: "Acesse e contribua com materiais educacionais compartilhados pela comunidade."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-background via-background/95 to-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Sua Jornada Educacional Digital
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              A FACODI é uma plataforma gratuita que centraliza planos curriculares de cursos superiores 
              utilizando conteúdos gratuitos disponíveis na internet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button size="lg" asChild className="text-lg px-8 py-6">
                  <Link to="/cursos">
                    Explorar Cursos
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" asChild className="text-lg px-8 py-6">
                    <Link to="/auth">
                      Começar Agora
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild className="text-lg px-8 py-6">
                    <Link to="/auth">
                      Entrar
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -right-32 w-96 h-96 rounded-full bg-gradient-primary opacity-10 blur-3xl" />
          <div className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full bg-gradient-primary opacity-10 blur-3xl" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Por que escolher a FACODI?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma completa para sua educação superior, com foco na autonomia e qualidade do aprendizado.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-primary/10 hover:border-primary/20 transition-colors hover:shadow-elegant">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 bg-gradient-to-r from-primary/5 to-primary-glow/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pronto para começar sua jornada?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Junte-se a milhares de estudantes que já estão construindo seu futuro com a FACODI.
            </p>
            <Button size="lg" asChild className="text-lg px-8 py-6">
              <Link to="/auth">
                Criar Conta Gratuita
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Index;

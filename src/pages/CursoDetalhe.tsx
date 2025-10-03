import { useParams, Link } from "react-router-dom";
import { useCurso } from "@/hooks/useCursos";
import { useVerificarInscricao, useInscreverCurso, useDesinscreverCurso } from "@/hooks/useInscricoes";
import { useCalcularProgressoCurso } from "@/hooks/useProgresso";
import { UnitCard } from "@/components/UnitCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ProgressBar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, BookOpen, Calendar, School, Clock, UserCheck, UserPlus } from "lucide-react";

export default function CursoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { data: curso, isLoading, error } = useCurso(id!);
  const { data: inscricao } = useVerificarInscricao(id!);
  const { data: progresso } = useCalcularProgressoCurso(id!);
  const inscreverMutation = useInscreverCurso();
  const desinscreverMutation = useDesinscreverCurso();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-destructive">
            Erro ao carregar curso: {error.message}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!curso) return null;

  const handleInscricao = () => {
    if (inscricao) {
      desinscreverMutation.mutate(id!);
    } else {
      inscreverMutation.mutate(id!);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Navigation */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/cursos">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Cursos
            </Link>
          </Button>
        </div>

        {/* Course Header */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                  {curso.nome}
                </h1>
                {curso.universidades && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <School className="h-4 w-4" />
                    <span>{curso.universidades.nome}</span>
                    {curso.universidades.sigla && (
                      <Badge variant="outline">{curso.universidades.sigla}</Badge>
                    )}
                  </div>
                )}
              </div>

              {curso.descricao && (
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {curso.descricao}
                </p>
              )}

              {/* Course Stats */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{curso.duracao_semestres} semestres</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{curso.ects_total} ECTS</span>
                </div>
                {curso.cursos_unidades && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{curso.cursos_unidades.length} unidades</span>
                  </div>
                )}
              </div>
            </div>

            {/* Enrollment Card */}
            {user && (
              <Card className="w-full lg:w-80 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {inscricao ? (
                      <>
                        <UserCheck className="h-5 w-5 text-success" />
                        Inscrito
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-5 w-5" />
                        Inscrição
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {inscricao && progresso && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso</span>
                        <span>{progresso.percentage}%</span>
                      </div>
                      <ProgressBar value={progresso.percentage} />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{progresso.completed} de {progresso.total} completos</span>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleInscricao}
                    className="w-full"
                    variant={inscricao ? "outline" : "default"}
                    disabled={inscreverMutation.isPending || desinscreverMutation.isPending}
                  >
                    {inscricao ? "Desinscrever" : "Inscrever-se"}
                  </Button>
                  
                  {inscricao && (
                    <p className="text-xs text-muted-foreground text-center">
                      Inscrito em {new Date(inscricao.data_inscricao).toLocaleDateString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Course Units */}
        {curso.cursos_unidades && curso.cursos_unidades.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Unidades Curriculares</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {curso.cursos_unidades.map((cu) => {
                // Transform the data to match UnidadeCurricular interface
                const unidadeTransformed = {
                  ...cu.unidades_curriculares,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString()
                };
                
                return (
                  <UnitCard
                    key={cu.unidades_curriculares.id}
                    unidade={unidadeTransformed}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
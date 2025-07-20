import { useParams, Link } from "react-router-dom";
import { useCurso } from "@/hooks/useCursos";
import { UnitCard } from "@/components/UnitCard";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function CursoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const { data: curso, isLoading, error } = useCurso(id || "");

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

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Link
        to="/cursos"
        className="flex items-center text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
      </Link>

      {isLoading || !curso ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{curso.nome}</h1>
            {curso.universidades?.nome && (
              <p className="text-muted-foreground">
                {curso.universidades.nome}
              </p>
            )}
            {curso.descricao && <p>{curso.descricao}</p>}
          </div>

          {curso.cursos_unidades && curso.cursos_unidades.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {curso.cursos_unidades.map((cu) => (
                <UnitCard
                  key={cu.unidades_curriculares.id}
                  unidade={cu.unidades_curriculares}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

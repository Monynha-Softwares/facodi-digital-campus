import { Link, useParams } from "react-router-dom";
import { useUnidade } from "@/hooks/useUnidades";
import { ContentAccordion } from "@/components/ContentAccordion";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function Unidade() {
  const { id } = useParams<{ id: string }>();
  const { data: unidade, isLoading, error } = useUnidade(id || "");

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-destructive">
            Erro ao carregar unidade: {error.message}
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

      {isLoading || !unidade ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{unidade.nome}</h1>
            {unidade.descricao && (
              <p className="text-muted-foreground">{unidade.descricao}</p>
            )}
          </div>
          {unidade.unidades_conteudos && (
            <ContentAccordion
              conteudos={unidade.unidades_conteudos}
              unidadeId={unidade.id}
            />
          )}
        </>
      )}
    </div>
  );
}

import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { useUnidade, useProgressoUnidade, useProgresso } from "@/hooks/useUnidades";
import { useComentarios, useCriarComentario } from "@/hooks/useComentarios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function UnidadeDetalhe() {
  const { id } = useParams<{ id: string }>();
  const { data: unidade, isLoading, error } = useUnidade(id || "");
  const { data: comentarios } = useComentarios(id || "");
  const { data: progresso } = useProgresso(id || "");
  const progressoMutate = useProgressoUnidade();
  const criarComentario = useCriarComentario();
  const [texto, setTexto] = useState("");

  const progressoMap = new Map(
    (progresso || []).map((p) => [p.conteudo_id, p.concluido])
  );

  const toggleProgresso = (conteudoId: string, value: boolean) => {
    if (!id) return;
    progressoMutate.mutate({
      unidadeId: id,
      conteudoId,
      concluido: value,
    });
  };

  const enviarComentario = () => {
    if (!id || !texto.trim()) return;
    criarComentario.mutate({ texto, unidadeId: id });
    setTexto("");
  };

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
            <div className="space-y-4">
              {unidade.unidades_conteudos
                .sort((a, b) => a.ordem - b.ordem)
                .map((item) => (
                  <Card key={item.conteudos.id}>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {item.conteudos.titulo}
                        </span>
                        <Checkbox
                          checked={!!progressoMap.get(item.conteudos.id)}
                          onCheckedChange={(checked) =>
                            toggleProgresso(
                              item.conteudos.id,
                              Boolean(checked)
                            )
                          }
                        />
                      </div>
                      {item.conteudos.descricao && (
                        <p className="text-sm text-muted-foreground">
                          {item.conteudos.descricao}
                        </p>
                      )}
                      {item.conteudos.url && (
                        <a
                          href={item.conteudos.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-primary underline"
                        >
                          Abrir conteúdo
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Comentários</h2>
            <div className="space-y-2">
              {comentarios && comentarios.length > 0 ? (
                comentarios.map((comentario) => (
                  <Card key={comentario.id}>
                    <CardContent className="p-4">
                      <p className="text-sm">{comentario.texto}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum comentário.</p>
              )}
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Escreva um comentário"
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
              />
              <Button
                onClick={enviarComentario}
                disabled={criarComentario.isPending}
              >
                Comentar
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

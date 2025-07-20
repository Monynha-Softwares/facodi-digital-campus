import { useAllComentarios } from '@/hooks/useComentarios';
import { Card, CardContent } from '@/components/ui/card';

export default function Comunidade() {
  const { data: comentarios, isLoading } = useAllComentarios('recent');

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Comunidade</h1>
      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : comentarios && comentarios.length > 0 ? (
        <div className="space-y-4">
          {comentarios.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-4 space-y-1">
                <span className="font-medium">{c.perfis?.nome}</span>
                <p className="text-sm">{c.texto}</p>
                {c.unidades_curriculares && (
                  <p className="text-xs text-muted-foreground">
                    {c.unidades_curriculares.nome}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Nenhum comentário ainda.</p>
      )}
    </div>
  );
}

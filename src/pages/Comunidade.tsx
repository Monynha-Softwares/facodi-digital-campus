import { useAllComentarios } from '@/hooks/useComentarios';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Comunidade() {
  const { data: comentarios, isLoading, error } = useAllComentarios('recent');

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-destructive">
            Erro ao carregar comentários: {error.message}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-4">
      <h1 className="text-3xl font-bold">Comunidade</h1>
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : comentarios && comentarios.length > 0 ? (
        <div className="space-y-2">
          {comentarios.map(c => (
            <Card key={c.id}>
              <CardContent className="p-4 space-y-1">
                <p className="font-medium">{c.perfis?.nome}</p>
                <p className="text-sm">{c.texto}</p>
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

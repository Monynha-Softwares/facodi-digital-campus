import { usePerfil } from '@/hooks/usePerfil';
import { useMeusCursos } from '@/hooks/useCursos';
import { Card, CardContent } from '@/components/ui/card';

export default function Perfil() {
  const { data: perfil } = usePerfil();
  const { data: cursos } = useMeusCursos();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Meu Perfil</h1>
      {perfil && (
        <div>
          <p className="font-medium">{perfil.nome}</p>
          {perfil.universidades && (
            <p className="text-sm text-muted-foreground">
              {perfil.universidades.nome}
            </p>
          )}
        </div>
      )}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Meus Cursos</h2>
        {cursos && cursos.length > 0 ? (
          cursos.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-4">
                <p className="font-medium">{c.cursos.nome}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground">Nenhum curso inscrito.</p>
        )}
      </div>
    </div>
  );
}

import { useAuth } from '@/hooks/useAuth';
import { useMeusCursos } from '@/hooks/useCursos';
import { ProgressBar } from '@/components/ProgressBar';

export default function Perfil() {
  const { user } = useAuth();
  const { data: cursos } = useMeusCursos();

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Perfil</h1>
      {user && (
        <div className="space-y-1">
          <p className="font-medium">{user.email}</p>
        </div>
      )}
      {cursos && cursos.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Cursos Inscritos</h2>
          {cursos.map(c => (
            <div key={c.id} className="space-y-1">
              <p className="font-medium">{c.cursos.nome}</p>
              <ProgressBar value={0} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

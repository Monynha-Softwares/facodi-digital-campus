import { useState } from 'react';
import { useUnidades } from '@/hooks/useUnidades';
import { UnitCard } from '@/components/UnitCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Unidades() {
  const [semestre, setSemestre] = useState<string>('');
  const { data: unidades } = useUnidades(semestre ? { semestre: Number(semestre) } : undefined);

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Unidades Curriculares</h1>
      <div className="max-w-xs">
        <Select onValueChange={setSemestre} value={semestre}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por semestre" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            {[1,2,3,4,5,6,7,8].map((s) => (
              <SelectItem key={s} value={String(s)}>{s}º semestre</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {unidades && unidades.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unidades.map((u) => (
            <UnitCard key={u.id} unidade={u} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Nenhuma unidade encontrada.</p>
      )}
    </div>
  );
}

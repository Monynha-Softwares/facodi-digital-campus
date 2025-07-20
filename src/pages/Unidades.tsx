import { useState } from 'react';
import { useUnidades } from '@/hooks/useUnidades';
import { useTags } from '@/hooks/useTags';
import { UnitCard, TagChip } from '@/components';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Unidades() {
  const [search, setSearch] = useState('');
  const { data: tags } = useTags();
  const [tag, setTag] = useState<string | undefined>();

  const { data: unidades, isLoading, error } = useUnidades({ tag });

  const filtered = unidades?.filter(u =>
    u.nome.toLowerCase().includes(search.toLowerCase())
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-destructive">
            Erro ao carregar unidades: {error.message}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Pesquisar unidade..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {tags && (
          <Select
            value={tag || ''}
            onValueChange={value => setTag(value || undefined)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Todas as tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as tags</SelectItem>
              {tags.map(t => (
                <SelectItem key={t.id} value={t.nome}>{t.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-4" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filtered && filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(u => (
            <UnitCard key={u.id} unidade={u} />
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-muted-foreground">Nenhuma unidade encontrada.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

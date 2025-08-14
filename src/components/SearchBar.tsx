import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { useSearch, useSearchTags, SearchResult } from '@/hooks/useSearch';
import { Link } from 'react-router-dom';

interface SearchBarProps {
  placeholder?: string;
  onResultSelect?: (result: SearchResult) => void;
  autoFocus?: boolean;
}

export const SearchBar = ({ 
  placeholder = "Buscar cursos, unidades ou conteúdos...",
  onResultSelect,
  autoFocus = false 
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState<'curso' | 'unidade' | 'conteudo' | undefined>();
  const [showResults, setShowResults] = useState(false);

  const { data: searchResults, isLoading } = useSearch(query, {
    type: typeFilter,
    tags: selectedTags.length > 0 ? selectedTags : undefined,
  });

  const { data: tags } = useSearchTags();

  useEffect(() => {
    setShowResults(query.length >= 2);
  }, [query]);

  const handleTagToggle = (tagName: string) => {
    setSelectedTags(prev =>
      prev.includes(tagName)
        ? prev.filter(t => t !== tagName)
        : [...prev, tagName]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setTypeFilter(undefined);
  };

  const getResultLink = (result: SearchResult) => {
    switch (result.type) {
      case 'curso':
        return `/curso/${result.id}`;
      case 'unidade':
        return `/unidade/${result.id}`;
      case 'conteudo':
        return `/unidade/${result.id}`; // Content is accessed through units
      default:
        return '/';
    }
  };

  const getResultTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'curso':
        return 'Curso';
      case 'unidade':
        return 'Unidade';
      case 'conteudo':
        return 'Conteúdo';
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-4"
            autoFocus={autoFocus}
            onFocus={() => setShowResults(query.length >= 2)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Tipo de Conteúdo</h4>
                <div className="space-y-2">
                  {(['curso', 'unidade', 'conteudo'] as const).map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={typeFilter === type}
                        onCheckedChange={(checked) =>
                          setTypeFilter(checked ? type : undefined)
                        }
                      />
                      <label htmlFor={type} className="text-sm capitalize">
                        {getResultTypeLabel(type)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {tags && tags.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {tags.map((tag) => (
                      <Badge
                        key={tag.nome}
                        variant={selectedTags.includes(tag.nome) ? "default" : "outline"}
                        className="cursor-pointer text-xs"
                        style={{
                          backgroundColor: selectedTags.includes(tag.nome) ? tag.cor : undefined,
                        }}
                        onClick={() => handleTagToggle(tag.nome)}
                      >
                        {tag.nome}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(selectedTags.length > 0 || typeFilter) && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="h-3 w-3 mr-1" />
                  Limpar Filtros
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Active Filters */}
      {(selectedTags.length > 0 || typeFilter) && (
        <div className="flex flex-wrap gap-2 mt-2">
          {typeFilter && (
            <Badge variant="secondary" className="text-xs">
              Tipo: {getResultTypeLabel(typeFilter)}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => setTypeFilter(undefined)}
              />
            </Badge>
          )}
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => handleTagToggle(tag)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Search Results */}
      {showResults && (
        <Card className="absolute top-full mt-2 w-full z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-2">
            {isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-3 border rounded">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))}
              </div>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="space-y-1">
                {searchResults.slice(0, 10).map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    to={getResultLink(result)}
                    className="block p-3 rounded hover:bg-muted transition-colors"
                    onClick={() => {
                      onResultSelect?.(result);
                      setShowResults(false);
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {getResultTypeLabel(result.type)}
                          </Badge>
                          <span className="font-medium text-sm truncate">
                            {result.titulo}
                          </span>
                        </div>
                        {result.descricao && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {result.descricao}
                          </p>
                        )}
                        {result.metadata && (
                          <div className="flex gap-2 mt-1">
                            {result.metadata.universidade && (
                              <span className="text-xs text-muted-foreground">
                                {result.metadata.universidade}
                              </span>
                            )}
                            {result.metadata.ects && (
                              <span className="text-xs text-muted-foreground">
                                {result.metadata.ects} ECTS
                              </span>
                            )}
                            {result.metadata.duracao_minutos && (
                              <span className="text-xs text-muted-foreground">
                                {result.metadata.duracao_minutos}min
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : query.length >= 2 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                Nenhum resultado encontrado para "{query}"
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
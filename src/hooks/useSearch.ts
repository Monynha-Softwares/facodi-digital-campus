import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SearchResult {
  type: 'curso' | 'unidade' | 'conteudo';
  id: string;
  titulo: string;
  descricao: string | null;
  relevance: number;
  metadata?: {
    universidade?: string;
    ects?: number;
    duracao_minutos?: number;
    tipo?: string;
  };
}

export const useSearch = (query: string, filters?: {
  type?: 'curso' | 'unidade' | 'conteudo';
  tags?: string[];
}) => {
  return useQuery({
    queryKey: ['search', query, filters],
    queryFn: async (): Promise<SearchResult[]> => {
      if (!query || query.trim().length < 2) return [];

      const searchTerm = `%${query.trim().toLowerCase()}%`;
      const results: SearchResult[] = [];

      // Search courses
      if (!filters?.type || filters.type === 'curso') {
        const { data: cursos, error: cursosError } = await supabase
          .from('cursos')
          .select(`
            id,
            nome,
            descricao,
            ects_total,
            universidades (nome)
          `)
          .or(`nome.ilike.${searchTerm},descricao.ilike.${searchTerm}`);

        if (!cursosError && cursos) {
          results.push(...cursos.map(curso => ({
            type: 'curso' as const,
            id: curso.id,
            titulo: curso.nome,
            descricao: curso.descricao,
            relevance: calculateRelevance(curso.nome, curso.descricao, query),
            metadata: {
              universidade: curso.universidades?.nome,
              ects: curso.ects_total,
            },
          })));
        }
      }

      // Search units
      if (!filters?.type || filters.type === 'unidade') {
        const { data: unidades, error: unidadesError } = await supabase
          .from('unidades_curriculares')
          .select('id, nome, descricao, ects')
          .or(`nome.ilike.${searchTerm},descricao.ilike.${searchTerm}`);

        if (!unidadesError && unidades) {
          results.push(...unidades.map(unidade => ({
            type: 'unidade' as const,
            id: unidade.id,
            titulo: unidade.nome,
            descricao: unidade.descricao,
            relevance: calculateRelevance(unidade.nome, unidade.descricao, query),
            metadata: {
              ects: unidade.ects,
            },
          })));
        }
      }

      // Search content
      if (!filters?.type || filters.type === 'conteudo') {
        let contentQuery = supabase
          .from('conteudos')
          .select(`
            id,
            titulo,
            descricao,
            tipo,
            duracao_minutos,
            conteudos_tags (
              tags (nome, cor)
            )
          `)
          .or(`titulo.ilike.${searchTerm},descricao.ilike.${searchTerm}`);

        const { data: conteudos, error: conteudosError } = await contentQuery;

        if (!conteudosError && conteudos) {
          let filteredConteudos = conteudos;

          // Filter by tags if specified
          if (filters?.tags && filters.tags.length > 0) {
            filteredConteudos = conteudos.filter(conteudo =>
              conteudo.conteudos_tags?.some(ct =>
                filters.tags!.includes(ct.tags.nome)
              )
            );
          }

          results.push(...filteredConteudos.map(conteudo => ({
            type: 'conteudo' as const,
            id: conteudo.id,
            titulo: conteudo.titulo,
            descricao: conteudo.descricao,
            relevance: calculateRelevance(conteudo.titulo, conteudo.descricao, query),
            metadata: {
              tipo: conteudo.tipo,
              duracao_minutos: conteudo.duracao_minutos,
            },
          })));
        }
      }

      // Sort by relevance
      return results.sort((a, b) => b.relevance - a.relevance);
    },
    enabled: query.trim().length >= 2,
  });
};

function calculateRelevance(title: string, description: string | null, query: string): number {
  const queryLower = query.toLowerCase();
  const titleLower = title.toLowerCase();
  const descLower = description?.toLowerCase() || '';

  let score = 0;

  // Exact title match gets highest score
  if (titleLower === queryLower) score += 100;
  // Title starts with query
  else if (titleLower.startsWith(queryLower)) score += 80;
  // Title contains query
  else if (titleLower.includes(queryLower)) score += 60;
  
  // Description contains query
  if (descLower.includes(queryLower)) score += 20;

  // Word boundary matches get extra points
  const titleWords = titleLower.split(/\s+/);
  const queryWords = queryLower.split(/\s+/);
  
  for (const queryWord of queryWords) {
    if (titleWords.some(word => word === queryWord)) score += 30;
    else if (titleWords.some(word => word.startsWith(queryWord))) score += 15;
  }

  return score;
}

export const useSearchTags = () => {
  return useQuery({
    queryKey: ['search_tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('nome, cor')
        .order('nome');

      if (error) throw error;
      return data;
    },
  });
};
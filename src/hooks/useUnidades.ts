
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UnidadeCurricular {
  id: string;
  nome: string;
  descricao: string | null;
  ects: number;
  semestre: number;
  ano_curricular: number;
  created_at: string;
  updated_at: string;
  cursos_unidades?: Array<{
    cursos: {
      nome: string;
      universidades: {
        sigla: string;
      };
    };
  }>;
  unidades_conteudos?: Array<{
    ordem: number;
    conteudos: {
      id: string;
      titulo: string;
      tipo: string;
      conteudos_tags: Array<{
        tags: {
          nome: string;
          cor: string;
        };
      }>;
    };
  }>;
}

export const useUnidades = (filters?: {
  semestre?: number;
  ano_curricular?: number;
  tag?: string;
}) => {
  return useQuery({
    queryKey: ['unidades', filters],
    queryFn: async () => {
      let query = supabase
        .from('unidades_curriculares')
        .select(`
          *,
          cursos_unidades (
            cursos (
              nome,
              universidades (
                sigla
              )
            )
          ),
          unidades_conteudos (
            ordem,
            conteudos (
              id,
              titulo,
              tipo,
              conteudos_tags (
                tags (
                  nome,
                  cor
                )
              )
            )
          )
        `)
        .order('semestre')
        .order('nome');

      if (filters?.semestre) {
        query = query.eq('semestre', filters.semestre);
      }
      if (filters?.ano_curricular) {
        query = query.eq('ano_curricular', filters.ano_curricular);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as UnidadeCurricular[];
    },
  });
};

export const useUnidade = (id: string) => {
  return useQuery({
    queryKey: ['unidade', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('unidades_curriculares')
        .select(`
          *,
          unidades_conteudos (
            ordem,
            conteudos (
              id,
              titulo,
              descricao,
              tipo,
              url,
              duracao_minutos,
              created_at,
              updated_at,
              conteudos_tags (
                tags (
                  nome,
                  cor
                )
              )
            )
          ),
          cursos_unidades (
            cursos (
              nome,
              universidades (
                nome,
                sigla
              )
            )
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
};

export const useProgressoUnidade = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      unidadeId, 
      conteudoId, 
      concluido 
    }: { 
      unidadeId: string; 
      conteudoId: string; 
      concluido: boolean; 
    }) => {
      const { data, error } = await supabase
        .from('progresso')
        .upsert({
          unidade_id: unidadeId,
          conteudo_id: conteudoId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          concluido,
          data_conclusao: concluido ? new Date().toISOString() : null,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progresso'] });
      queryClient.invalidateQueries({ queryKey: ['unidade'] });
    },
  });
};

export interface ProgressoItem {
  conteudo_id: string;
  concluido: boolean | null;
}

export const useProgresso = (unidadeId: string) => {
  return useQuery({
    queryKey: ['progresso', unidadeId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('progresso')
        .select('conteudo_id, concluido')
        .eq('unidade_id', unidadeId)
        .eq('user_id', user?.id);

      if (error) throw error;
      return data as ProgressoItem[];
    },
    enabled: !!unidadeId,
  });
};

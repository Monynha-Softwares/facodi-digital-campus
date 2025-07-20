import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Comentario {
  id: string;
  texto: string;
  curtidas: number;
  user_id: string;
  unidade_id: string;
  conteudo_id: string | null;
  created_at: string;
  updated_at: string;
  perfis?: {
    nome: string;
    avatar_url: string | null;
  };
  unidades_curriculares?: {
    nome: string;
  };
}

export const useComentarios = (unidadeId: string, conteudoId?: string) => {
  return useQuery({
    queryKey: ['comentarios', unidadeId, conteudoId],
    queryFn: async () => {
      let query = supabase
        .from('comentarios')
        .select(`
          *,
          perfis (
            nome,
            avatar_url
          ),
          unidades_curriculares (
            nome
          )
        `)
        .eq('unidade_id', unidadeId)
        .order('created_at', { ascending: false });

      if (conteudoId) {
        query = query.eq('conteudo_id', conteudoId);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    },
    enabled: !!unidadeId,
  });
};

export const useAllComentarios = (orderBy: 'recent' | 'popular' = 'recent') => {
  return useQuery({
    queryKey: ['all_comentarios', orderBy],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comentarios')
        .select(`
          *,
          perfis (
            nome,
            avatar_url
          ),
          unidades_curriculares (
            nome
          )
        `)
        .order(orderBy === 'recent' ? 'created_at' : 'curtidas', { 
          ascending: false 
        })
        .limit(50);
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCriarComentario = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      texto, 
      unidadeId, 
      conteudoId 
    }: { 
      texto: string; 
      unidadeId: string; 
      conteudoId?: string; 
    }) => {
      const { data, error } = await supabase
        .from('comentarios')
        .insert({
          texto,
          unidade_id: unidadeId,
          conteudo_id: conteudoId || null,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comentarios'] });
      queryClient.invalidateQueries({ queryKey: ['all_comentarios'] });
    },
  });
};
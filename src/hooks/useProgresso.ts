import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ProgressoItem {
  id: string;
  user_id: string;
  unidade_id: string | null;
  conteudo_id: string | null;
  concluido: boolean;
  data_conclusao: string | null;
  created_at: string;
  updated_at: string;
}

export const useProgresso = (unidadeId?: string) => {
  return useQuery({
    queryKey: ['progresso', unidadeId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      let query = supabase
        .from('progresso')
        .select('*')
        .eq('user_id', user.id);

      if (unidadeId) {
        query = query.eq('unidade_id', unidadeId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as ProgressoItem[];
    },
  });
};

export const useProgressoConteudo = (conteudoId: string) => {
  return useQuery({
    queryKey: ['progresso', 'conteudo', conteudoId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('progresso')
        .select('*')
        .eq('user_id', user.id)
        .eq('conteudo_id', conteudoId)
        .maybeSingle();

      if (error) throw error;
      return data as ProgressoItem | null;
    },
  });
};

export const useMarcarProgresso = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      unidadeId,
      conteudoId,
      concluido = true,
    }: {
      unidadeId?: string;
      conteudoId?: string;
      concluido?: boolean;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('progresso')
        .upsert({
          user_id: user.id,
          unidade_id: unidadeId || null,
          conteudo_id: conteudoId || null,
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
      toast({
        title: "Progresso atualizado",
        description: "Seu progresso foi salvo com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar progresso",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCalcularProgressoCurso = (cursoId: string) => {
  return useQuery({
    queryKey: ['progresso', 'curso', cursoId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get total content count for the course
      const { data: totalContent, error: totalError } = await supabase
        .from('unidades_conteudos')
        .select(`
          conteudo_id,
          unidades_curriculares!inner (
            cursos_unidades!inner (
              curso_id
            )
          )
        `)
        .eq('unidades_curriculares.cursos_unidades.curso_id', cursoId);

      if (totalError) throw totalError;

      // Get completed content for user
      const { data: completedContent, error: completedError } = await supabase
        .from('progresso')
        .select('conteudo_id')
        .eq('user_id', user.id)
        .eq('concluido', true)
        .not('conteudo_id', 'is', null);

      if (completedError) throw completedError;

      const total = totalContent?.length || 0;
      const completed = completedContent?.filter(p => 
        totalContent?.some(t => t.conteudo_id === p.conteudo_id)
      ).length || 0;

      return {
        total,
        completed,
        percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    },
  });
};
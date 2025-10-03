import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Curso {
  id: string;
  nome: string;
  descricao: string | null;
  duracao_semestres: number;
  ects_total: number;
  universidade_id: string;
  created_at: string;
  updated_at: string;
  universidades?: {
    nome: string;
    sigla: string;
    cidade: string;
  };
}

export const useCursos = () => {
  return useQuery({
    queryKey: ['cursos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cursos')
        .select(`
          *,
          universidades (
            nome,
            sigla,
            cidade
          )
        `)
        .order('nome');
      
      if (error) throw error;
      return data as Curso[];
    },
  });
};

export const useCurso = (id: string) => {
  return useQuery({
    queryKey: ['curso', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cursos')
        .select(`
          *,
          universidades (
            nome,
            sigla,
            cidade,
            website
          ),
          cursos_unidades (
            unidades_curriculares (
              id,
              nome,
              descricao,
              ects,
              semestre,
              ano_curricular
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

// Hook to get user's enrolled courses
export const useMeusCursos = () => {
  return useQuery({
    queryKey: ['meus_cursos'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('usuarios_cursos')
        .select(`
          *,
          cursos (
            id,
            nome,
            descricao,
            ects_total,
            universidades (
              nome,
              sigla
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('ativo', true)
        .order('data_inscricao', { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

export const useInscricaoCurso = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ cursoId }: { cursoId: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('usuarios_cursos')
        .insert({
          curso_id: cursoId,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['usuarios_cursos'] });
      queryClient.invalidateQueries({ queryKey: ['meus_cursos'] });
    },
  });
};
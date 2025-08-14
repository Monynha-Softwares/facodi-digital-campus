import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface InscricaoCurso {
  id: string;
  user_id: string;
  curso_id: string;
  data_inscricao: string;
  ativo: boolean;
  cursos: {
    id: string;
    nome: string;
    descricao: string | null;
    universidades: {
      nome: string;
      sigla: string | null;
    } | null;
  };
}

export const useMinhasInscricoes = () => {
  return useQuery({
    queryKey: ['minhas_inscricoes'],
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
      return data as InscricaoCurso[];
    },
  });
};

export const useVerificarInscricao = (cursoId: string) => {
  return useQuery({
    queryKey: ['inscricao', cursoId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('usuarios_cursos')
        .select('*')
        .eq('user_id', user.id)
        .eq('curso_id', cursoId)
        .eq('ativo', true)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!cursoId,
  });
};

export const useInscreverCurso = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (cursoId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('usuarios_cursos')
        .insert({
          user_id: user.id,
          curso_id: cursoId,
          ativo: true,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['minhas_inscricoes'] });
      queryClient.invalidateQueries({ queryKey: ['inscricao'] });
      toast({
        title: "Inscrição realizada",
        description: "Você foi inscrito no curso com sucesso!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro na inscrição",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDesinscreverCurso = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (cursoId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('usuarios_cursos')
        .update({ ativo: false })
        .eq('user_id', user.id)
        .eq('curso_id', cursoId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['minhas_inscricoes'] });
      queryClient.invalidateQueries({ queryKey: ['inscricao'] });
      toast({
        title: "Desinscrição realizada",
        description: "Você foi desinscrito do curso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro na desinscrição",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
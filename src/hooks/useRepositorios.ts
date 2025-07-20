import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Repositorio {
  id: string;
  user_id: string | null;
  titulo: string;
  descricao: string | null;
  arquivo_url: string;
  tipo_arquivo: string | null;
  tamanho_kb: number | null;
  aprovado: boolean | null;
  downloads: number | null;
  created_at: string;
  updated_at: string;
  perfis?: {
    nome: string;
    avatar_url: string | null;
  } | null;
}

export const useRepositorios = () => {
  return useQuery({
    queryKey: ['repositorios'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('repositorios')
        .select(
          `*, perfis ( nome, avatar_url )`
        )
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Repositorio[];
    },
  });
};

export const useUploadRepositorio = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ file, titulo, descricao }: { file: File; titulo: string; descricao?: string }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const extension = file.name.split('.').pop();
      const path = `${user.id}/${Date.now()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from('materiais')
        .upload(path, file);
      if (uploadError) throw uploadError;
      const { data, error } = await supabase
        .from('repositorios')
        .insert({
          user_id: user.id,
          titulo,
          descricao: descricao || null,
          arquivo_url: path,
          tipo_arquivo: file.type,
          tamanho_kb: Math.ceil(file.size / 1024),
        })
        .select()
        .single();
      if (error) throw error;
      return data as Repositorio;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositorios'] });
    },
  });
};

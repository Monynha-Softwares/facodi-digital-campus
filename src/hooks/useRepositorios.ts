import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Repositorio {
  id: string;
  titulo: string;
  descricao: string | null;
  arquivo_url: string;
  tipo_arquivo: string | null;
  tamanho_kb: number | null;
  downloads: number | null;
  aprovado: boolean | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
}

export const useRepositorios = (unidadeId?: string) => {
  return useQuery({
    queryKey: ['repositorios', unidadeId],
    queryFn: async () => {
      let query = supabase
        .from('repositorios')
        .select('*')
        .order('created_at', { ascending: false });

      if (unidadeId) query = query.eq('unidade_id', unidadeId);

      const { data, error } = await query;
      if (error) throw error;
      return data as Repositorio[];
    },
  });
};

export const useUploadMaterial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      titulo,
      descricao,
      unidadeId,
    }: {
      file: File;
      titulo: string;
      descricao?: string;
      unidadeId?: string;
    }) => {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('repositorio')
        .upload(path, file);
      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from('repositorios')
        .insert({
          titulo,
          descricao: descricao || null,
          arquivo_url: path,
          tipo_arquivo: ext,
          unidade_id: unidadeId || null,
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

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export interface ConteudoItem {
  ordem: number | null;
  conteudos: Database['public']['Tables']['conteudos']['Row'] & {
    conteudos_tags?: { tags: { nome: string; cor: string | null } }[];
  };
}

export const useConteudos = (unidadeId: string) => {
  return useQuery({
    queryKey: ['conteudos', unidadeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('unidades_conteudos')
        .select(
          `ordem, conteudos (*, conteudos_tags ( tags ( nome, cor ) ))`
        )
        .eq('unidade_id', unidadeId)
        .order('ordem');

      if (error) throw error;
      return data as ConteudoItem[];
    },
    enabled: !!unidadeId,
  });
};

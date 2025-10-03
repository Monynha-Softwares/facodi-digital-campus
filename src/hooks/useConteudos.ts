
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface ConteudoItem {
  ordem: number | null;
  conteudos: {
    id: string;
    titulo: string;
    descricao: string | null;
    tipo: string;
    url: string | null;
    duracao_minutos: number | null;
    created_at: string;
    updated_at: string;
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

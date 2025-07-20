import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Perfil {
  id: string;
  nome: string;
  avatar_url: string | null;
  universidade_id: string | null;
  created_at: string;
  updated_at: string;
  universidades?: {
    nome: string;
    sigla: string;
  } | null;
}

export const usePerfil = () => {
  return useQuery({
    queryKey: ['perfil'],
    queryFn: async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      const { data, error } = await supabase
        .from('perfis')
        .select(
          `*, universidades ( nome, sigla )`
        )
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data as Perfil;
    },
  });
};

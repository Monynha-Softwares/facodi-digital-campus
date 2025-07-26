
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { sanitizeText, rateLimiter } from '@/lib/security';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  
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
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Rate limiting: max 5 comments per minute
      const rateLimitKey = `comment_${user.id}`;
      if (!rateLimiter.isAllowed(rateLimitKey, 5, 60000)) {
        throw new Error('Rate limit exceeded. Please wait before posting another comment.');
      }

      // Sanitize input text
      const sanitizedText = sanitizeText(texto);
      if (!sanitizedText || sanitizedText.length < 3) {
        throw new Error('Comment must be at least 3 characters long');
      }
      
      if (sanitizedText.length > 2000) {
        throw new Error('Comment is too long (max 2000 characters)');
      }

      const { data, error } = await supabase
        .from('comentarios')
        .insert({
          texto: sanitizedText,
          unidade_id: unidadeId,
          conteudo_id: conteudoId || null,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comentarios'] });
      queryClient.invalidateQueries({ queryKey: ['all_comentarios'] });
      toast({
        title: "Comentário criado",
        description: "Seu comentário foi publicado com sucesso.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao criar comentário",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

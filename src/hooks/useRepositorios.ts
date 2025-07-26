
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { validateFileType, validateFileSize, sanitizeText } from '@/lib/security';
import { useToast } from '@/hooks/use-toast';

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

// Allowed file types for upload
const ALLOWED_FILE_TYPES = [
  'pdf', 'doc', 'docx', 'txt', 'md', 
  'ppt', 'pptx', 'xls', 'xlsx',
  'jpg', 'jpeg', 'png', 'gif',
  'zip', 'rar', '7z'
];

const MAX_FILE_SIZE_KB = 50 * 1024; // 50MB

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
  const { toast } = useToast();

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
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Validate file type
      if (!validateFileType(file, ALLOWED_FILE_TYPES)) {
        throw new Error(
          `File type not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`
        );
      }

      // Validate file size
      if (!validateFileSize(file, MAX_FILE_SIZE_KB)) {
        throw new Error(`File too large. Maximum size: ${MAX_FILE_SIZE_KB / 1024}MB`);
      }

      // Sanitize inputs
      const sanitizedTitulo = sanitizeText(titulo);
      if (!sanitizedTitulo || sanitizedTitulo.length < 3) {
        throw new Error('Title must be at least 3 characters long');
      }

      const sanitizedDescricao = descricao ? sanitizeText(descricao) : null;

      // Create safe file path with user ID prefix
      const ext = file.name.split('.').pop();
      const timestamp = Date.now();
      const path = `${user.id}/${timestamp}-${sanitizedTitulo.replace(/[^a-zA-Z0-9]/g, '_')}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('repositorio')
        .upload(path, file, {
          contentType: file.type,
          upsert: false
        });
      
      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from('repositorios')
        .insert({
          titulo: sanitizedTitulo,
          descricao: sanitizedDescricao,
          arquivo_url: path,
          tipo_arquivo: ext,
          tamanho_kb: Math.round(file.size / 1024),
          unidade_id: unidadeId || null,
          user_id: user.id,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as Repositorio;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repositorios'] });
      toast({
        title: "Material enviado",
        description: "Seu material foi enviado e está aguardando aprovação.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

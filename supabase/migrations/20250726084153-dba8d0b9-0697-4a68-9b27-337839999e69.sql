
-- Enable RLS on all public tables that don't currently have it
ALTER TABLE public.universidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unidades_curriculares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conteudos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cursos_unidades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unidades_conteudos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conteudos_tags ENABLE ROW LEVEL SECURITY;

-- Create read-only policies for public educational content
-- Everyone can read universities
CREATE POLICY "Anyone can view universities" 
ON public.universidades 
FOR SELECT 
USING (true);

-- Everyone can read courses
CREATE POLICY "Anyone can view courses" 
ON public.cursos 
FOR SELECT 
USING (true);

-- Everyone can read curriculum units
CREATE POLICY "Anyone can view curriculum units" 
ON public.unidades_curriculares 
FOR SELECT 
USING (true);

-- Everyone can read content
CREATE POLICY "Anyone can view content" 
ON public.conteudos 
FOR SELECT 
USING (true);

-- Everyone can read tags
CREATE POLICY "Anyone can view tags" 
ON public.tags 
FOR SELECT 
USING (true);

-- Everyone can read course-unit relationships
CREATE POLICY "Anyone can view course-unit relationships" 
ON public.cursos_unidades 
FOR SELECT 
USING (true);

-- Everyone can read unit-content relationships
CREATE POLICY "Anyone can view unit-content relationships" 
ON public.unidades_conteudos 
FOR SELECT 
USING (true);

-- Everyone can read content-tag relationships
CREATE POLICY "Anyone can view content-tag relationships" 
ON public.conteudos_tags 
FOR SELECT 
USING (true);

-- Fix database function security by recreating them with secure search path
DROP FUNCTION IF EXISTS public.handle_new_user();
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.perfis (id, nome)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

DROP FUNCTION IF EXISTS public.update_updated_at_column();
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create the trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add missing perfis table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.perfis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  avatar_url TEXT,
  universidade_id UUID REFERENCES public.universidades(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on perfis table
ALTER TABLE public.perfis ENABLE ROW LEVEL SECURITY;

-- Perfis policies
CREATE POLICY "Usuários podem ver todos os perfis" 
ON public.perfis 
FOR SELECT 
USING (true);

CREATE POLICY "Usuários podem inserir seu próprio perfil" 
ON public.perfis 
FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
ON public.perfis 
FOR UPDATE 
USING (auth.uid() = id);

-- Add trigger for perfis updated_at
DROP TRIGGER IF EXISTS update_perfis_updated_at ON public.perfis;
CREATE TRIGGER update_perfis_updated_at
  BEFORE UPDATE ON public.perfis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for repository files if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('repositorio', 'repositorio', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for the repositorio bucket
CREATE POLICY "Authenticated users can upload files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'repositorio' AND auth.role() = 'authenticated');

CREATE POLICY "Anyone can view uploaded files"
ON storage.objects FOR SELECT
USING (bucket_id = 'repositorio');

CREATE POLICY "Users can update their own files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'repositorio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files"
ON storage.objects FOR DELETE
USING (bucket_id = 'repositorio' AND auth.uid()::text = (storage.foldername(name))[1]);

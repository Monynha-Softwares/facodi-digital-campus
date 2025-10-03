-- Fix database triggers and storage setup

-- 1. Create trigger to automatically create user profiles when users sign up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Create storage bucket for repository files
INSERT INTO storage.buckets (id, name, public)
VALUES ('repositorio', 'repositorio', false)
ON CONFLICT (id) DO NOTHING;

-- 3. Create storage policies for repository bucket
CREATE POLICY "Authenticated users can upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'repositorio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files and approved files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'repositorio' AND (
    auth.uid()::text = (storage.foldername(name))[1] OR
    EXISTS (
      SELECT 1 FROM public.repositorios r 
      WHERE r.arquivo_url = name AND r.aprovado = true
    )
  )
);

CREATE POLICY "Users can update their own files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'repositorio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'repositorio' AND auth.uid()::text = (storage.foldername(name))[1]);
import { useState } from 'react';
import { useRepositorios, useUploadMaterial } from '@/hooks/useRepositorios';
import { UploadForm } from '@/components/UploadForm';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/integrations/supabase/client';

export default function Repositorio() {
  const { data: repos, isLoading, error } = useRepositorios();
  const upload = useUploadMaterial();

  const handleUpload = (file: File) => {
    upload.mutate({ file, titulo: file.name });
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="p-6 text-destructive">
            Erro ao carregar materiais: {error.message}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-4">
      <h1 className="text-3xl font-bold">Repositório</h1>
      <UploadForm onUpload={handleUpload} uploading={upload.isPending} />
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : repos && repos.length > 0 ? (
        <div className="space-y-2">
          {repos.map(r => (
            <Card key={r.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <span>{r.titulo}</span>
                <Button asChild variant="link" size="sm">
                  <a href={supabase.storage.from('repositorio').getPublicUrl(r.arquivo_url).data.publicUrl} target="_blank" rel="noreferrer">Baixar</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Nenhum material disponível.</p>
      )}
    </div>
  );
}

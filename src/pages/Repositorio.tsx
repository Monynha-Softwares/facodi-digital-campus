import { useState } from 'react';
import { useRepositorios, useUploadRepositorio } from '@/hooks/useRepositorios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UploadForm } from '@/components/UploadForm';

import { supabase } from "@/integrations/supabase/client";
export default function Repositorio() {
  const { data: repos, isLoading } = useRepositorios();
  const upload = useUploadRepositorio();
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleUpload = (file: File) => {
    upload.mutate({ file, titulo, descricao });
    setTitulo('');
    setDescricao('');
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold">Repositório</h1>

      <div className="max-w-md space-y-2">
        <Input
          placeholder="Título do material"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <Input
          placeholder="Descrição opcional"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
        />
        <UploadForm onUpload={handleUpload} uploading={upload.isPending} />
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Carregando...</p>
      ) : repos && repos.length > 0 ? (
        <div className="space-y-4">
          {repos.map((repo) => (
            <Card key={repo.id}>
              <CardContent className="p-4 space-y-1">
                <span className="font-medium">{repo.titulo}</span>
                {repo.descricao && (
                  <p className="text-sm text-muted-foreground">{repo.descricao}</p>
                )}
                <Button asChild variant="link" className="p-0 h-auto">
                  <a href={supabase.storage.from('materiais').getPublicUrl(repo.arquivo_url).data.publicUrl} target="_blank" rel="noreferrer">
                    Baixar
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Nenhum material enviado.</p>
      )}
    </div>
  );
}

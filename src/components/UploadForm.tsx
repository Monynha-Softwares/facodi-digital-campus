import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UploadFormProps {
  onUpload: (file: File) => void;
  uploading?: boolean;
}

export const UploadForm = ({ onUpload, uploading }: UploadFormProps) => {
  const [file, setFile] = useState<File | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (file) {
      onUpload(file);
      setFile(null);
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <form className="space-y-2" onSubmit={submit}>
      <Input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <Button type="submit" disabled={!file || uploading}>
        Enviar
      </Button>
    </form>
  );
};

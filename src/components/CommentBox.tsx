import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface CommentBoxProps {
  onSubmit: (text: string) => void;
  submitting?: boolean;
  placeholder?: string;
}

export const CommentBox = ({ onSubmit, submitting, placeholder }: CommentBoxProps) => {
  const [value, setValue] = useState("");

  const handleSend = () => {
    if (!value.trim()) return;
    onSubmit(value);
    setValue("");
  };

  return (
    <div className="space-y-2">
      <Textarea
        placeholder={placeholder || "Escreva um comentário"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button onClick={handleSend} disabled={submitting || !value.trim()}>
        Comentar
      </Button>
    </div>
  );
};

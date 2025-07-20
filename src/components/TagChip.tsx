import { Badge } from "@/components/ui/badge";

export interface Tag {
  nome: string;
  cor?: string | null;
}

interface TagChipProps {
  tag: Tag;
}

export const TagChip = ({ tag }: TagChipProps) => {
  return (
    <Badge
      className="tag-chip"
      style={tag.cor ? { backgroundColor: tag.cor, color: "#fff" } : undefined}
    >
      {tag.nome}
    </Badge>
  );
};

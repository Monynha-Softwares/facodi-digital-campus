
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

interface ContentItem {
  ordem: number;
  conteudos: {
    id: string;
    titulo: string;
    descricao: string | null;
    tipo: string;
    url: string | null;
    duracao_minutos: number | null;
    created_at: string;
    updated_at: string;
    conteudos_tags?: { tags: { nome: string; cor: string } }[];
  };
}

interface ContentAccordionProps {
  conteudos: ContentItem[];
  unidadeId: string;
}

export const ContentAccordion = ({ conteudos }: ContentAccordionProps) => {
  const ordered = [...conteudos].sort((a, b) => a.ordem - b.ordem);

  return (
    <Accordion type="multiple" className="w-full">
      {ordered.map((item) => (
        <AccordionItem key={item.conteudos.id} value={item.conteudos.id}>
          <AccordionTrigger>
            <span>{item.conteudos.titulo}</span>
            {item.conteudos.duracao_minutos && (
              <Badge variant="secondary" className="ml-2">
                {item.conteudos.duracao_minutos} min
              </Badge>
            )}
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            {item.conteudos.descricao && (
              <p className="text-sm text-muted-foreground">
                {item.conteudos.descricao}
              </p>
            )}
            {item.conteudos.url && (
              <a
                href={item.conteudos.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-primary underline"
              >
                Abrir conteúdo
              </a>
            )}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

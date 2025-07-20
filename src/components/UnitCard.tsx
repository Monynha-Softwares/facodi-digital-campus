import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import type { UnidadeCurricular } from "@/hooks/useUnidades";

interface UnitCardProps {
  unidade: UnidadeCurricular;
}

export const UnitCard = ({ unidade }: UnitCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <CardTitle className="group-hover:text-primary transition-colors">
          {unidade.nome}
        </CardTitle>
        {unidade.descricao && (
          <CardDescription className="line-clamp-2">
            {unidade.descricao}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{unidade.semestre}º semestre</span>
          <Badge variant="secondary">{unidade.ects} ECTS</Badge>
        </div>
        <Button asChild className="w-full">
          <Link to={`/unidade/${unidade.id}`}>Acessar Unidade</Link>
        </Button>
      </CardContent>
    </Card>
  );
};

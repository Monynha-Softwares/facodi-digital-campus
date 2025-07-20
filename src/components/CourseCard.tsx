import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, GraduationCap, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import type { Curso } from "@/hooks/useCursos";

interface CourseCardProps {
  curso: Curso;
}

export const CourseCard = ({ curso }: CourseCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
              {curso.nome}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {curso.universidades && (
                <>
                  <GraduationCap className="h-4 w-4" />
                  <span>{curso.universidades.sigla}</span>
                </>
              )}
              {curso.universidades?.cidade && (
                <>
                  <MapPin className="h-4 w-4" />
                  <span>{curso.universidades.cidade}</span>
                </>
              )}
            </div>
          </div>
        </div>
        {curso.descricao && (
          <CardDescription className="line-clamp-3">
            {curso.descricao}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{curso.duracao_semestres} semestres</span>
          </div>
          <Badge variant="secondary">
            {curso.ects_total} ECTS
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link to={`/curso/${curso.id}`}>
              Ver Detalhes
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
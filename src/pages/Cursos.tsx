import { useCursos } from "@/hooks/useCursos";
import { CourseCard } from "@/components/CourseCard";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, BookOpen } from "lucide-react";
import { useState } from "react";

export default function Cursos() {
  const { data: cursos, isLoading, error } = useCursos();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCursos = cursos?.filter(curso =>
    curso.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curso.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    curso.universidades?.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center">
          <CardContent>
            <p className="text-destructive">Erro ao carregar cursos: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <BookOpen className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Cursos Disponíveis</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore nossa oferta de cursos superiores e encontre o que melhor se adapta aos seus objetivos acadêmicos.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar cursos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <Skeleton className="h-10 w-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCursos && filteredCursos.length > 0 ? (
          <>
            <div className="text-center text-sm text-muted-foreground">
              {filteredCursos.length} curso{filteredCursos.length !== 1 ? 's' : ''} encontrado{filteredCursos.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCursos.map((curso) => (
                <CourseCard key={curso.id} curso={curso} />
              ))}
            </div>
          </>
        ) : (
          <Card className="p-8 text-center">
            <CardContent>
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum curso encontrado</h3>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "Tente ajustar sua pesquisa ou limpar os filtros."
                  : "Não há cursos disponíveis no momento."
                }
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
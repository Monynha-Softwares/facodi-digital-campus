# Hooks de API

## Sumário
- [Visão Geral](#visão-geral)
- [Assinaturas](#assinaturas)
- [Exemplos de Uso](#exemplos-de-uso)

## Visão Geral
Os hooks encapsulam chamadas ao Supabase e utilizam o TanStack Query para cache e gerenciamento de estado.

## Assinaturas
```ts
// Cursos
useCursos(): UseQueryResult<Curso[]>
useCurso(id: string): UseQueryResult<Curso>
useInscricaoCurso(): UseMutationResult<unknown, Error, { cursoId: string }>
useMeusCursos(): UseQueryResult<unknown[]>

// Unidades
useUnidades(filters?: { semestre?: number; ano_curricular?: number; tag?: string }): UseQueryResult<UnidadeCurricular[]>
useUnidade(id: string): UseQueryResult<UnidadeCurricular>
useProgressoUnidade(): UseMutationResult<unknown, Error, { unidadeId: string; conteudoId: string; concluido: boolean }>
useProgresso(unidadeId: string): UseQueryResult<ProgressoItem[]>

// Comentários
useComentarios(unidadeId: string, conteudoId?: string): UseQueryResult<Comentario[]>
useAllComentarios(orderBy?: 'recent' | 'popular'): UseQueryResult<Comentario[]>
useCriarComentario(): UseMutationResult<Comentario, Error, { texto: string; unidadeId: string; conteudoId?: string }>

// Autenticação
useAuth(): {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp(email: string, password: string, nome?: string): Promise<{ error: AuthError | null }>;
  signIn(email: string, password: string): Promise<{ error: AuthError | null }>;
  signInWithGoogle(): Promise<{ error: AuthError | null }>;
  signOut(): Promise<void>;
}
```

## Exemplos de Uso
```tsx
const { data: cursos } = useCursos();

const { data: curso } = useCurso(id);

const inscricao = useInscricaoCurso();
inscricao.mutate({ cursoId: id });
```

Os hooks utilizam `queryKey` únicos para cada recurso, permitindo `invalidateQueries` ao realizar mutações e manter o cache sincronizado.


-- Criar tabela de universidades
CREATE TABLE public.universidades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  sigla TEXT,
  pais TEXT DEFAULT 'Portugal',
  cidade TEXT,
  website TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de cursos
CREATE TABLE public.cursos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  universidade_id UUID REFERENCES public.universidades(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  duracao_semestres INTEGER DEFAULT 8,
  ects_total INTEGER DEFAULT 180,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de unidades curriculares
CREATE TABLE public.unidades_curriculares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  ects INTEGER NOT NULL DEFAULT 6,
  semestre INTEGER NOT NULL,
  ano_curricular INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de associação curso-unidades
CREATE TABLE public.cursos_unidades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  curso_id UUID REFERENCES public.cursos(id) ON DELETE CASCADE,
  unidade_id UUID REFERENCES public.unidades_curriculares(id) ON DELETE CASCADE,
  obrigatoria BOOLEAN DEFAULT true,
  UNIQUE(curso_id, unidade_id)
);

-- Criar tabela de conteúdos
CREATE TABLE public.conteudos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  tipo TEXT CHECK (tipo IN ('video', 'artigo', 'exercicio', 'projeto', 'livro')) DEFAULT 'artigo',
  url TEXT,
  duracao_minutos INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de associação unidade-conteúdos
CREATE TABLE public.unidades_conteudos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unidade_id UUID REFERENCES public.unidades_curriculares(id) ON DELETE CASCADE,
  conteudo_id UUID REFERENCES public.conteudos(id) ON DELETE CASCADE,
  ordem INTEGER DEFAULT 1,
  UNIQUE(unidade_id, conteudo_id)
);

-- Criar tabela de tags
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  cor TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de associação conteúdo-tags
CREATE TABLE public.conteudos_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conteudo_id UUID REFERENCES public.conteudos(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  UNIQUE(conteudo_id, tag_id)
);

-- Criar tabela de inscrições em cursos
CREATE TABLE public.usuarios_cursos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  curso_id UUID REFERENCES public.cursos(id) ON DELETE CASCADE,
  data_inscricao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ativo BOOLEAN DEFAULT true,
  UNIQUE(user_id, curso_id)
);

-- Criar tabela de progresso
CREATE TABLE public.progresso (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  unidade_id UUID REFERENCES public.unidades_curriculares(id) ON DELETE CASCADE,
  conteudo_id UUID REFERENCES public.conteudos(id) ON DELETE CASCADE,
  concluido BOOLEAN DEFAULT false,
  data_conclusao TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, unidade_id, conteudo_id)
);

-- Criar tabela de comentários
CREATE TABLE public.comentarios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  unidade_id UUID REFERENCES public.unidades_curriculares(id) ON DELETE CASCADE,
  conteudo_id UUID REFERENCES public.conteudos(id),
  texto TEXT NOT NULL,
  curtidas INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de repositório
CREATE TABLE public.repositorios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descricao TEXT,
  arquivo_url TEXT NOT NULL,
  tipo_arquivo TEXT,
  tamanho_kb INTEGER,
  aprovado BOOLEAN DEFAULT false,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas tabelas que precisam de segurança
ALTER TABLE public.usuarios_cursos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progresso ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repositorios ENABLE ROW LEVEL SECURITY;

-- Políticas para usuarios_cursos
CREATE POLICY "Usuários podem ver suas próprias inscrições" 
ON public.usuarios_cursos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem se inscrever em cursos" 
ON public.usuarios_cursos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar suas inscrições" 
ON public.usuarios_cursos 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Políticas para progresso
CREATE POLICY "Usuários podem ver seu próprio progresso" 
ON public.progresso 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seu próprio progresso" 
ON public.progresso 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seu próprio progresso" 
ON public.progresso 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Políticas para comentários
CREATE POLICY "Todos podem ver comentários" 
ON public.comentarios 
FOR SELECT 
USING (true);

CREATE POLICY "Usuários podem inserir seus próprios comentários" 
ON public.comentarios 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios comentários" 
ON public.comentarios 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios comentários" 
ON public.comentarios 
FOR DELETE 
USING (auth.uid() = user_id);

-- Políticas para repositorios
CREATE POLICY "Todos podem ver materiais aprovados" 
ON public.repositorios 
FOR SELECT 
USING (aprovado = true OR auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios materiais" 
ON public.repositorios 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios materiais" 
ON public.repositorios 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios materiais" 
ON public.repositorios 
FOR DELETE 
USING (auth.uid() = user_id);

-- Triggers para updated_at
CREATE TRIGGER update_universidades_updated_at
  BEFORE UPDATE ON public.universidades
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cursos_updated_at
  BEFORE UPDATE ON public.cursos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_unidades_curriculares_updated_at
  BEFORE UPDATE ON public.unidades_curriculares
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conteudos_updated_at
  BEFORE UPDATE ON public.conteudos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_progresso_updated_at
  BEFORE UPDATE ON public.progresso
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comentarios_updated_at
  BEFORE UPDATE ON public.comentarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_repositorios_updated_at
  BEFORE UPDATE ON public.repositorios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados de exemplo da UAlg
INSERT INTO public.universidades (nome, sigla, cidade, website)
VALUES ('Universidade do Algarve', 'UAlg', 'Faro', 'https://www.ualg.pt')
ON CONFLICT DO NOTHING;

-- Inserir curso de Engenharia de Sistemas
INSERT INTO public.cursos (universidade_id, nome, descricao, duracao_semestres, ects_total)
SELECT id,
  'Engenharia de Sistemas e Tecnologias Informáticas',
  'Curso focado no desenvolvimento de sistemas de informação e tecnologias emergentes',
  6,
  180
FROM public.universidades
WHERE sigla = 'UAlg'
ON CONFLICT DO NOTHING;

-- Inserir tags populares
INSERT INTO public.tags (nome, cor) VALUES
  ('Programação', '#3B82F6'),
  ('Sistemas Operativos', '#10B981'),
  ('Bases de Dados', '#F59E0B'),
  ('Redes', '#EF4444'),
  ('Algoritmos', '#8B5CF6'),
  ('Web Development', '#06B6D4'),
  ('Inteligência Artificial', '#F97316'),
  ('Cibersegurança', '#EC4899')
ON CONFLICT (nome) DO NOTHING;

-- Inserir unidades curriculares do 1º ano
INSERT INTO public.unidades_curriculares (nome, descricao, ects, semestre, ano_curricular) VALUES
  ('Programação I', 'Introdução à programação com Python', 6, 1, 1),
  ('Matemática Discreta', 'Fundamentos matemáticos para informática', 6, 1, 1),
  ('Introdução aos Sistemas de Informação', 'Conceitos básicos de sistemas de informação', 6, 1, 1),
  ('Programação II', 'Programação orientada a objetos', 6, 2, 1),
  ('Estruturas de Dados', 'Algoritmos e estruturas de dados fundamentais', 6, 2, 1),
  ('Bases de Dados I', 'Modelação e consulta de bases de dados', 6, 2, 1)
ON CONFLICT DO NOTHING;

-- Associar unidades ao curso
INSERT INTO public.cursos_unidades (curso_id, unidade_id, obrigatoria)
SELECT c.id, u.id, true
FROM public.cursos c, public.unidades_curriculares u
WHERE c.nome = 'Engenharia de Sistemas e Tecnologias Informáticas'
ON CONFLICT (curso_id, unidade_id) DO NOTHING;

-- Inserir conteúdos de exemplo
INSERT INTO public.conteudos (titulo, descricao, tipo, url, duracao_minutos) VALUES
('Python para Iniciantes', 'Tutorial completo de Python', 'video', 'https://www.youtube.com/watch?v=example1', 120),
('Algoritmos de Ordenação', 'Explicação dos principais algoritmos', 'artigo', 'https://example.com/algoritmos', 45),
('Projeto: Sistema de Gestão', 'Desenvolvimento de um sistema simples', 'projeto', null, 300),
('Exercícios de Programação', 'Lista de exercícios práticos', 'exercicio', null, 60)
ON CONFLICT DO NOTHING;

-- Associar conteúdos às unidades
INSERT INTO public.unidades_conteudos (unidade_id, conteudo_id, ordem)
SELECT u.id, c.id, 1
FROM public.unidades_curriculares u, public.conteudos c
WHERE u.nome = 'Programação I' AND c.titulo = 'Python para Iniciantes'
ON CONFLICT (unidade_id, conteudo_id) DO NOTHING;

INSERT INTO public.unidades_conteudos (unidade_id, conteudo_id, ordem)
SELECT u.id, c.id, 2
FROM public.unidades_curriculares u, public.conteudos c
WHERE u.nome = 'Estruturas de Dados' AND c.titulo = 'Algoritmos de Ordenação'
ON CONFLICT (unidade_id, conteudo_id) DO NOTHING;

-- Associar tags aos conteúdos
INSERT INTO public.conteudos_tags (conteudo_id, tag_id)
SELECT c.id, t.id
FROM public.conteudos c, public.tags t
WHERE c.titulo = 'Python para Iniciantes' AND t.nome = 'Programação'
ON CONFLICT (conteudo_id, tag_id) DO NOTHING;

INSERT INTO public.conteudos_tags (conteudo_id, tag_id)
SELECT c.id, t.id
FROM public.conteudos c, public.tags t
WHERE c.titulo = 'Algoritmos de Ordenação' AND t.nome = 'Algoritmos'
ON CONFLICT (conteudo_id, tag_id) DO NOTHING;

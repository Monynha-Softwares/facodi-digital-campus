-- Seed database with UAlg data

-- Insert university
INSERT INTO public.universidades (nome, sigla, cidade, website)
VALUES ('Universidade do Algarve', 'UAlg', 'Faro', 'https://www.ualg.pt')
ON CONFLICT DO NOTHING;

-- Insert course linked to the university
INSERT INTO public.cursos (universidade_id, nome, descricao, duracao_semestres, ects_total)
SELECT id,
  'Engenharia de Sistemas e Tecnologias Informáticas',
  'Curso focado no desenvolvimento de sistemas de informação e tecnologias emergentes',
  6,
  180
FROM public.universidades
WHERE sigla = 'UAlg'
ON CONFLICT DO NOTHING;

-- Insert initial tags
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

-- Insert first-year units
INSERT INTO public.unidades_curriculares (nome, descricao, ects, semestre, ano_curricular) VALUES
  ('Programação I', 'Introdução à programação com Python', 6, 1, 1),
  ('Matemática Discreta', 'Fundamentos matemáticos para informática', 6, 1, 1),
  ('Introdução aos Sistemas de Informação', 'Conceitos básicos de sistemas de informação', 6, 1, 1),
  ('Programação II', 'Programação orientada a objetos', 6, 2, 1),
  ('Estruturas de Dados', 'Algoritmos e estruturas de dados fundamentais', 6, 2, 1),
  ('Bases de Dados I', 'Modelação e consulta de bases de dados', 6, 2, 1)
ON CONFLICT DO NOTHING;

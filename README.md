# FACODI – Faculdade Comunitária Digital

Uma plataforma **100 % gratuita** que organiza planos curriculares de cursos superiores usando conteúdo aberto (YouTube, PDFs, exercícios, repositórios públicos).
Qualquer pessoa pode “concluir” um curso de forma autônoma enquanto monitora seu progresso e colabora com a comunidade.

---

## ✨ Principais funcionalidades

| Módulo                      | Descrição                                                           |
| --------------------------- | ------------------------------------------------------------------- |
| **Autenticação**            | Login por Google ou e-mail (Supabase Auth)                          |
| **Catálogo de cursos**      | Lista de universidades e cursos com filtros por área/ECTS           |
| **Unidades curriculares**   | Sílabo, conteúdos recomendados, comentários e marcação de conclusão |
| **Progresso**               | Barra de conclusão por curso/unidade + painel no perfil             |
| **Repositório comunitário** | Upload/ download de materiais (Supabase Storage)                    |
| **Comunidade**              | Feed global de comentários, likes e tags                            |

---

## 🛠 Stack

| Camada             | Tecnologia                            |
| ------------------ | ------------------------------------- |
| **Frontend**       | React 18 (Vite + TypeScript)          |
| **UI/UX**          | TailwindCSS + shadcn/ui               |
| **Estado & Cache** | TanStack Query                        |
| **Auth & DB**      | Supabase (PostgreSQL + Storage)       |
| **Hospedagem**     | Vercel                                |
| **Testes**         | Vitest + React Testing Library        |
| **CI**             | GitHub Actions                        |
| **Lint/Format**    | ESLint + Prettier + Husky/lint-staged |

---

## ⚡ Instalação local

```bash
# 1. Clone o repositório
git clone https://github.com/Moninhay/facodi-digital-campus.git
cd facodi-digital-campus

# 2. Instale dependências
npm install     # ou pnpm install / yarn

# 3. Configure variáveis de ambiente
cp .env.example .env.local
# edite .env.local com suas chaves Supabase

# 4. Rode em modo desenvolvimento
npm run dev
```

> A aplicação abre em [http://localhost:5173](http://localhost:5173)

---

## 🔐 Variáveis de ambiente

| Chave                    | Descrição                          |
| ------------------------ | ---------------------------------- |
| `VITE_SUPABASE_URL`      | URL do projeto Supabase            |
| `VITE_SUPABASE_ANON_KEY` | API anon key do Supabase           |
| `VITE_SUPABASE_STORAGE`  | (opcional) bucket para repositório |

---

## 🗄️ Configuração do Supabase

1. **Crie um novo projeto** em [https://supabase.com](https://supabase.com).
2. **Execute o script `supabase/schema.sql`** (migra todas as 15 tabelas, enums, triggers e policies RLS).
3. **Popule dados de exemplo** rodando `supabase/seed.sql` *(Universidade do Algarve → Engenharia de Sistemas e Tecnologias Informáticas)*.
4. Crie um **bucket Storage** chamado `materiais` para uploads da comunidade.

---

## 👀 Scripts NPM úteis

| Comando    | Ação                      |
| ---------- | ------------------------- |
| `dev`      | inicia Vite em modo dev   |
| `build`    | gera bundle de produção   |
| `preview`  | pré-visualiza build local |
| `lint`     | eslint + formatter        |
| `test`     | roda Vitest               |
| `coverage` | abre relatório de testes  |

---

## 🚀 Deploy

> **Recomendado:** Vercel

1. Conecte seu repositório no painel Vercel.
2. Adicione as variáveis de ambiente acima em *Settings → Environment Variables*.
3. Clique em **Deploy**. A Vercel detecta Vite e cria o pipeline automático.

---

## 🧪 Qualidade & CI

* **GitHub Actions** executa `lint`, `test` e `build` a cada PR.
* **Vitest** cobre hooks críticos (`useAuth`, `useCursos`, etc.).
* Lighthouse ≥ 90 em performance e acessibilidade (lazy-load de rotas e imagens).

---

## 🤝 Contribuindo

1. Faça um fork do projeto.
2. Crie uma branch (`git checkout -b feature/minha-feature`).
3. Commit suas mudanças (`git commit -m 'feat: minha feature'`).
4. Push para o fork (`git push origin feature/minha-feature`).
5. Abra um **Pull Request**.

---

## 📄 Licença

Distribuído sob licença **MIT**. Veja `LICENSE` para mais informações.

---

> **FACODI** © 2025 – Uma iniciativa de educação aberta. Sinta-se livre para usar, estudar, copiar e compartilhar ❤️

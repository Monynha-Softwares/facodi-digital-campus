# Welcome to your Lovable project
[![CI](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/ci.yml/badge.svg)](https://github.com/YOUR_ORG/YOUR_REPO/actions/workflows/ci.yml)

## Project goals

FACODI Digital Campus centraliza planos curriculares de cursos superiores e
facilita a troca de conhecimento entre estudantes por meio de uma comunidade
colaborativa alimentada com conteúdos gratuitos da internet.

## Project info

**URL**: https://lovable.dev/projects/e2a4592e-1f23-4523-84f9-4a25af8f78be

### Novos recursos

- Hooks `useCurso` e `useUnidade` para obter dados individuais do Supabase.
- Páginas `/curso/:id` e `/unidade/:id` exibindo detalhes e conteúdos.
- Componentes `UnitCard` e `ContentAccordion` para organização de unidades e conteúdos.

## Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Supabase CLI](https://supabase.com/docs/guides/cli) for local development

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e2a4592e-1f23-4523-84f9-4a25af8f78be) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

Make sure you have Node.js and npm installed - we recommend using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm install

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

### Useful commands

- `npm run lint` – run ESLint over the project
- `npm test` – execute unit tests with Vitest
- `npm run build` – create a production build in `dist/`

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Supabase quick start

1. Install the [Supabase CLI](https://supabase.com/docs/guides/cli):
   ```sh
   npm install -g supabase
   ```
2. Apply migrations from the `supabase` folder:
   ```sh
   supabase db reset --linked
   ```
   or
   ```sh
   supabase db push
   ```
3. Seed the database with initial UAlg data:
   ```sh
   supabase db execute < supabase/seed.sql
   ```

### Environment variables

Copy `.env.example` to `.env` and update the values with your Supabase project credentials:

```sh
cp .env.example .env
# then edit .env
```

`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are used in `src/integrations/supabase/client.ts` to connect the frontend with your Supabase instance.

## Continuous integration

This repository includes a GitHub Actions workflow at `.github/workflows/ci.yml` that runs linting and unit tests on every pull request.

## How can I deploy this project?

First create a production build:

```sh
npm run build
```

The generated `dist/` directory can be deployed to any static host such as Vercel or Netlify. If you're using Lovable, open [your project](https://lovable.dev/projects/e2a4592e-1f23-4523-84f9-4a25af8f78be) and click Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

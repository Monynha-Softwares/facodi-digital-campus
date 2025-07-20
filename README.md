# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/e2a4592e-1f23-4523-84f9-4a25af8f78be

### Novos recursos

- Hooks `useCurso` e `useUnidade` para obter dados individuais do Supabase.
- Páginas `/curso/:id` e `/unidade/:id` exibindo detalhes e conteúdos.
- Componentes `UnitCard` e `ContentAccordion` para organização de unidades e conteúdos.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/e2a4592e-1f23-4523-84f9-4a25af8f78be) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

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

## External dependencies and licenses

This project relies on several open source libraries. Key dependencies and their licenses include:

- [React](https://github.com/facebook/react/blob/main/LICENSE) – MIT License
- [Vite](https://github.com/vitejs/vite/blob/main/LICENSE) – MIT License
- [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE) – MIT License
- [shadcn-ui](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md) – MIT License
- [Supabase JS](https://github.com/supabase/supabase-js/blob/master/LICENSE) – MIT License
- [Radix UI](https://github.com/radix-ui/primitives/blob/main/LICENSE) – MIT License
- [React Router](https://github.com/remix-run/react-router/blob/main/LICENSE.md) – MIT License
- [TanStack Query](https://github.com/TanStack/query/blob/main/LICENSE) – MIT License
- [Zod](https://github.com/colinhacks/zod/blob/master/LICENSE) – MIT License
- [Lucide](https://github.com/lucide-icons/lucide/blob/main/LICENSE) – ISC License

All other dependencies are distributed under their respective open-source licenses.

## Database setup

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

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/e2a4592e-1f23-4523-84f9-4a25af8f78be) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

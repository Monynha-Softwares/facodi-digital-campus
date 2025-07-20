# MoninhAI Web Spark

![CI/CD Status](https://github.com/moninhai/moninhai-web-spark/actions/workflows/deploy.yml/badge.svg)

**MoninhAI Web Spark** is a public demo for the fictional AI consulting agency **MoninhAI**. This project features a **React + Vite** frontend integrated with a **Supabase** backend, implementing authentication, data fetching, and internationalization via `react-i18next`.

---

## 🎯 Project Goals

This repository serves as a reference for building a small SaaS frontend. It demonstrates:

* Component structure in React
* Global state management
* Secure integration with Supabase tables using **Row Level Security (RLS)**

---

## 🚀 Running Locally

1. **Clone the repository**

   ```bash
   git clone <repo-url>
   cd moninhai-web-spark
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   # edit .env and set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173).

---

## 📜 Available Scripts

| Command           | Description                            |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Start the Vite development server      |
| `npm run build`   | Generate a production build in `dist/` |
| `npm run lint`    | Run ESLint                             |
| `npm run test`    | Run unit tests with Jest               |
| `npm run format`  | Format the codebase using Prettier     |
| `npm run sitemap` | Generate `public/sitemap.xml`          |

---

## 🗂 Folder Structure

```
src/
  components/      Reusable UI components
  hooks/           Custom React hooks
  integrations/    Supabase client and type definitions
  pages/           Route-level components (e.g. <About />)
  lib/             Utility functions
```

---

## 🔗 Key Dependencies

* [React](https://react.dev) + [Vite](https://vitejs.dev)
* [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
* [Supabase JS SDK](https://supabase.com)
* [TanStack React Query](https://tanstack.com/query)
* [react-i18next](https://react.i18next.com)

---

## 📱 Responsive Navigation Menu

The `Header` component implements a responsive navigation bar using Tailwind CSS utility classes. On wider screens (`md` and up), menu items are displayed horizontally. On smaller screens, a hamburger icon toggles a vertical menu.

👉 See [`src/components/Header.tsx`](src/components/Header.tsx) for the implementation with inline comments.

---

## 🧩 Supabase

Supabase is used for data persistence. Tables defined in `supabase/migrations` include:

* `leads` – contact form submissions
* `newsletter_subscribers` – email list
* `solutions`, `repositories`, `team_members` – website content

RLS (Row Level Security) ensures that only authenticated admins can write data. Public read access is granted only for rows marked as `active`.

All API interactions are handled through `src/integrations/supabase/client.ts`.

📘 See [docs/architecture.md](docs/architecture.md) for a high-level diagram.
🎨 For tag color mappings, check [docs/tag-styles.md](docs/tag-styles.md).

---

## ⚙️ CI/CD

Commits and pull requests to the `main` branch trigger `.github/workflows/deploy.yml`, which:

* Installs dependencies
* Runs linting and tests
* Deploys the project to Vercel

Make sure to configure the following repository secrets:

* `VERCEL_TOKEN`
* `VERCEL_ORG_ID`
* `VERCEL_PROJECT_ID`

---

## 📄 License

Distributed under the [MIT License](LICENSE).

---

Let me know if you’d like a bilingual (English + Portuguese) version or a switchable README for different audiences.

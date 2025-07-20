import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Header } from "@/components/Header";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Cursos from "./pages/Cursos";
import CursoDetalhe from "./pages/CursoDetalhe";
import UnidadeDetalhe from "./pages/UnidadeDetalhe";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/curso/:id" element={<CursoDetalhe />} />
            <Route
              path="/unidade/:id"
              element={
                <ProtectedRoute>
                  <UnidadeDetalhe />
                </ProtectedRoute>
              }
            />
            <Route path="/unidades" element={
              <ProtectedRoute>
                <div className="container mx-auto py-8">
                  <h1 className="text-3xl font-bold">Unidades Curriculares</h1>
                  <p className="text-muted-foreground mt-2">Em desenvolvimento...</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/comunidade" element={
              <ProtectedRoute>
                <div className="container mx-auto py-8">
                  <h1 className="text-3xl font-bold">Comunidade</h1>
                  <p className="text-muted-foreground mt-2">Em desenvolvimento...</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/repositorio" element={
              <ProtectedRoute>
                <div className="container mx-auto py-8">
                  <h1 className="text-3xl font-bold">Repositório</h1>
                  <p className="text-muted-foreground mt-2">Em desenvolvimento...</p>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/perfil" element={
              <ProtectedRoute>
                <div className="container mx-auto py-8">
                  <h1 className="text-3xl font-bold">Perfil</h1>
                  <p className="text-muted-foreground mt-2">Em desenvolvimento...</p>
                </div>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

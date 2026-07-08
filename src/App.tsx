import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CadastrarIgreja from "./pages/CadastrarIgreja";
import SelecionarEquipes from "./pages/SelecionarEquipes";
import IgrejaDetalhes from "./pages/IgrejaDetalhes";
import AceitarConvite from "./pages/AceitarConvite";
import EquipePainel from "./pages/EquipePainel";
import LiderPainel from "./pages/LiderPainel";
import MembroPainel from "./pages/MembroPainel";
import CadastrarMembros from "./pages/CadastrarMembros";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cadastrar-igreja" element={<CadastrarIgreja />} />
            <Route path="/igreja/:igrejaId" element={<IgrejaDetalhes />} />
            <Route path="/igreja/:igrejaId/equipes" element={<SelecionarEquipes />} />
            <Route path="/equipe/:equipeId" element={<EquipePainel />} />
            <Route path="/equipe/:equipeId/membros" element={<CadastrarMembros />} />
            <Route path="/lider" element={<LiderPainel />} />
            <Route path="/membro" element={<MembroPainel />} />
            <Route path="/aceitar-convite" element={<AceitarConvite />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

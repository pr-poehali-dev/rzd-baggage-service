import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/cabinet/Login";
import Dashboard from "./pages/cabinet/Dashboard";
import Orders from "./pages/cabinet/Orders";
import Profile from "./pages/cabinet/Profile";
import Partners from "./pages/cabinet/Partners";
import CabinetPreview from "./pages/cabinet/Preview";
import PartnersLanding from "./pages/PartnersLanding";
import CabinetLayout from "./layouts/CabinetLayout";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/partners" element={<PartnersLanding />} />
            <Route path="/cabinet/login" element={<Login />} />
            <Route path="/cabinet/preview" element={<CabinetPreview />} />
            <Route path="/cabinet" element={<CabinetLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="orders" element={<Orders />} />
              <Route path="partners" element={<Partners />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
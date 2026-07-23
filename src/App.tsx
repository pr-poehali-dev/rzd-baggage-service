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

import PartnerLogin from "./pages/partner/PartnerLogin";
import Clients from "./pages/partner/Clients";
import PartnerOrders from "./pages/partner/PartnerOrders";
import PartnerHistory from "./pages/partner/PartnerHistory";
import PartnerReports from "./pages/partner/PartnerReports";
import PartnerLayout from "./layouts/PartnerLayout";
import { PartnerProvider } from "./context/PartnerContext";

import SuperAdminLogin from "./pages/superadmin/SuperAdminLogin";
import SuperAdminPartners from "./pages/superadmin/SuperAdminPartners";
import SuperAdminLoyalty from "./pages/superadmin/SuperAdminLoyalty";
import SuperAdminLayout from "./layouts/SuperAdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <PartnerProvider>
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

              <Route path="/partner/login" element={<PartnerLogin />} />
              <Route path="/partner" element={<PartnerLayout />}>
                <Route index element={<Clients />} />
                <Route path="orders" element={<PartnerOrders />} />
                <Route path="history" element={<PartnerHistory />} />
                <Route path="reports" element={<PartnerReports />} />
              </Route>

              <Route path="/superadmin/login" element={<SuperAdminLogin />} />
              <Route path="/superadmin" element={<SuperAdminLayout />}>
                <Route path="partners" element={<SuperAdminPartners />} />
                <Route path="loyalty" element={<SuperAdminLoyalty />} />
              </Route>

              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </PartnerProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
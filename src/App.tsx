import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import AdminRoute from "@/components/AdminRoute";
import Index from "./pages/Index";
import WritePage from "./pages/WritePage";
import ProfilePage from "./pages/ProfilePage";
import PromisesPage from "./pages/PromisesPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import TrackingPage from "./pages/TrackingPage";
import TransparencyPage from "./pages/TransparencyPage";
import AppointmentPage from "./pages/AppointmentPage";
import SuccessStoriesPage from "./pages/SuccessStoriesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/write" element={<WritePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/promises" element={<PromisesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/tracking" element={<TrackingPage />} />
            <Route path="/transparency" element={<TransparencyPage />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="/success-stories" element={<SuccessStoriesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

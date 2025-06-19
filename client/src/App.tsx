
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import History from "./pages/History";
import Settings from "./pages/Settings";
import DailyGoals from "./pages/DailyGoals";
import Notifications from "./pages/Notifications";
import HealthPreferences from "./pages/HealthPreferences";
import Privacy from "./pages/Privacy";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import { DrinkProvider } from "./contexts/DrinkContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DrinkProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/daily-goals" element={<DailyGoals />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/health-preferences" element={<HealthPreferences />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DrinkProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

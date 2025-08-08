import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./components/auth/Login";
import RestaurantAdminDashboard from "./pages/restaurantAdmin/RestaurantAdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public route */}
          <Route path="/" element={<Login />} />

          {/* Dashboard routes wrapped in AppLayout */}
          <Route
            path="/restaurant-admin/*"
            element={
              <AppLayout>
                <RestaurantAdminDashboard />
              </AppLayout>
            }
          />
          <Route
            path="/index"
            element={
              <AppLayout>
                <Index />
              </AppLayout>
            }
          />

          <Route
            path="/index"
            element={
              <AppLayout>
                <Index />
              </AppLayout>
            }
          />

          {/* Catch-all route */}
          <Route
            path="*"
            element={
              <AppLayout>
                <NotFound />
              </AppLayout>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

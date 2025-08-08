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
import RestaurantList from "./pages/restaurantAdmin/Restaurants/RestaurantsList";
import { AdminReports } from "./pages/restaurantAdmin/Reports/AdminReports";

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
            path="/admin-dashboard"
            element={
              <AppLayout>
                <RestaurantAdminDashboard />
              </AppLayout>
            }
          />
          <Route
            path="/restaurants-admin"
            element={
              <AppLayout>
                <RestaurantList />
              </AppLayout>
            }
          />
          <Route
            path="/admin-reports"
            element={
              <AppLayout>
                <AdminReports />
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

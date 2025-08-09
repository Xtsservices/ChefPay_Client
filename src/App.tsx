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
import RestaurantManagerDashboard from "./pages/restaurantManager/RestaurantManagerDashboard";
import RestaurantManagerOrders from "./pages/restaurantManager/RestaurantOrders/RestaurantManagerOrders";
import RestaurentManageMenu from "./pages/restaurantManager/RestaurentMenu/RestaurentManageMenu";
import ItemsList from "./pages/restaurantManager/RestaurentItems/ItemsList";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "./store/storeTypes";
import { apiGet } from "./api/apis";

const queryClient = new QueryClient();

const App = () => {
  const hasFetchedUser = useRef(false);
  const dispatch = useDispatch();

  const currentUserData = useSelector(
    (state: AppState) => state.currentUserData || ""
  );

  const getCurrentUser = async () => {
    try {
      const userData = await apiGet("/getProfile");

      console.log("userDatap", userData);

      if (userData?.data) {
        console.log("userData====dispatch", userData.data);
        const role = userData.data.data.userRoles[0].role.name;
        
        console.log("userDatarole", role);

        dispatch({ type: "currentUserData", payload: userData.data });
        dispatch({ type: "role", payload: role });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !currentUserData && !hasFetchedUser.current) {
      hasFetchedUser.current = true; // ✅ Prevent future fetch attempts
      getCurrentUser();
    }
  }, [currentUserData]);

  return (
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

            {/* Dashboard routes wrapped in AppLayout */}

            {/* ====================RestaurantManagerDashboard============= */}
            <Route
              path="/restaurant-manager-dashboard"
              element={
                <AppLayout>
                  <RestaurantManagerDashboard />
                </AppLayout>
              }
            />

            <Route
              path="/restaurant-orders"
              element={
                <AppLayout>
                  <RestaurantManagerOrders />
                </AppLayout>
              }
            />
            <Route
              path="/restaurant-menu"
              element={
                <AppLayout>
                  <RestaurentManageMenu />
                </AppLayout>
              }
            />
            <Route
              path="/restaurant-items"
              element={
                <AppLayout>
                  <ItemsList />
                </AppLayout>
              }
            />
            <Route
              path="/restaurant-reports"
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
};

export default App;

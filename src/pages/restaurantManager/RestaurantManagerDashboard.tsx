import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RefreshCw, ShoppingCart } from "lucide-react";
import RestaurantTodaysOrders from "./RestaurantTodaysOrders";
import OrderDetailsModal from "@/common/OrderDetailsModal";
import { apiGet } from "@/api/apis";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  isVeg: boolean;
};

type OrderDetails = {
  orderId: string;
  customerNumber: string;
  restaurantInfo: string;
  amount: number;
  status: "Placed" | "Pending" | "Completed" | "Processing";
  time: string;
  customerName: string;
  deliveryAddress: string;
  paymentMethod: string;
  items: OrderItem[];
};

const RestaurantManagerDashboard: React.FC = () => {
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
  });
  const currentUserData = useSelector((state: any) => state.currentUserData);

  // ✅ Set default date range to today
  useEffect(() => {
    const today = new Date();
    setStartDate(today);
    setEndDate(today);
  }, []); // Runs only on mount

  // ✅ Fetch orders from API
  const fetchOrders = async (
    canteenId: number,
    start: Date | null,
    end: Date | null
  ) => {
    try {
      setIsRefreshing(true);
      const formatDate = (date: Date | null) =>
        date ? date.toISOString().split("T")[0] : "";
      
      const queryParams = new URLSearchParams({
        ...(start && { startDate: formatDate(start) }),
        ...(end && { endDate: formatDate(end) }),
      }).toString();
//canteenId
      const response = await apiGet(
        `/orders/getallordersbycanteenId/${canteenId}?${queryParams}`
      );

      if (response.status === 200 && response.data?.data) {
        const formattedOrders: OrderDetails[] = response?.data?.data?.orders.map(
          (order: any) => ({
            orderId: order.orderId?.toString() || "N/A",
            customerNumber: order.user?.mobile || "N/A",
            restaurantInfo: "Restaurant A", // Replace with actual info
            amount: parseFloat(order.totalAmount || 0),
            status:
              order.orderStatus?.toLowerCase() === "pending"
                ? "Pending"
                : order.orderStatus?.toLowerCase() === "completed"
                ? "Completed"
                : order.orderStatus?.toLowerCase() === "processing"
                ? "Processing"
                : "Placed",
            time: order.createdAt
              ? new Date(order.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "N/A",
            customerName: order.user?.name || "N/A",
            deliveryAddress: order.deliveryAddress || "N/A",
            paymentMethod: order.payment?.status || "N/A",
            items:
              order.items?.map((i: any, idx: number) => ({
                id: i.orderItemId?.toString() || idx.toString(),
                name: i.itemName || "Unknown Item",
                quantity: i.quantity || 1,
                image:i.image,
                price:
                  parseFloat(order.totalAmount || 0) /
                  (order.items?.length || 1), // Approximate per item
                isVeg: i.foodType === "veg",
              })) || [],
          })
        );
        setOrders(formattedOrders);
      } else {
        setOrders([]);
        console.error("Failed to fetch orders", response);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setIsRefreshing(false);
    }
  };

  // ✅ Fetch dashboard stats
  const fetchDashboardStats = async (
    canteenId: number,
    start: Date | null,
    end: Date | null
  ) => {
    try {
      const formatDate = (date: Date | null) =>
        date ? date.toISOString().split("T")[0] : "";
      
      const queryParams = new URLSearchParams({
        ...(start && { startDate: formatDate(start) }),
        ...(end && { endDate: formatDate(end) }),
      }).toString();
//canteenId
      const data = await apiGet(`/orders/today-stats/${canteenId}?${queryParams}`);
      console.log("Dashboard stats data:", data);
      if (data.status === 200) {
        const statsData = data.data;
        console.log("changed statsData", statsData.data);
        setStats({
          totalRevenue: statsData?.data?.todayTotalAmount || 0,
          totalOrders: statsData?.data?.todayOrderCount || 0,
        });
      }
    } catch (e) {
      console.log("Error fetching dashboard stats:", e);
    }
  };

  // ✅ Fetch orders and stats on mount or date change
  useEffect(() => {
    if (currentUserData && currentUserData.canteenId && startDate && endDate) {
      fetchOrders(currentUserData.canteenId, startDate, endDate);
      fetchDashboardStats(currentUserData.canteenId, startDate, endDate);
    }
  }, [currentUserData, startDate, endDate]);

  const handleRefresh = () => {
    if (currentUserData && currentUserData.canteenId && startDate && endDate) {
      fetchOrders(currentUserData.canteenId, startDate, endDate);
      fetchDashboardStats(currentUserData.canteenId, startDate, endDate);
    }
  };

  const handleViewOrder = (orderId: string) => {
    const order = orders.find(
      (o) => o.orderId.toString() === orderId.toString()
    );
    if (order) setSelectedOrder(order);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  // Stats (client-side calculation as fallback)
  const totalRevenue = orders.reduce((acc, o) => acc + o.amount, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "Completed").length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Revenue */}
        <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-elegant transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Today's Revenue
              </p>
              <div className="flex items-center">
                <span className="text-xs text-foreground">₹</span>
                <span className="text-2xl font-bold text-foreground ml-1">
                  {stats.totalRevenue.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="text-muted-foreground">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Today's Orders */}
        <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-elegant transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Today's Orders
              </p>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalOrders}
              </p>
            </div>
            <div className="text-muted-foreground">
              <ShoppingCart className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Completed Orders (Commented out as in original) */}
        {/* <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-elegant transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Completed Orders
              </p>
              <p className="text-2xl font-bold text-foreground">
                {completedOrders}
              </p>
            </div>
            <div className="text-muted-foreground">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div> */}
      </div>

      {/* Header & Sync */}
      <div className="flex items-center justify-between mt-6">
        <div></div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
            isRefreshing
              ? "bg-muted text-muted-foreground border-gray-300 cursor-not-allowed"
              : "bg-gradient-primary text-white hover:shadow-elegant"
          }`}
        >
          <RefreshCw
            className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span>Sync</span>
        </button>
      </div>

      {/* Orders Table Component */}
      <RestaurantTodaysOrders orders={orders} onViewOrder={handleViewOrder} />

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />

      {/* Sync Loader */}
      {isRefreshing && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-card p-6 rounded-lg shadow-xl flex flex-col items-center">
            <RefreshCw className="w-8 h-8 animate-spin text-primary mb-4" />
            <p className="text-lg font-semibold text-foreground">
              Syncing orders...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantManagerDashboard;
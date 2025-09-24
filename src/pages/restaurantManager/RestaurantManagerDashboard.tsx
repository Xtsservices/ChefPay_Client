// // RestaurantManagerDashboard.tsx
// import React, { useState } from "react";
// import { RefreshCw, ShoppingCart } from "lucide-react";
// import RestaurantTodaysOrders from "./RestaurantTodaysOrders";
// import OrderDetailsModal from "@/common/OrderDetailsModal";

// type Order = {
//   orderId: string;
//   customerNumber: string;
//   amount: number;
//   status: "Placed";
//   orderTime: string;
//   items: string[];
//   customerName: string;
//   deliveryAddress: string;
//   paymentMethod: string;
// };

// type OrderDetails = {
//   orderId: string;
//   customerNumber: string;
//   restaurantInfo: string;
//   amount: number;
//   status: "Placed";
//   time: string;
//   customerName: string;
//   deliveryAddress: string;
//   paymentMethod: string;
//   items: {
//     id: string;
//     name: string;
//     quantity: number;
//     price: number;
//     isVeg: boolean;
//   }[];
// };

// const RestaurantManagerDashboard: React.FC = () => {
//   const [isRefreshing, setIsRefreshing] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);

//   // Sample orders data
//   const allOrders: Order[] = [
//     {
//       orderId: "#ORD-001",
//       customerNumber: "+91 9876543210",
//       amount: 450,
//       status: "Placed",
//       orderTime: "12:30 PM",
//       items: ["Chicken Biryani", "Raita"],
//       customerName: "John Doe",
//       deliveryAddress: "123 Main St, Hyderabad",
//       paymentMethod: "Online Payment",
//     },
//     {
//       orderId: "#ORD-002",
//       customerNumber: "+91 9876543211",
//       amount: 320,
//       status: "Placed",
//       orderTime: "12:45 PM",
//       items: ["Paneer Butter Masala", "Naan"],
//       customerName: "Jane Smith",
//       deliveryAddress: "456 Park Ave, Hyderabad",
//       paymentMethod: "Cash on Delivery",
//     },
//     {
//       orderId: "#ORD-003",
//       customerNumber: "+91 9876543212",
//       amount: 680,
//       status: "Placed",
//       orderTime: "1:15 PM",
//       items: ["Mutton Curry", "Rice"],
//       customerName: "Mike Johnson",
//       deliveryAddress: "789 Oak Road, Hyderabad",
//       paymentMethod: "Online Payment",
//     },
//     {
//       orderId: "#ORD-004",
//       customerNumber: "+91 9876543213",
//       amount: 290,
//       status: "Placed",
//       orderTime: "1:30 PM",
//       items: ["Masala Dosa", "Coffee"],
//       customerName: "Sarah Wilson",
//       deliveryAddress: "321 Pine St, Hyderabad",
//       paymentMethod: "Online Payment",
//     },
//     {
//       orderId: "#ORD-005",
//       customerNumber: "+91 9876543214",
//       amount: 520,
//       status: "Placed",
//       orderTime: "2:00 PM",
//       items: ["Fish Curry", "Rice", "Papad"],
//       customerName: "David Brown",
//       deliveryAddress: "654 Elm Street, Hyderabad",
//       paymentMethod: "Cash on Delivery",
//     },
//     {
//       orderId: "#ORD-006",
//       customerNumber: "+91 9876543215",
//       amount: 380,
//       status: "Placed",
//       orderTime: "2:15 PM",
//       items: ["Veg Thali", "Lassi"],
//       customerName: "Emily Davis",
//       deliveryAddress: "987 Maple Ave, Hyderabad",
//       paymentMethod: "Online Payment",
//     },
//     {
//       orderId: "#ORD-007",
//       customerNumber: "+91 9876543216",
//       amount: 420,
//       status: "Placed",
//       orderTime: "2:30 PM",
//       items: ["Chicken Tikka", "Naan", "Salad"],
//       customerName: "Robert Miller",
//       deliveryAddress: "147 Cedar Lane, Hyderabad",
//       paymentMethod: "Online Payment",
//     },
//     {
//       orderId: "#ORD-008",
//       customerNumber: "+91 9876543217",
//       amount: 350,
//       status: "Placed",
//       orderTime: "2:45 PM",
//       items: ["Idli Sambar", "Coconut Chutney"],
//       customerName: "Lisa Garcia",
//       deliveryAddress: "258 Birch Road, Hyderabad",
//       paymentMethod: "Cash on Delivery",
//     },
//     {
//       orderId: "#ORD-009",
//       customerNumber: "+91 9876543218",
//       amount: 590,
//       status: "Placed",
//       orderTime: "3:00 PM",
//       items: ["Prawns Curry", "Rice", "Fish Fry"],
//       customerName: "James Martinez",
//       deliveryAddress: "369 Walnut St, Hyderabad",
//       paymentMethod: "Online Payment",
//     },
//     {
//       orderId: "#ORD-010",
//       customerNumber: "+91 9876543219",
//       amount: 310,
//       status: "Placed",
//       orderTime: "3:15 PM",
//       items: ["Chole Bhature", "Pickle"],
//       customerName: "Amanda Taylor",
//       deliveryAddress: "741 Cherry Ave, Hyderabad",
//       paymentMethod: "Online Payment",
//     },
//     {
//       orderId: "#ORD-011",
//       customerNumber: "+91 9876543220",
//       amount: 460,
//       status: "Placed",
//       orderTime: "3:30 PM",
//       items: ["Butter Chicken", "Garlic Naan", "Rice"],
//       customerName: "Kevin Anderson",
//       deliveryAddress: "852 Peach Street, Hyderabad",
//       paymentMethod: "Cash on Delivery",
//     },
//     {
//       orderId: "#ORD-012",
//       customerNumber: "+91 9876543221",
//       amount: 280,
//       status: "Placed",
//       orderTime: "3:45 PM",
//       items: ["Samosa", "Tea"],
//       customerName: "Michelle Thomas",
//       deliveryAddress: "963 Apple Lane, Hyderabad",
//       paymentMethod: "Online Payment",
//     },
//     {
//       orderId: "#ORD-013",
//       customerNumber: "+91 9876543222",
//       amount: 640,
//       status: "Placed",
//       orderTime: "4:00 PM",
//       items: ["Tandoori Chicken", "Butter Naan", "Dal"],
//       customerName: "Christopher White",
//       deliveryAddress: "159 Orange Road, Hyderabad",
//       paymentMethod: "Online Payment",
//     },
//   ];

//   const handleRefresh = async () => {
//     setIsRefreshing(true);
//     // Simulate API call
//     setTimeout(() => {
//       setIsRefreshing(false);
//       console.log("Orders refreshed");
//     }, 2000);
//   };

//   const handleViewOrder = (orderId: string) => {
//     const order = allOrders.find((o) => o.orderId === orderId);
//     if (order) {
//       const orderDetails: OrderDetails = {
//         orderId: order.orderId,
//         customerNumber: order.customerNumber,
//         restaurantInfo: "Restaurant A",
//         amount: order.amount,
//         status: order.status,
//         time: order.orderTime,
//         customerName: order.customerName,
//         deliveryAddress: order.deliveryAddress,
//         paymentMethod: order.paymentMethod,
//         items: order.items.map((item, index) => ({
//           id: (index + 1).toString(),
//           name: item,
//           quantity: 1, // Assuming quantity 1 for sample
//           price: order.amount / order.items.length, // Approximate price for sample
//           isVeg: Math.random() > 0.5, // Random for sample
//         })),
//       };
//       setSelectedOrder(orderDetails);
//     }
//   };

//   const handleCloseModal = () => {
//     setSelectedOrder(null);
//   };

//   return (
//     <>
//       <div className="space-y-6">
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Today's Revenue */}
//           <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-elegant transition-all duration-300">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground mb-1">
//                   Today's Revenue--
//                 </p>
//                 <div className="flex items-center">
//                   <span className="text-xs text-foreground">₹</span>
//                   <span className="text-2xl font-bold text-foreground ml-1">
//                     18,450
//                   </span>
//                 </div>
//               </div>
//               <div className="text-muted-foreground">
//                 <svg
//                   className="w-8 h-8"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* Today's Orders */}
//           <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-elegant transition-all duration-300">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground mb-1">
//                   Today's Orders
//                 </p>
//                 <p className="text-2xl font-bold text-foreground">1,247</p>
//               </div>
//               <div className="text-muted-foreground">
//                 <ShoppingCart className="w-8 h-8" />
//               </div>
//             </div>
//           </div>

//           {/* Completed Orders */}
//           <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-elegant transition-all duration-300">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-muted-foreground mb-1">
//                   Completed Orders
//                 </p>
//                 <p className="text-2xl font-bold text-foreground">1,224</p>
//               </div>
//               <div className="text-muted-foreground">
//                 <svg
//                   className="w-8 h-8"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Header Section */}
//         <div className="flex items-center justify-between">
//           <div>
//             {/* <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
//         Canteen Admin Dashboard
//       </h1> */}
//           </div>

//           {/* Sync Button */}
//           <button
//             onClick={handleRefresh}
//             disabled={isRefreshing}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
//               isRefreshing
//                 ? "bg-muted text-muted-foreground border-gray-300 cursor-not-allowed"
//                 : "bg-gradient-primary text-white hover:shadow-elegant"
//             }`}
//           >
//             <RefreshCw
//               className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
//             />
//             <span>Sync</span>
//           </button>
//         </div>

//         {/* Orders Table Component */}
//         <RestaurantTodaysOrders
//           orders={allOrders}
//           onViewOrder={handleViewOrder}
//         />

//         {/* Order Details Modal */}
//         <OrderDetailsModal order={selectedOrder} onClose={handleCloseModal} />

//         {/* Sync Loader Overlay */}
//         {isRefreshing && (
//           <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
//             <div className="bg-card p-6 rounded-lg shadow-xl flex flex-col items-center">
//               <RefreshCw className="w-8 h-8 animate-spin text-primary mb-4" />
//               <p className="text-lg font-semibold text-foreground">
//                 Syncing orders...
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default RestaurantManagerDashboard;
// RestaurantManagerDashboard.tsx
import React, { useEffect, useState } from "react";
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

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setIsRefreshing(true);
      const response = await apiGet("/orders/getallordersbycanteenId/1"); // Replace 1 with actual canteenId
      if (response.data?.success && response.data.data) {
        const formattedOrders: OrderDetails[] = response.data.data.map(
          (order: any) => ({
            orderId: order.orderId?.toString() || "N/A",
            customerNumber: order.user?.mobile || "N/A",
            restaurantInfo: "Restaurant A", // You can replace with actual info
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

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleRefresh = () => {
    fetchOrders();
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

  // Stats
  const totalRevenue = orders.reduce((acc, o) => acc + o.amount, 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === "Completed").length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  {totalRevenue}
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
                {totalOrders}
              </p>
            </div>
            <div className="text-muted-foreground">
              <ShoppingCart className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Completed Orders */}
        <div className="rounded-lg border bg-card p-6 shadow-sm hover:shadow-elegant transition-all duration-300">
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
        </div>
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
      <RestaurantTodaysOrders orders={orders} />

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

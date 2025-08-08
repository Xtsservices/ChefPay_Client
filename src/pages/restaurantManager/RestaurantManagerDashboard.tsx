// components/RestaurantManagerDashboard.tsx
import React, { useState } from "react";
import { RefreshCw, Eye, ShoppingCart, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OrderDetailsModal from "@/common/OrderDetailsModal";

type Order = {
  orderId: string;
  customerNumber: string;
  amount: number;
  status: 'Placed';
  orderTime: string;
  items: string[];
  customerName: string;
  deliveryAddress: string;
  paymentMethod: string;
};

type OrderDetails = {
  orderId: string;
  customerNumber: string;
  restaurantInfo: string;
  amount: number;
  status: 'Placed';
  time: string;
  customerName: string;
  deliveryAddress: string;
  paymentMethod: string;
  items: {
    id: string;
    name: string;
    quantity: number;
    price: number;
    isVeg: boolean;
  }[];
};

const RestaurantManagerDashboard: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Sample orders data - minimum 13 orders with "Placed" status
  const allOrders: Order[] = [
    {
      orderId: "#ORD-001",
      customerNumber: "+91 9876543210",
      amount: 450,
      status: "Placed",
      orderTime: "12:30 PM",
      items: ["Chicken Biryani", "Raita"],
      customerName: "John Doe",
      deliveryAddress: "123 Main St, Hyderabad",
      paymentMethod: "Online Payment"
    },
    {
      orderId: "#ORD-002",
      customerNumber: "+91 9876543211",
      amount: 320,
      status: "Placed",
      orderTime: "12:45 PM",
      items: ["Paneer Butter Masala", "Naan"],
      customerName: "Jane Smith",
      deliveryAddress: "456 Park Ave, Hyderabad",
      paymentMethod: "Cash on Delivery"
    },
    {
      orderId: "#ORD-003",
      customerNumber: "+91 9876543212",
      amount: 680,
      status: "Placed",
      orderTime: "1:15 PM",
      items: ["Mutton Curry", "Rice"],
      customerName: "Mike Johnson",
      deliveryAddress: "789 Oak Road, Hyderabad",
      paymentMethod: "Online Payment"
    },
    {
      orderId: "#ORD-004",
      customerNumber: "+91 9876543213",
      amount: 290,
      status: "Placed",
      orderTime: "1:30 PM",
      items: ["Masala Dosa", "Coffee"],
      customerName: "Sarah Wilson",
      deliveryAddress: "321 Pine St, Hyderabad",
      paymentMethod: "Online Payment"
    },
    {
      orderId: "#ORD-005",
      customerNumber: "+91 9876543214",
      amount: 520,
      status: "Placed",
      orderTime: "2:00 PM",
      items: ["Fish Curry", "Rice", "Papad"],
      customerName: "David Brown",
      deliveryAddress: "654 Elm Street, Hyderabad",
      paymentMethod: "Cash on Delivery"
    },
    {
      orderId: "#ORD-006",
      customerNumber: "+91 9876543215",
      amount: 380,
      status: "Placed",
      orderTime: "2:15 PM",
      items: ["Veg Thali", "Lassi"],
      customerName: "Emily Davis",
      deliveryAddress: "987 Maple Ave, Hyderabad",
      paymentMethod: "Online Payment"
    },
    {
      orderId: "#ORD-007",
      customerNumber: "+91 9876543216",
      amount: 420,
      status: "Placed",
      orderTime: "2:30 PM",
      items: ["Chicken Tikka", "Naan", "Salad"],
      customerName: "Robert Miller",
      deliveryAddress: "147 Cedar Lane, Hyderabad",
      paymentMethod: "Online Payment"
    },
    {
      orderId: "#ORD-008",
      customerNumber: "+91 9876543217",
      amount: 350,
      status: "Placed",
      orderTime: "2:45 PM",
      items: ["Idli Sambar", "Coconut Chutney"],
      customerName: "Lisa Garcia",
      deliveryAddress: "258 Birch Road, Hyderabad",
      paymentMethod: "Cash on Delivery"
    },
    {
      orderId: "#ORD-009",
      customerNumber: "+91 9876543218",
      amount: 590,
      status: "Placed",
      orderTime: "3:00 PM",
      items: ["Prawns Curry", "Rice", "Fish Fry"],
      customerName: "James Martinez",
      deliveryAddress: "369 Walnut St, Hyderabad",
      paymentMethod: "Online Payment"
    },
    {
      orderId: "#ORD-010",
      customerNumber: "+91 9876543219",
      amount: 310,
      status: "Placed",
      orderTime: "3:15 PM",
      items: ["Chole Bhature", "Pickle"],
      customerName: "Amanda Taylor",
      deliveryAddress: "741 Cherry Ave, Hyderabad",
      paymentMethod: "Online Payment"
    },
    {
      orderId: "#ORD-011",
      customerNumber: "+91 9876543220",
      amount: 460,
      status: "Placed",
      orderTime: "3:30 PM",
      items: ["Butter Chicken", "Garlic Naan", "Rice"],
      customerName: "Kevin Anderson",
      deliveryAddress: "852 Peach Street, Hyderabad",
      paymentMethod: "Cash on Delivery"
    },
    {
      orderId: "#ORD-012",
      customerNumber: "+91 9876543221",
      amount: 280,
      status: "Placed",
      orderTime: "3:45 PM",
      items: ["Samosa", "Tea"],
      customerName: "Michelle Thomas",
      deliveryAddress: "963 Apple Lane, Hyderabad",
      paymentMethod: "Online Payment"
    },
    {
      orderId: "#ORD-013",
      customerNumber: "+91 9876543222",
      amount: 640,
      status: "Placed",
      orderTime: "4:00 PM",
      items: ["Tandoori Chicken", "Butter Naan", "Dal"],
      customerName: "Christopher White",
      deliveryAddress: "159 Orange Road, Hyderabad",
      paymentMethod: "Online Payment"
    }
  ];

  // Pagination logic
  const [ordersPerPage, setOrdersPerPage] = useState(5); // Add this state back
  const totalPages = Math.ceil(allOrders.length / ordersPerPage);
  const startIndex = (currentPage - 1) * ordersPerPage;
  const endIndex = startIndex + ordersPerPage;
  const currentOrders = allOrders.slice(startIndex, endIndex);

const handleOrdersPerPageChange = (newOrdersPerPage: number) => {
  setOrdersPerPage(newOrdersPerPage);
  setCurrentPage(1); // Reset to first page
};


  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      console.log("Orders refreshed");
    }, 2000);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleViewOrder = (order: Order) => {
    // Convert Order to OrderDetails format for modal
    const orderDetails: OrderDetails = {
      orderId: order.orderId,
      customerNumber: order.customerNumber,
      restaurantInfo: "Restaurant A",
      amount: order.amount,
      status: order.status,
      time: order.orderTime,
      customerName: order.customerName,
      deliveryAddress: order.deliveryAddress,
      paymentMethod: order.paymentMethod,
      items: [
        { id: "1", name: "Chicken Biryani", quantity: 1, price: 180, isVeg: false },
        { id: "2", name: "Raita", quantity: 1, price: 60, isVeg: true },
        { id: "3", name: "Dessert", quantity: 1, price: 80, isVeg: true }
      ]
    };
    setSelectedOrder(orderDetails);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="bg-white rounded-xl min-h-screen">
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <div>
            {/* <h1 className="text-2xl font-bold text-black mb-1">Canteen Admin Dashboard</h1> */}
          </div>
          
          {/* Sync Button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-200 ${
              isRefreshing 
                ? 'bg-gray-100 text-gray-500 border-gray-300 cursor-not-allowed'
                : 'bg-white text-black border-gray-300 hover:bg-gray-50'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium">Sync</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Today's Revenue */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today's Revenue</p>
                <div className="flex items-center">
                  <span className="text-xs text-gray-900">₹</span>
                  <span className="text-2xl font-bold text-black ml-1">18,450</span>
                </div>
              </div>
                <div className="text-gray-400">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>
          </div>

          {/* Today's Orders */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today's Orders</p>
                <p className="text-2xl font-bold text-black">1,247</p>
              </div>
              <div className="text-gray-400">
                <ShoppingCart className="w-8 h-8" />
              </div>
            </div>
          </div>

          {/* Completed Orders */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completed Orders</p>
                <p className="text-2xl font-bold text-black">1,224</p>
              </div>
              <div className="text-gray-400">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {/* Table Header with Dropdown */}
         <div className="flex items-center justify-between p-4 border-b border-gray-200">
  <h3 className="text-lg font-semibold text-black">Placed Orders</h3>
  <div className="flex items-center gap-3">
    <span className="text-sm text-gray-600">Show:</span>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2 border border-gray-300 text-white bg-gray-800 hover:bg-gray-700">
          {ordersPerPage} per page
          <ChevronDown className="h-4 w-4 text-white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
        <DropdownMenuItem 
          onClick={() => handleOrdersPerPageChange(5)}
          className="flex items-center gap-2 text-white hover:bg-gray-700 focus:bg-gray-700"
        >
          {ordersPerPage === 5 && <Check className="h-4 w-4 text-white" />}
          <span className="text-white">5 per page</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleOrdersPerPageChange(10)}
          className="flex items-center gap-2 text-white hover:bg-gray-700 focus:bg-gray-700"
        >
          {ordersPerPage === 10 && <Check className="h-4 w-4 text-white" />}
          <span className="text-white">10 per page</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleOrdersPerPageChange(20)}
          className="flex items-center gap-2 text-white hover:bg-gray-700 focus:bg-gray-700"
        >
          {ordersPerPage === 20 && <Check className="h-4 w-4 text-white" />}
          <span className="text-white">20 per page</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.length > 0 ? (
                  currentOrders.map((order, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {order.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {order.customerNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                        ₹{order.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-600">
                          Placed
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {order.orderTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button 
                          onClick={() => handleViewOrder(order)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded hover:bg-blue-50"
                          title="View Order Details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="text-gray-400 mb-4">
                        <ShoppingCart className="mx-auto h-12 w-12" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No New Orders</h3>
                      <p className="text-gray-600 mb-4">There are no new orders at the moment.</p>
                      <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg mx-auto transition-all duration-200 ${
                          isRefreshing 
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span className="text-sm font-medium">{isRefreshing ? 'Checking...' : 'Check for New Orders'}</span>
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Enhanced Pagination */}
          <div className="bg-white px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(endIndex, allOrders.length)}</span> of{' '}
                  <span className="font-medium">{allOrders.length}</span> results
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {/* Previous Button */}
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Previous
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>

            {/* Page Navigation Info */}
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-500">
                Page {currentPage} of {totalPages}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default RestaurantManagerDashboard;

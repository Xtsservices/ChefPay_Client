// components/RestaurantOrders.tsx
import OrderDetailsModal from "@/common/OrderDetailsModal";
import React, { useState, useMemo } from "react";

type Restaurant = {
  id: string;
  name: string;
  adminName: string;
  mobileNumber: string;
  location: string;
  totalOrders: number;
  completedOrders: number;
  todayRevenue: number;
  image: string;
};

type Order = {
  orderId: string;
  customerNumber: string;
  restaurantInfo: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Processing';
  time: string;
};

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
  status: 'Completed' | 'Pending' | 'Processing';
  time: string;
  customerName: string;
  deliveryAddress: string;
  paymentMethod: string;
  items: OrderItem[];
};

type Props = {
  restaurant: Restaurant;
};

const RestaurantOrders: React.FC<Props> = ({ restaurant }) => {
  const [selectedFilter, setSelectedFilter] = useState('Today');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const itemsPerPage = 5;

  // Sample orders data (minimum 15 orders)
  const allOrders: Order[] = [
    { orderId: "#ORD-001", customerNumber: "+91 9876543210", restaurantInfo: "Restaurant A", amount: 450, status: "Completed", time: "2:30 PM" },
    { orderId: "#ORD-002", customerNumber: "+91 9876543211", restaurantInfo: "Restaurant B", amount: 320, status: "Completed", time: "2:45 PM" },
    { orderId: "#ORD-003", customerNumber: "+91 9876543212", restaurantInfo: "Restaurant C", amount: 680, status: "Completed", time: "3:00 PM" },
    { orderId: "#ORD-004", customerNumber: "+91 9876543213", restaurantInfo: "Restaurant A", amount: 290, status: "Pending", time: "3:15 PM" },
    { orderId: "#ORD-005", customerNumber: "+91 9876543214", restaurantInfo: "Restaurant B", amount: 540, status: "Processing", time: "3:30 PM" },
    { orderId: "#ORD-006", customerNumber: "+91 9876543215", restaurantInfo: "Restaurant C", amount: 420, status: "Completed", time: "3:45 PM" },
    { orderId: "#ORD-007", customerNumber: "+91 9876543216", restaurantInfo: "Restaurant A", amount: 380, status: "Completed", time: "4:00 PM" },
    { orderId: "#ORD-008", customerNumber: "+91 9876543217", restaurantInfo: "Restaurant B", amount: 650, status: "Processing", time: "4:15 PM" },
    { orderId: "#ORD-009", customerNumber: "+91 9876543218", restaurantInfo: "Restaurant C", amount: 290, status: "Pending", time: "4:30 PM" },
    { orderId: "#ORD-010", customerNumber: "+91 9876543219", restaurantInfo: "Restaurant A", amount: 470, status: "Completed", time: "4:45 PM" },
    { orderId: "#ORD-011", customerNumber: "+91 9876543220", restaurantInfo: "Restaurant B", amount: 590, status: "Completed", time: "5:00 PM" },
    { orderId: "#ORD-012", customerNumber: "+91 9876543221", restaurantInfo: "Restaurant C", amount: 340, status: "Processing", time: "5:15 PM" },
    { orderId: "#ORD-013", customerNumber: "+91 9876543222", restaurantInfo: "Restaurant A", amount: 720, status: "Completed", time: "5:30 PM" },
    { orderId: "#ORD-014", customerNumber: "+91 9876543223", restaurantInfo: "Restaurant B", amount: 480, status: "Pending", time: "5:45 PM" },
    { orderId: "#ORD-015", customerNumber: "+91 9876543224", restaurantInfo: "Restaurant C", amount: 360, status: "Completed", time: "6:00 PM" },
  ];

  // Sample detailed order data (this would typically come from an API)
  const getOrderDetails = (orderId: string): OrderDetails => {
    const order = allOrders.find(o => o.orderId === orderId);
    if (!order) throw new Error('Order not found');

    // Sample items for demonstration
    const sampleItems: OrderItem[] = [
      { id: "1", name: "Chicken Biryani", quantity: 2, price: 180, isVeg: false },
      { id: "2", name: "Paneer Butter Masala", quantity: 1, price: 160, isVeg: true },
      { id: "3", name: "Garlic Naan", quantity: 3, price: 45, isVeg: true },
      { id: "4", name: "Lassi", quantity: 2, price: 60, isVeg: true },
    ];

    return {
      ...order,
      customerName: "John Doe",
      deliveryAddress: "123 Main Street, Apartment 4B, Hyderabad, Telangana - 500001",
      paymentMethod: "Online Payment (UPI)",
      items: sampleItems.slice(0, Math.floor(Math.random() * 4) + 1), // Random number of items
    };
  };

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    let filtered = allOrders;

    // Apply search filter (search by order ID)
    if (searchTerm.trim()) {
      filtered = filtered.filter(order =>
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [searchTerm, selectedFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to first page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilter]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Processing': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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

  const handleViewOrder = (orderId: string) => {
    const orderDetails = getOrderDetails(orderId);
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
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Orders List Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-lg font-semibold text-black">Orders List</h3>
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
            <svg 
              className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          {/* Time Filter Dropdown */}
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 bg-gray-100 border border-black rounded-lg text-sm text-black font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[130px]"
          >
            <option value="Today">Today</option>
            <option value="Yesterday">Yesterday</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
          </select>
        </div>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-800">
            Found {filteredOrders.length} order(s) matching "{searchTerm}"
            {filteredOrders.length === 0 && (
              <span className="ml-2 text-blue-600">
                Try searching with a different Order ID
              </span>
            )}
          </p>
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
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
                  Restaurant Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {order.restaurantInfo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      ₹{order.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {order.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button 
                        onClick={() => handleViewOrder(order.orderId)}
                        className="text-blue-600 hover:text-blue-800 font-medium transition-colors p-1 rounded hover:bg-blue-50"
                        title="View Order Details"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="text-gray-400 mb-2">
                      <svg className="mx-auto h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <p className="text-gray-500">No orders found</p>
                    {searchTerm && (
                      <p className="text-sm text-gray-400 mt-1">
                        Try searching with a different Order ID
                      </p>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Enhanced Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                <span className="font-medium">{Math.min(endIndex, filteredOrders.length)}</span> of{' '}
                <span className="font-medium">{filteredOrders.length}</span> results
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

              {/* Show ellipsis if there are more pages */}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="px-2 text-gray-500">...</span>
              )}

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

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder} 
        onClose={handleCloseModal} 
      />
    </div>
  );
};

export default RestaurantOrders;

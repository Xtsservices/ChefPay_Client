import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Search } from 'lucide-react';

type Order = {
  orderId: string;
  customerNumber: string;
  restaurantInfo?: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Processing' | 'Placed';
  time: string;
  date: Date;
  items?: string[];
  customerName?: string;
  deliveryAddress?: string;
  paymentMethod?: string;
};

type Props = {
  orders: Order[];
  onViewOrder: (orderId: string) => void;
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
  startDate: Date | null;
  endDate: Date | null;
  onDateRangeChange: (dates: [Date | null, Date | null]) => void;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  onItemsPerPageChange: (items: number) => void;
  onPageChange: (page: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  totalOrders: number;
};

const OrdersTable: React.FC<Props> = ({
  orders,
  onViewOrder,
  searchTerm,
  onSearchChange,
  startDate,
  endDate,
  onDateRangeChange,
  currentPage,
  totalPages,
  itemsPerPage,
  onItemsPerPageChange,
  onPageChange,
  onPrevious,
  onNext,
  totalOrders,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'Placed':
        return 'text-green-600 bg-green-100';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'Processing':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-black bg-gray-100';
    }
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
    <h3 className="text-lg font-semibold text-white">Orders List</h3>
    <div className="flex items-center space-x-4">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search Orders..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-4 py-2 border border-gray-700 rounded-lg text-sm
                     text-white bg-[#1E1E1E]
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      </div>

      {/* Date Range Picker */}
      <div className="relative">
        <DatePicker
          selectsRange
          startDate={startDate}
          endDate={endDate}
          onChange={onDateRangeChange}
          placeholderText="Select date range"
          className="px-4 py-2 border border-gray-700 rounded-lg text-sm
                     text-white bg-[#1E1E1E]
                     focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
          dateFormat="MM/dd/yyyy"
        />
      </div>
    </div>
  </div>

  {/* Orders as Cards */}
  <div className="grid gap-4">
    {orders.length > 0 ? (
      orders.map((order, index) => (
        <div
          key={index}
          className="bg-[#121212] border border-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-[#1A1A1A] transition"
        >
          {/* Order Info */}
          <div className="flex-1">
            <p className="text-sm text-gray-400">Order ID</p>
            <p className="text-white font-medium">{order.orderId}</p>
          </div>

          <div className="flex-1">
            <p className="text-sm text-gray-400">Customer</p>
            <p className="text-gray-300">{order.customerNumber}</p>
          </div>

          <div className="flex-1">
            <p className="text-sm text-gray-400">Amount</p>
            <p className="text-white font-medium">₹{order.amount}</p>
          </div>

          <div className="flex-1">
            <p className="text-sm text-gray-400">Status</p>
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                order.status === "Placed"
                  ? "bg-green-800 text-green-200"
                  : "bg-gray-700 text-gray-300"
              }`}
            >
              {order.status}
            </span>
          </div>

          <div className="flex-1">
            <p className="text-sm text-gray-400">Time</p>
            <p className="text-gray-300">{order.time}</p>
          </div>

          {/* Actions */}
          <button
            onClick={() => onViewOrder(order.orderId)}
            className="text-gray-400 hover:text-white p-2 rounded hover:bg-gray-800 transition"
            title="View Order Details"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        </div>
      ))
    ) : (
      <div className="bg-[#121212] border border-gray-800 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">No Orders Found</h3>
        <p className="text-gray-400">
          {searchTerm
            ? "No orders match your search criteria."
            : "There are no orders for the selected date range."}
        </p>
      </div>
    )}
  </div>

  {/* Pagination */}
  <div className="bg-[#121212] px-4 py-3 border-t border-gray-800 sm:px-6 rounded-lg">
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-400">
        Showing <span className="font-medium text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
        <span className="font-medium text-white">{Math.min(currentPage * itemsPerPage, totalOrders)}</span> of{" "}
        <span className="font-medium text-white">{totalOrders}</span> results
      </p>
      <div className="flex items-center space-x-2">
        <button
          onClick={onPrevious}
          disabled={currentPage === 1}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            currentPage === 1
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          Previous
        </button>
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 text-sm rounded transition-colors ${
            currentPage === totalPages
              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
              : "bg-gray-800 text-white hover:bg-gray-700"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  </div>
</div>
  );
};

export default OrdersTable;
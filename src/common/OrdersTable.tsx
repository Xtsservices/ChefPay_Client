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
        <h3 className="text-lg font-semibold text-black">Orders List</h3>
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search Orders..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-4 h-4" />
          </div>

          {/* Date Range Picker */}
          <div className="relative">
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={onDateRangeChange}
              placeholderText="Select date range"
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              dateFormat="MM/dd/yyyy"
            />
            <svg
              className="absolute right-3 top-2.5 h-4 w-4 text-black"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Search Results Info */}
      {searchTerm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-black">
            Found {orders.length} order(s) matching "{searchTerm}"
            {orders.length === 0 && (
              <span className="ml-2 text-black">Try searching with a different term</span>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Customer Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Order Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                      {order.customerNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                      ₹{order.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{order.time}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => onViewOrder(order.orderId)}
                        className="text-black hover:text-gray-700 transition-colors p-1 rounded hover:bg-gray-50"
                        title="View Order Details"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-black mb-4">
                      <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-black mb-2">No Orders Found</h3>
                    <p className="text-black mb-4">
                      {searchTerm
                        ? 'No orders match your search criteria.'
                        : 'There are no orders for the selected date range.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enhanced Pagination */}
      <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-black">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, totalOrders)}
              </span>{' '}
              of <span className="font-medium">{totalOrders}</span> results
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            <button
              onClick={onPrevious}
              disabled={currentPage === 1}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                currentPage === 1
                  ? 'bg-gray-100 text-black cursor-not-allowed'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-black hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}

            {/* Show ellipsis if there are more pages */}
            {totalPages > 5 && currentPage < totalPages - 2 && (
              <span className="px-2 text-black">...</span>
            )}

            {/* Next Button */}
            <button
              onClick={onNext}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-black cursor-not-allowed'
                  : 'bg-gray-100 text-black hover:bg-gray-200'
              }`}
            >
              Next
            </button>
          </div>
        </div>

        {/* Page Navigation Info and Items Per Page */}
        <div className="mt-2 flex justify-between items-center">
          <p className="text-xs text-black">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-black">Items per page:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersTable;
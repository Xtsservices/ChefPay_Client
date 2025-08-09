// RestaurantTodaysOrders.tsx (no changes needed, but providing as requested)
import React, { useState } from 'react';

interface Order {
  orderId: string;
  customerNumber: string;
  amount: number;
  status: 'Placed';
  orderTime: string;
  items: string[];
  customerName: string;
  deliveryAddress: string;
  paymentMethod: string;
}

interface TodaysOrdersProps {
  orders: Order[];
  onViewOrder: (orderId: string) => void;
}

const RestaurantTodaysOrders: React.FC<TodaysOrdersProps> = ({ orders, onViewOrder }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalOrders = orders.length;
  const totalPages = Math.ceil(totalOrders / itemsPerPage);
  const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Placed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const onPrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const onNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onItemsPerPageChange = (num: number) => {
    setItemsPerPage(num);
    setCurrentPage(1);
  };

  const getPageNumbers = (): (number | string)[] => {
    const delta = 2;
    const left = currentPage - delta;
    const right = currentPage + delta + 1;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i < right)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  };

  return (
    <div>
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
                paginatedOrders.map((order) => (
                  <tr key={order.orderId} className="hover:bg-gray-50 transition-colors">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{order.orderTime}</td>
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
                      No orders found.
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
            {getPageNumbers().map((page, index) => (
              typeof page === 'number' ? (
                <button
                  key={`page-${index}`}
                  onClick={() => onPageChange(page)}
                  className={`px-3 py-1 text-sm rounded transition-colors ${
                    currentPage === page ? 'bg-blue-600 text-white' : 'bg-gray-100 text-black hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ) : (
                <span key={`dots-${index}`} className="px-2 text-black">{page}</span>
              )
            ))}

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

export default RestaurantTodaysOrders;
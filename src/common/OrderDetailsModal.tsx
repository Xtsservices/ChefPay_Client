// components/OrderDetailsModal.tsx
import React from "react";

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
  order: OrderDetails | null;
  onClose: () => void;
};

const OrderDetailsModal: React.FC<Props> = ({ order, onClose }) => {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'Pending': return 'text-yellow-600 bg-yellow-100';
      case 'Processing': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
  <div
  className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
  onClick={onClose}
>
  <div
    className="bg-[#1E1E1E] rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-800"
    onClick={e => e.stopPropagation()}
  >
    {/* Header */}
    <div className="flex items-center justify-between p-6 border-b border-gray-800">
      <div>
        <h2 className="text-xl font-bold text-white">Order Details</h2>
        <p className="text-sm text-gray-400">View complete order information</p>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
      >
        <svg
          className="w-6 h-6 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {/* Order Info */}
    <div className="p-6 space-y-6">
      {/* Order Summary */}
      <div className="bg-[#252525] rounded-xl p-4 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Order ID</label>
            <p className="text-white font-medium">{order.orderId}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                order.status
              )}`}
            >
              {order.status}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Order Time</label>
            <p className="text-white font-medium">{order.time}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Total Amount</label>
            <p className="text-white font-bold text-lg">₹{order.amount}</p>
          </div>
        </div>
      </div>

      {/* Customer Information */}
      <div className="bg-[#252525] rounded-xl p-4 border border-gray-800">
        <h3 className="text-lg font-semibold text-white mb-4">Customer Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Customer Name</label>
            <p className="text-white font-medium">{order.customerName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Phone Number</label>
            <p className="text-white font-medium">{order.customerNumber}</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-400 mb-1">Delivery Address</label>
            <p className="text-white font-medium">{order.deliveryAddress}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Payment Method</label>
            <p className="text-white font-medium">{order.paymentMethod}</p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Order Items</h3>
        <div className="bg-[#1E1E1E] border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#252525]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Item
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {order.items.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#2A2A2A] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <span
                        className={`w-3 h-3 rounded-full border-2 ${
                          item.isVeg
                            ? "bg-green-500 border-green-500"
                            : "bg-red-500 border-red-500"
                        }`}
                      ></span>
                      <span className="text-sm font-medium text-white">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="text-sm text-white font-medium">{item.quantity}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm text-white">₹{item.price}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-sm font-medium text-white">
                      ₹{item.price * item.quantity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-[#252525]">
              <tr>
                <td colSpan={3} className="px-4 py-3 text-right font-semibold text-gray-300">
                  Total Amount:
                </td>
                <td className="px-4 py-3 text-right font-bold text-lg text-white">
                  ₹{order.amount}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="flex justify-end space-x-3 p-6 border-t border-gray-800">
      <button
        onClick={onClose}
        className="px-6 py-2 text-sm font-medium text-gray-200 bg-[#2A2A2A] border border-gray-700 rounded-lg hover:bg-[#3A3A3A] transition-colors"
      >
        Close
      </button>
      <button className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
        Print Order
      </button>
    </div>
  </div>
</div>


  );
};

export default OrderDetailsModal;

import React from "react";

type OrderItem = {
  itemName: string;
  quantity: number;
  foodType: string;
  image: string;
  categoryName: string;
};

type Order = {
  orderId: string;
  orderNo: string;
  customerNumber: string;
  amount: number;
  status: "Completed" | "Pending" | "Processing" | "Placed";
  time: string;
  date: Date;
  items: OrderItem[];
  paymentStatus: string;
};

const OrderDetailsModal: React.FC<{
  order: Order | null;
  onClose: () => void;
}> = ({ order, onClose }) => {
  if (!order) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "text-green-600 bg-green-100";
      case "Pending":
        return "text-yellow-600 bg-yellow-100";
      case "Processing":
        return "text-blue-600 bg-blue-100";
      case "Placed":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  console.log("order", order);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#09090b] rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">
            Order #{order.orderNo}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#2A2A2A] rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Order Summary */}
        <div className="p-6 space-y-6">
          <div className="bg-[#09090b] rounded-xl p-4 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">
              Order Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-white">
                <span className="text-gray-400">Order ID:</span> {order.orderId}
              </p>
              <p className="text-white">
                <span className="text-gray-400">Time:</span>{" "}
                {order?.time}
              </p>
              <p className="text-white">
                <span className="text-gray-400">Status:</span>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </p>
              {/* <p className="text-white">
                <span className="text-gray-400">Payment:</span>{" "}
                {order.paymentStatus}
              </p> */}
            </div>
            <p className="text-white font-bold text-lg mt-4">
              Total Amount: ₹{order.amount}
            </p>
          </div>

          {/* Customer Info */}
          <div className="bg-[#09090b] rounded-xl p-4 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">
              Customer Info
            </h3>
            <p className="text-white">
              <span className="text-gray-400">Mobile:</span>{" "}
              {order.customerNumber}
            </p>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Ordered Items
            </h3>
            <div className="bg-[#09090b] border border-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="text-gray-400 text-sm">
                    <th className="px-4 py-2 text-left">Item</th>
                    <th className="px-4 py-2">Qty</th>
                    <th className="px-4 py-2">Name</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, idx) => (
                    <tr
                      key={idx}
                      className="border-t border-gray-700 hover:bg-[#1A1A1A]"
                    >
                      <td className="px-4 py-2 flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.itemName}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-white">{item.itemName}</p>
                          <p className="text-xs text-gray-400">
                            {item.foodType}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center text-white">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-2 text-center text-gray-300">
                        {item.name}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-6 py-2 text-sm font-medium text-gray-200 bg-[#2A2A2A] border border-gray-700 rounded-lg hover:bg-[#3A3A3A]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;

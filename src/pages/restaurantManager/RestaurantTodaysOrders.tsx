// // RestaurantTodaysOrders.tsx (no changes needed, but providing as requested)
// import React, { useState } from 'react';

// interface Order {
//   orderId: string;
//   customerNumber: string;
//   amount: number;
//   status: 'Placed';
//   orderTime: string;
//   items: string[];
//   customerName: string;
//   deliveryAddress: string;
//   paymentMethod: string;
// }

// interface TodaysOrdersProps {
//   orders: Order[];
//   onViewOrder: (orderId: string) => void;
// }

// const RestaurantTodaysOrders: React.FC<TodaysOrdersProps> = ({ orders, onViewOrder }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);

//   const totalOrders = orders.length;
//   const totalPages = Math.ceil(totalOrders / itemsPerPage);
//   const paginatedOrders = orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case 'Placed':
//         return 'bg-green-100 text-green-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const onPrevious = () => {
//     if (currentPage > 1) setCurrentPage(currentPage - 1);
//   };

//   const onNext = () => {
//     if (currentPage < totalPages) setCurrentPage(currentPage + 1);
//   };

//   const onPageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const onItemsPerPageChange = (num: number) => {
//     setItemsPerPage(num);
//     setCurrentPage(1);
//   };

//   const getPageNumbers = (): (number | string)[] => {
//     const delta = 2;
//     const left = currentPage - delta;
//     const right = currentPage + delta + 1;
//     const range: number[] = [];
//     const rangeWithDots: (number | string)[] = [];
//     let l: number | undefined;

//     for (let i = 1; i <= totalPages; i++) {
//       if (i === 1 || i === totalPages || (i >= left && i < right)) {
//         range.push(i);
//       }
//     }

//     for (let i of range) {
//       if (l) {
//         if (i - l === 2) {
//           rangeWithDots.push(l + 1);
//         } else if (i - l !== 1) {
//           rangeWithDots.push('...');
//         }
//       }
//       rangeWithDots.push(i);
//       l = i;
//     }

//     return rangeWithDots;
//   };

//   return (
// <div className="space-y-6">
//   {/* Orders Table */}
//   <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
//     <div className="overflow-x-auto">
//       <table className="w-full">
//         <thead className="bg-muted/50">
//           <tr>
//             <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//               Order ID
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//               Customer Number
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//               Amount
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//               Status
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//               Order Time
//             </th>
//             <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
//               Actions
//             </th>
//           </tr>
//         </thead>
//         <tbody className="divide-y divide-border bg-card">
//           {orders.length > 0 ? (
//             paginatedOrders.map((order) => (
//               <tr
//                 key={order.orderId}
//                 className="hover:bg-muted/40 transition-colors"
//               >
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
//                   {order.orderId}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
//                   {order.customerNumber}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
//                   ₹{order.amount}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span
//                     className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
//                       order.status
//                     )}`}
//                   >
//                     {order.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
//                   {order.orderTime}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm">
//                   <button
//                     onClick={() => onViewOrder(order.orderId)}
//                     className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted/40"
//                     title="View Order Details"
//                   >
//                     <svg
//                       className="w-5 h-5"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
//                       />
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
//                       />
//                     </svg>
//                   </button>
//                 </td>
//               </tr>
//             ))
//           ) : (
//             <tr>
//               <td colSpan={6} className="px-6 py-12 text-center">
//                 <div className="text-muted-foreground mb-4">
//                   <svg
//                     className="mx-auto h-12 w-12"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={1}
//                       d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                     />
//                   </svg>
//                 </div>
//                 <h3 className="text-lg font-semibold text-foreground mb-2">
//                   No Orders Found
//                 </h3>
//                 <p className="text-sm text-muted-foreground">
//                   No orders available.
//                 </p>
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>
//     </div>
//   </div>

//   {/* Enhanced Pagination */}
//   <div className="rounded-lg border bg-card px-4 py-3 shadow-sm sm:px-6">
//     <div className="flex items-center justify-between">
//       <p className="text-sm text-muted-foreground">
//         Showing{" "}
//         <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span>{" "}
//         to{" "}
//         <span className="font-medium">
//           {Math.min(currentPage * itemsPerPage, totalOrders)}
//         </span>{" "}
//         of <span className="font-medium">{totalOrders}</span> results
//       </p>
//       <div className="flex items-center gap-2">
//         {/* Previous Button */}
//         <button
//           onClick={onPrevious}
//           disabled={currentPage === 1}
//           className={`px-3 py-1 text-sm rounded-lg transition-colors ${
//             currentPage === 1
//               ? "bg-muted text-muted-foreground cursor-not-allowed"
//               : "bg-muted text-foreground hover:bg-muted/70"
//           }`}
//         >
//           Previous
//         </button>

//         {/* Page Numbers */}
//         {getPageNumbers().map((page, index) =>
//           typeof page === "number" ? (
//             <button
//               key={`page-${index}`}
//               onClick={() => onPageChange(page)}
//               className={`px-3 py-1 text-sm rounded-lg transition-all duration-200 ${
//                 currentPage === page
//                   ? "bg-gradient-primary text-white shadow-elegant"
//                   : "bg-muted text-foreground hover:bg-muted/70"
//               }`}
//             >
//               {page}
//             </button>
//           ) : (
//             <span
//               key={`dots-${index}`}
//               className="px-2 text-muted-foreground"
//             >
//               {page}
//             </span>
//           )
//         )}

//         {/* Next Button */}
//         <button
//           onClick={onNext}
//           disabled={currentPage === totalPages}
//           className={`px-3 py-1 text-sm rounded-lg transition-colors ${
//             currentPage === totalPages
//               ? "bg-muted text-muted-foreground cursor-not-allowed"
//               : "bg-muted text-foreground hover:bg-muted/70"
//           }`}
//         >
//           Next
//         </button>
//       </div>
//     </div>

//     {/* Page Navigation Info and Items Per Page */}
//     <div className="mt-2 flex justify-between items-center">
//       <p className="text-xs text-muted-foreground">
//         Page {currentPage} of {totalPages}
//       </p>
//       <div className="flex items-center gap-2">
//         <label className="text-sm text-muted-foreground">Items per page:</label>
//         <select
//           value={itemsPerPage}
//           onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
//           className="px-2 py-1 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
//         >
//           <option value={5}>5</option>
//           <option value={10}>10</option>
//           <option value={20}>20</option>
//         </select>
//       </div>
//     </div>
//   </div>
// </div>

//   );
// };

// export default RestaurantTodaysOrders;

import React, { useState } from "react";

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
  amount: number;
  status: "Placed" | "Pending" | "Processing" | "Completed";
  Time: string;
  items: OrderItem[];
};

interface TodaysOrdersProps {
  orders: OrderDetails[];
  onViewOrder: (orderId: string) => void;
}

const RestaurantTodaysOrders: React.FC<TodaysOrdersProps> = ({
  orders,
  onViewOrder,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);

  const totalOrders = orders.length;
  const totalPages = Math.ceil(totalOrders / itemsPerPage);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const handleViewOrder = (orderId: string) => {
    const order = orders.find(
      (o) => o.orderId.toString() === orderId.toString()
    );
    if (order) setSelectedOrder(order);
  };
  const handleCloseModal = () => {
    setSelectedOrder(null);
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Placed":
        return "bg-purple-100 text-purple-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Customer Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Order Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map((order) => (
                  <tr
                    key={order.orderId}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {order.customerNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {order.time}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleViewOrder(order.orderId)}
                        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted/40"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    No Orders Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center">
        <div>
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-muted rounded-lg"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-muted rounded-lg"
          >
            Next
          </button>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2 py-1 border rounded-lg"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default RestaurantTodaysOrders;

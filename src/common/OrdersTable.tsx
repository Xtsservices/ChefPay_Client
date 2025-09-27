import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Search } from "lucide-react";
import { apiGet } from "@/api/apis";
import OrderDetailsModal from "./OrderDetailsModal";

// ================== Types ==================
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

// ================== Orders Table ==================
const OrdersTable: React.FC = () => {
  const currentUserData = useSelector((state: any) => state.currentUserData);

  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // ✅ Set default date range to "yesterday to today"
  useEffect(() => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    setStartDate(yesterday);
    setEndDate(today);
  }, []); // Runs only on mount to set default dates

  // ✅ Fetch Orders API
  const fetchOrdersByCanteenID = async (
    canteenId: number,
    start: Date | null,
    end: Date | null,
    page: number,
    limit: number
  ) => {
    try {
      // Format dates to YYYY-MM-DD in local timezone
      const formatDate = (date: Date | null) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const queryParams = new URLSearchParams({
        ...(start && { startDate: formatDate(start) }),
        ...(end && { endDate: formatDate(end) }),
        page: page.toString(),
        limit: limit.toString(),
      }).toString();

      const response = await apiGet(
        `/orders/getallordersbycanteenId/${canteenId}?${queryParams}`
      );

      console.log("Fetched Orders Response:", response);

      if (response.status === 200 && response.data?.data) {
        const formattedOrders: Order[] = response.data.data.orders?.map((order: any) => ({
          orderId: order.orderId?.toString() || "N/A",
          orderNo: order.orderNo || "N/A",
          customerNumber: order.user?.mobile || "N/A",
          amount: parseFloat(order.totalAmount || 0),
          status:
            order.orderStatus?.toLowerCase() === "pending"
              ? "Pending"
              : order.orderStatus?.toLowerCase() === "completed"
              ? "Completed"
              : order.orderStatus?.toLowerCase() === "processing"
              ? "Processing"
              : "Placed",
          time: new Date(order.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date(order.createdAt),
          items:
            order.items?.map((i: any) => ({
              itemName: i.itemName || "Unknown Item",
              quantity: i.quantity || 1,
              foodType: i.foodType || "N/A",
              image: i.image || "/placeholder.png",
              categoryName: i.category?.name || "Others",
            })) || [],
          paymentStatus: order.payment?.status || "N/A",
        }));

        setOrders(formattedOrders);
        setTotalOrders(response.data.data.totalOrders || formattedOrders.length);
        setTotalPages(response.data.data.totalPages || Math.ceil(formattedOrders.length / itemsPerPage));
      } else {
        setOrders([]);
        console.error("Failed to fetch orders:", response);
      }
    } catch (error) {
      setOrders([]);
      console.error("Error fetching orders:", error);
    }
  };

  // ✅ Fetch orders on mount, date change, or page change
  useEffect(() => {
    if (currentUserData && currentUserData.canteenId && startDate && endDate) {
      fetchOrdersByCanteenID(
        currentUserData.canteenId, // Use currentUserData.canteenId instead of hardcoding 1
        startDate,
        endDate,
        currentPage,
        itemsPerPage
      );
    }
  }, [currentUserData, startDate, endDate, currentPage, itemsPerPage]);

  // ✅ Handle pagination
  const handlePageChange = (page: number) => setCurrentPage(page);
  const handlePrevious = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  // ✅ Filter + Pagination
  const filteredOrders = orders.filter((order) =>
    order.customerNumber.toString().includes(searchTerm)
  );

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ✅ Generate page numbers
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
    <div className="space-y-6">
      {/* Orders List Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Orders List
        </h3>
        <div className="flex items-center space-x-4">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by customer number..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to page 1 on search
              }}
              className="px-4 py-2 pl-10 border border-gray-700 rounded-lg text-sm
                         text-white bg-[#09090b]
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
          </div>
          {/* Date Range Picker */}
          <div className="relative">
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={([start, end]) => {
                setStartDate(start);
                setEndDate(end);
                setCurrentPage(1); // Reset to page 1 on date change
              }}
              placeholderText="Select date range"
              className="px-4 py-2 border border-gray-700 rounded-lg text-sm
                         text-white bg-[#09090b]
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
              dateFormat="MM/dd/yyyy"
            />
          </div>
        </div>
      </div>

      {/* Orders as Cards */}
      <div className="grid gap-4">
        {paginatedOrders.length > 0 ? (
          paginatedOrders.map((order, index) => (
            <div
              key={index}
              className="bg-[#121212] border border-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-[#1A1A1A] transition"
            >
              {/* Order Info */}
              <div className="flex-1">
                <p className="text-sm text-gray-400">Order No</p>
                <p className="text-white font-medium">{order.orderNo}</p>
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
                      : order.status === "Pending"
                      ? "bg-yellow-800 text-yellow-200"
                      : order.status === "Processing"
                      ? "bg-blue-800 text-blue-200"
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
                onClick={() => setSelectedOrder(order)}
                className="text-gray-400 hover:text-white p-2 rounded hover:bg-gray-800 transition"
                title="View Order Details"
              >
                👁️
              </button>
            </div>
          ))
        ) : (
          <div className="bg-[#121212] border border-gray-800 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              No Orders Found
            </h3>
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
            Showing{" "}
            <span className="font-medium text-white">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-white">
              {Math.min(currentPage * itemsPerPage, totalOrders)}
            </span>{" "}
            of <span className="font-medium text-white">{totalOrders}</span>{" "}
            results
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevious}
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
                onClick={() => handlePageChange(page)}
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
              onClick={handleNext}
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

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
};

export default OrdersTable;
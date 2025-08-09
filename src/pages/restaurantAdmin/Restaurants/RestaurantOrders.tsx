import React, { useState, useMemo, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OrderDetailsModal from '@/common/OrderDetailsModal';
import OrdersTable from '@/common/OrdersTable';

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


type OrderDetails = {
  orderId: string;
  customerNumber: string;
  restaurantInfo: string;
  amount: number;
  status: 'Completed' | 'Pending' | 'Processing' | 'Placed';
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

type Props = {
  restaurant: Restaurant;
};

const RestaurantOrders: React.FC<Props> = ({ restaurant }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Sample orders data with varied statuses and restaurantInfo
  const allOrders: Order[] = [
    { orderId: '#ORD-001', customerNumber: '+91 9876543210', restaurantInfo: restaurant.name, amount: 450, status: 'Completed', time: '2:30 PM', date: new Date('2025-08-09') },
    { orderId: '#ORD-002', customerNumber: '+91 9876543211', restaurantInfo: restaurant.name, amount: 320, status: 'Placed', time: '2:45 PM', date: new Date('2025-08-09') },
    { orderId: '#ORD-003', customerNumber: '+91 9876543212', restaurantInfo: 'Restaurant C', amount: 680, status: 'Processing', time: '3:00 PM', date: new Date('2025-08-08') },
    { orderId: '#ORD-004', customerNumber: '+91 9876543213', restaurantInfo: restaurant.name, amount: 290, status: 'Pending', time: '3:15 PM', date: new Date('2025-08-08') },
    { orderId: '#ORD-005', customerNumber: '+91 9876543214', restaurantInfo: 'Restaurant B', amount: 540, status: 'Completed', time: '3:30 PM', date: new Date('2025-08-07') },
    { orderId: '#ORD-006', customerNumber: '+91 9876543215', restaurantInfo: 'Restaurant C', amount: 420, status: 'Placed', time: '3:45 PM', date: new Date('2025-08-07') },
    { orderId: '#ORD-007', customerNumber: '+91 9876543216', restaurantInfo: restaurant.name, amount: 380, status: 'Completed', time: '4:00 PM', date: new Date('2025-08-06') },
    { orderId: '#ORD-008', customerNumber: '+91 9876543217', restaurantInfo: 'Restaurant B', amount: 650, status: 'Processing', time: '4:15 PM', date: new Date('2025-08-06') },
    { orderId: '#ORD-009', customerNumber: '+91 9876543218', restaurantInfo: 'Restaurant C', amount: 290, status: 'Pending', time: '4:30 PM', date: new Date('2025-08-05') },
    { orderId: '#ORD-010', customerNumber: '+91 9876543219', restaurantInfo: restaurant.name, amount: 470, status: 'Completed', time: '4:45 PM', date: new Date('2025-08-05') },
    { orderId: '#ORD-011', customerNumber: '+91 9876543220', restaurantInfo: 'Restaurant B', amount: 590, status: 'Placed', time: '5:00 PM', date: new Date('2025-08-04') },
    { orderId: '#ORD-012', customerNumber: '+91 9876543221', restaurantInfo: 'Restaurant C', amount: 340, status: 'Processing', time: '5:15 PM', date: new Date('2025-08-04') },
    { orderId: '#ORD-013', customerNumber: '+91 9876543222', restaurantInfo: restaurant.name, amount: 720, status: 'Completed', time: '5:30 PM', date: new Date('2025-08-03') },
    { orderId: '#ORD-014', customerNumber: '+91 9876543223', restaurantInfo: 'Restaurant B', amount: 480, status: 'Pending', time: '5:45 PM', date: new Date('2025-08-03') },
    { orderId: '#ORD-015', customerNumber: '+91 9876543224', restaurantInfo: 'Restaurant C', amount: 360, status: 'Completed', time: '6:00 PM', date: new Date('2025-08-02') },
  ];

  // Sample detailed order data
  const getOrderDetails = (orderId: string): OrderDetails => {
    const order = allOrders.find((o) => o.orderId === orderId);
    if (!order) throw new Error('Order not found');

    const sampleItems: OrderDetails['items'] = [
      { id: '1', name: 'Chicken Biryani', quantity: 2, price: 180, isVeg: false },
      { id: '2', name: 'Paneer Butter Masala', quantity: 1, price: 160, isVeg: true },
      { id: '3', name: 'Garlic Naan', quantity: 3, price: 45, isVeg: true },
      { id: '4', name: 'Lassi', quantity: 2, price: 60, isVeg: true },
    ];

    return {
      orderId: order.orderId,
      customerNumber: order.customerNumber,
      restaurantInfo: order.restaurantInfo || restaurant.name,
      amount: order.amount,
      status: order.status,
      time: order.time,
      customerName: 'John Doe',
      deliveryAddress: '123 Main Street, Apartment 4B, Hyderabad, Telangana - 500001',
      paymentMethod: 'Online Payment (UPI)',
      items: sampleItems.slice(0, Math.floor(Math.random() * 4) + 1),
    };
  };

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    let filtered = allOrders.filter((order) => order.restaurantInfo === restaurant.name);

    // Search by Order ID, customer number, or amount
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerNumber.includes(searchTerm) ||
          order.amount.toString().includes(searchTerm)
      );
    }

    // Date range filtering
    if (startDate && endDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.date);
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        return orderDate >= start && orderDate <= end;
      });
    }

    return filtered;
  }, [searchTerm, startDate, endDate, restaurant.name]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to first page when search, date range, or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, startDate, endDate, itemsPerPage, restaurant.name]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      console.log('Orders refreshed');
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

  const handleViewOrder = (orderId: string) => {
    const orderDetails = getOrderDetails(orderId);
    setSelectedOrder(orderDetails);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
  };

  const handleDateRangeChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    if (start && end && start > end) {
      alert('End date cannot be before start date');
      return;
    }
    setStartDate(start);
    setEndDate(end);
  };

  const handleItemsPerPageChange = (items: number) => {
    setItemsPerPage(items);
  };

  return (
    <div className="bg-white rounded-xl min-h-screen">
      <div className="p-6">
       
        {/* Orders Table */}
        <OrdersTable
          orders={currentOrders}
          onViewOrder={handleViewOrder}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          startDate={startDate}
          endDate={endDate}
          onDateRangeChange={handleDateRangeChange}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          onPageChange={handlePageChange}
          onPrevious={handlePrevious}
          onNext={handleNext}
          totalOrders={filteredOrders.length}
        />

        {/* Order Details Modal */}
        <OrderDetailsModal order={selectedOrder} onClose={handleCloseModal} />
      </div>
    </div>
  );
};

export default RestaurantOrders;
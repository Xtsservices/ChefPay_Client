import React, { useState, useMemo, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OrderDetailsModal from '@/common/OrderDetailsModal';
import OrdersTable from '@/common/OrdersTable';

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

const RestaurantManagerOrders: React.FC = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Sample orders data with varied statuses and restaurantInfo
  const allOrders: Order[] = [
    {
      orderId: '#ORD-001',
      customerNumber: '+91 9876543210',
      restaurantInfo: 'Restaurant A',
      amount: 450,
      status: 'Completed',
      time: '12:30 PM',
      items: ['Chicken Biryani', 'Raita'],
      customerName: 'John Doe',
      deliveryAddress: '123 Main St, Hyderabad',
      paymentMethod: 'Online Payment',
      date: new Date('2025-08-09'),
    },
    {
      orderId: '#ORD-002',
      customerNumber: '+91 9876543211',
      restaurantInfo: 'Restaurant A',
      amount: 320,
      status: 'Placed',
      time: '12:45 PM',
      items: ['Paneer Butter Masala', 'Naan'],
      customerName: 'Jane Smith',
      deliveryAddress: '456 Park Ave, Hyderabad',
      paymentMethod: 'Cash on Delivery',
      date: new Date('2025-08-09'),
    },
    {
      orderId: '#ORD-003',
      customerNumber: '+91 9876543212',
      restaurantInfo: 'Restaurant B',
      amount: 680,
      status: 'Processing',
      time: '1:15 PM',
      items: ['Mutton Curry', 'Rice'],
      customerName: 'Mike Johnson',
      deliveryAddress: '789 Oak Road, Hyderabad',
      paymentMethod: 'Online Payment',
      date: new Date('2025-08-08'),
    },
    {
      orderId: '#ORD-004',
      customerNumber: '+91 9876543213',
      restaurantInfo: 'Restaurant A',
      amount: 290,
      status: 'Pending',
      time: '1:30 PM',
      items: ['Masala Dosa', 'Coffee'],
      customerName: 'Sarah Wilson',
      deliveryAddress: '321 Pine St, Hyderabad',
      paymentMethod: 'Online Payment',
      date: new Date('2025-08-08'),
    },
    {
      orderId: '#ORD-005',
      customerNumber: '+91 9876543214',
      restaurantInfo: 'Restaurant B',
      amount: 520,
      status: 'Completed',
      time: '2:00 PM',
      items: ['Fish Curry', 'Rice', 'Papad'],
      customerName: 'David Brown',
      deliveryAddress: '654 Elm Street, Hyderabad',
      paymentMethod: 'Cash on Delivery',
      date: new Date('2025-08-07'),
    },
    {
      orderId: '#ORD-006',
      customerNumber: '+91 9876543215',
      restaurantInfo: 'Restaurant A',
      amount: 380,
      status: 'Placed',
      time: '2:15 PM',
      items: ['Veg Thali', 'Lassi'],
      customerName: 'Emily Davis',
      deliveryAddress: '987 Maple Ave, Hyderabad',
      paymentMethod: 'Online Payment',
      date: new Date('2025-08-07'),
    },
    {
      orderId: '#ORD-007',
      customerNumber: '+91 9876543216',
      restaurantInfo: 'Restaurant A',
      amount: 420,
      status: 'Completed',
      time: '2:30 PM',
      items: ['Chicken Tikka', 'Naan', 'Salad'],
      customerName: 'Robert Miller',
      deliveryAddress: '147 Cedar Lane, Hyderabad',
      paymentMethod: 'Online Payment',
      date: new Date('2025-08-06'),
    },
    {
      orderId: '#ORD-008',
      customerNumber: '+91 9876543217',
      restaurantInfo: 'Restaurant B',
      amount: 350,
      status: 'Pending',
      time: '2:45 PM',
      items: ['Idli Sambar', 'Coconut Chutney'],
      customerName: 'Lisa Garcia',
      deliveryAddress: '258 Birch Road, Hyderabad',
      paymentMethod: 'Cash on Delivery',
      date: new Date('2025-08-06'),
    },
    {
      orderId: '#ORD-009',
      customerNumber: '+91 9876543218',
      restaurantInfo: 'Restaurant A',
      amount: 590,
      status: 'Processing',
      time: '3:00 PM',
      items: ['Prawns Curry', 'Rice', 'Fish Fry'],
      customerName: 'James Martinez',
      deliveryAddress: '369 Walnut St, Hyderabad',
      paymentMethod: 'Online Payment',
      date: new Date('2025-08-05'),
    },
    {
      orderId: '#ORD-010',
      customerNumber: '+91 9876543219',
      restaurantInfo: 'Restaurant A',
      amount: 310,
      status: 'Completed',
      time: '3:15 PM',
      items: ['Chole Bhature', 'Pickle'],
      customerName: 'Amanda Taylor',
      deliveryAddress: '741 Cherry Ave, Hyderabad',
      paymentMethod: 'Online Payment',
      date: new Date('2025-08-05'),
    },
    {
      orderId: '#ORD-011',
      customerNumber: '+91 9876543220',
      restaurantInfo: 'Restaurant B',
      amount: 460,
      status: 'Placed',
      time: '3:30 PM',
      items: ['Butter Chicken', 'Garlic Naan', 'Rice'],
      customerName: 'Kevin Anderson',
      deliveryAddress: '852 Peach Street, Hyderabad',
      paymentMethod: 'Cash on Delivery',
      date: new Date('2025-08-04'),
    },
    {
      orderId: '#ORD-012',
      customerNumber: '+91 9876543221',
      restaurantInfo: 'Restaurant A',
      amount: 280,
      status: 'Pending',
      time: '3:45 PM',
      items: ['Samosa', 'Tea'],
      customerName: 'Michelle Thomas',
      deliveryAddress: '963 Apple Lane, Hyderabad',
      paymentMethod: 'Online Payment',
      date: new Date('2025-08-04'),
    },
    {
      orderId: '#ORD-013',
      customerNumber: '+91 9876543222',
      restaurantInfo: 'Restaurant A',
      amount: 640,
      status: 'Completed',
      time: '4:00 PM',
      items: ['Tandoori Chicken', 'Butter Naan', 'Dal'],
      customerName: 'Christopher White',
      deliveryAddress: '159 Orange Road, Hyderabad',
      paymentMethod: 'Online Payment',
      date: new Date('2025-08-03'),
    },
  ];

  // Sample detailed order data
  const getOrderDetails = (orderId: string): OrderDetails => {
    const order = allOrders.find((o) => o.orderId === orderId);
    if (!order) throw new Error('Order not found');

    const sampleItems: OrderDetails['items'] = [
      { id: '1', name: 'Chicken Biryani', quantity: 1, price: 180, isVeg: false },
      { id: '2', name: 'Raita', quantity: 1, price: 60, isVeg: true },
      { id: '3', name: 'Dessert', quantity: 1, price: 80, isVeg: true },
    ];

    return {
      orderId: order.orderId,
      customerNumber: order.customerNumber,
      restaurantInfo: order.restaurantInfo || 'Restaurant A',
      amount: order.amount,
      status: order.status,
      time: order.time,
      customerName: order.customerName || 'Unknown Customer',
      deliveryAddress: order.deliveryAddress || 'Unknown Address',
      paymentMethod: order.paymentMethod || 'Unknown Payment Method',
      items: sampleItems.slice(0, Math.floor(Math.random() * 3) + 1),
    };
  };

  // Filter orders based on search term and date range
  const filteredOrders = useMemo(() => {
    let filtered = allOrders;

    // Search by Order ID, customer name, customer number, or amount
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (order) =>
          order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (order.customerName && order.customerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
  }, [searchTerm, startDate, endDate]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Reset to first page when search, date range, or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, startDate, endDate, itemsPerPage]);

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

export default RestaurantManagerOrders;
// components/RestaurantMenu.tsx
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

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  image: string;
  availableDays: string[]; // Using unique short keys
};

type Props = {
  restaurant: Restaurant;
};

const RestaurantMenu: React.FC<Props> = ({ restaurant }) => {
  const [selectedCategory, setSelectedCategory] = useState('All Items');
  const [viewMode, setViewMode] = useState<'veg' | 'non-veg' | 'all'>('all');
  const [selectedDay, setSelectedDay] = useState(() => {
    // Get current day and map to our unique keys
    const today = new Date().getDay();
    const dayKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayKeys[today];
  });

  const categories = ['All Items', 'Tiffins', 'Lunch', 'Beverages', 'Snacks', 'Desserts'];

  // Days of the week with unique keys
  const daysOfWeek = [
    { key: 'Mon', label: 'Monday', display: 'Mon' },
    { key: 'Tue', label: 'Tuesday', display: 'Tue' },
    { key: 'Wed', label: 'Wednesday', display: 'Wed' },
    { key: 'Thu', label: 'Thursday', display: 'Thu' },
    { key: 'Fri', label: 'Friday', display: 'Fri' },
    { key: 'Sat', label: 'Saturday', display: 'Sat' },
    { key: 'Sun', label: 'Sunday', display: 'Sun' }
  ];

  // Get current day for highlighting
  const getCurrentDay = () => {
    const today = new Date().getDay();
    const dayKeys = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayKeys[today];
  };

  // Sample menu items with unique day keys
  const menuItems: MenuItem[] = [
    {
      id: '1',
      name: 'Chicken Biryani',
      description: 'Aromatic rice dish with tender chicken pieces spiced with traditional spices and herbs',
      price: 290,
      category: 'Lunch',
      isVeg: false,
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300&h=200&fit=crop',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] // Available all days
    },
    {
      id: '2',
      name: 'Paneer Butter Masala',
      description: 'Creamy curry with soft cottage cheese pieces, onions, tomatoes and spices served with roti',
      price: 249,
      category: 'Lunch',
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=300&h=200&fit=crop',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] // Monday to Friday only
    },
    {
      id: '3',
      name: 'Masala Chai',
      description: 'Refreshing spiced tea made with aromatic spices like cardamom, ginger, and cloves',
      price: 25,
      category: 'Beverages',
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&h=200&fit=crop',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] // Available all days
    },
    {
      id: '4',
      name: 'Masala Dosa',
      description: 'Crispy South Indian crepe filled with spiced potato filling served with chutney and sambar',
      price: 120,
      category: 'Tiffins',
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop',
      availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] // Monday to Saturday
    },
    {
      id: '5',
      name: 'Butter Chicken',
      description: 'Tender chicken in rich, creamy tomato sauce with aromatic spices and herbs',
      price: 320,
      category: 'Lunch',
      isVeg: false,
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop',
      availableDays: ['Mon', 'Wed', 'Fri', 'Sat', 'Sun'] // Monday, Wednesday, Friday, Weekend
    },
    {
      id: '6',
      name: 'Weekend Special Thali',
      description: 'Special combo meal with variety of dishes available only on weekends',
      price: 450,
      category: 'Lunch',
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
      availableDays: ['Sat', 'Sun'] // Weekend only
    },
    {
      id: '7',
      name: 'Tuesday Special Biryani',
      description: 'Special biryani available only on Tuesdays with extra ingredients',
      price: 350,
      category: 'Lunch',
      isVeg: false,
      image: 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300&h=200&fit=crop',
      availableDays: ['Tue'] // Tuesday only
    },
    {
      id: '8',
      name: 'Thursday Fish Curry',
      description: 'Fresh fish curry available only on Thursdays',
      price: 280,
      category: 'Lunch',
      isVeg: false,
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=300&h=200&fit=crop',
      availableDays: ['Thu'] // Thursday only
    },
    {
      id: '9',
      name: 'Idli Sambar',
      description: 'Steamed rice cakes served with lentil curry',
      price: 80,
      category: 'Tiffins',
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop',
      availableDays: ['Mon', 'Wed', 'Fri'] // Monday, Wednesday, Friday
    },
    {
      id: '10',
      name: 'Fresh Lime Water',
      description: 'Refreshing lime water with mint',
      price: 30,
      category: 'Beverages',
      isVeg: true,
      image: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=300&h=200&fit=crop',
      availableDays: ['Sat', 'Sun'] // Weekend only
    }
  ];

  // Filter items based on day and veg preference first
  const dayFilteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const dayMatch = item.availableDays.includes(selectedDay);
      const vegMatch = viewMode === 'all' || (viewMode === 'veg' && item.isVeg) || (viewMode === 'non-veg' && !item.isVeg);
      return dayMatch && vegMatch;
    });
  }, [selectedDay, viewMode]);

  // Then filter by category
  const filteredItems = useMemo(() => {
    return dayFilteredItems.filter(item => {
      return selectedCategory === 'All Items' || item.category === selectedCategory;
    });
  }, [dayFilteredItems, selectedCategory]);

  // Calculate category counts based on day and veg filters
  const getCategoryCount = (category: string) => {
    if (category === 'All Items') {
      return dayFilteredItems.length;
    }
    return dayFilteredItems.filter(item => item.category === category).length;
  };

  return (
    <div className="space-y-6">
      {/* Menu Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h3 className="text-lg font-semibold text-black">Menu Items</h3>
        <div className="flex items-center space-x-4">
          {/* Veg/Non-Veg Filter */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: 'All', icon: '🍽️' },
              { key: 'veg', label: 'Veg', icon: '🥗' },
              { key: 'non-veg', label: 'Non-Veg', icon: '🍖' }
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setViewMode(option.key as any)}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  viewMode === option.key
                    ? 'bg-white text-black shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="mr-2">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-black mb-4">Categories</h4>
            <div className="space-y-2">
              {categories.map((category) => {
                const count = getCategoryCount(category);
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    disabled={count === 0}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : count === 0
                          ? 'text-gray-400 cursor-not-allowed bg-gray-50'
                          : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                    <span className={`float-right text-xs px-2 py-1 rounded-full ${
                      count === 0 
                        ? 'bg-gray-200 text-gray-400'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Menu Items Grid */}
        <div className="lg:col-span-3">
          {/* Days Filter */}
          <div className="mb-6 bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-black">Available Days</h4>
              <span className="text-sm text-gray-500">
                Today: {getCurrentDay()}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => {
                const isToday = getCurrentDay() === day.key;
                const isSelected = selectedDay === day.key;
                
                return (
                  <button
                    key={day.key}
                    onClick={() => setSelectedDay(day.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-w-[60px] ${
                      isSelected
                        ? 'bg-blue-600 text-white shadow-md'
                        : isToday
                          ? 'bg-green-100 text-green-700 border-2 border-green-500'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    title={`${day.label}${isToday ? ' (Today)' : ''}`}
                  >
                    {day.display}
                    {isToday && !isSelected && (
                      <div className="w-1 h-1 bg-green-500 rounded-full mx-auto mt-1"></div>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {selectedDay && (
                <span>
                  Showing menu for: {daysOfWeek.find(d => d.key === selectedDay)?.label}
                  {viewMode !== 'all' && ` (${viewMode === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'} only)`}
                </span>
              )}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-40 w-full">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='160' viewBox='0 0 300 160'%3E%3Crect width='300' height='160' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-black text-sm">{item.name}</h5>
                    <span className={`w-3 h-3 rounded-full border-2 ${
                      item.isVeg ? 'bg-green-500 border-green-500' : 'bg-red-500 border-red-500'
                    }`}></span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-600">₹{item.price}</span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </div>
                  {/* Show availability */}
                  <div className="mt-2 text-xs text-gray-500">
                    Available: {item.availableDays.length === 7 ? 'All Days' : 
                      item.availableDays.join(', ')
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-gray-500">No menu items available for the selected filters.</p>
              <p className="text-sm text-gray-400 mt-1">
                Try selecting a different day, category, or dietary preference.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantMenu;

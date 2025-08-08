// components/RestaurantList.tsx
import React, { useState } from "react";
import AddRestaurant from "./AddRestaurant";
import RestaurantDetailedView from "./RestaurantDetailedView";

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

const initialRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Restaurants A",
    adminName: "Krishna",
    mobileNumber: "+91 9876543210",
    location: "Rent at Desk, Xpbh,hyd-500089",
    totalOrders: 1246,
    completedOrders: 1200,
    todayRevenue: 15420,
    image: "https://images.unsplash.com/photo-1682778418768-16081e4470a1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "2",
    name: "Restaurants B",
    adminName: "Krishna", 
    mobileNumber: "+91 9876543270",
    location: "Rent at Desk, Xpbh,hyd-500089",
    totalOrders: 1246,
    completedOrders: 1180,
    todayRevenue: 18750,
    image: "https://images.unsplash.com/photo-1682778418768-16081e4470a1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "3",
    name: "Restaurants C",
    adminName: "Krishna",
    mobileNumber: "+91 9876543210",
    location: "Rent at Desk, Xpbh,hyd-500089", 
    totalOrders: 1246,
    completedOrders: 1150,
    todayRevenue: 12680,
    image: "https://images.unsplash.com/photo-1682778418768-16081e4470a1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "4",
    name: "Restaurants D",
    adminName: "Krishna",
    mobileNumber: "+91 9876543210",
    location: "Rent at Desk, Xpbh,hyd-500089", 
    totalOrders: 1246,
    completedOrders: 1220,
    todayRevenue: 22350,
    image: "https://images.unsplash.com/photo-1682778418768-16081e4470a1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
  },
  {
    id: "5",
    name: "Restaurants E",
    adminName: "Krishna",
    mobileNumber: "+91 9876543210",
    location: "Rent at Desk, Xpbh,hyd-500089", 
    totalOrders: 1246,
    completedOrders: 1190,
    todayRevenue: 16890,
    image: "https://images.unsplash.com/photo-1682778418768-16081e4470a1?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
  },
];

const RestaurantList: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [restaurants, setRestaurants] = useState(initialRestaurants);

  const handleAddRestaurant = () => {
    setModalOpen(false);
    // Update restaurants state after save (e.g., via API response)
  };

  const handleRestaurantClick = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  const handleBackToList = () => {
    setSelectedRestaurant(null);
  };

  // If a restaurant is selected, show detailed view
  if (selectedRestaurant) {
    return (
      <RestaurantDetailedView 
        restaurant={selectedRestaurant} 
        onBack={handleBackToList}
      />
    );
  }

  // Otherwise show restaurant list
  return (
    <div className="bg-white rounded-xl min-h-screen">
      <div className="p-2 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4 sm:mb-6">Restaurants list</h2>
        
        {/* 4 Cards Per Row Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Add new restaurant card */}
          <div 
            className="w-full h-[280px] border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 bg-white shadow-sm"
            onClick={() => setModalOpen(true)}
          >
            <div className="text-center">
              <span className="text-4xl text-gray-400">+</span>
              <p className="text-sm text-gray-500 mt-2">Add Restaurant</p>
            </div>
          </div>

          {/* Existing restaurants */}
          {restaurants.map((restaurant, idx) => (
            <div 
              key={idx}
              className="w-full h-[280px] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => handleRestaurantClick(restaurant)}
            >
              {/* Restaurant Image */}
              <div className="h-[120px] w-full">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='120' viewBox='0 0 220 120'%3E%3Crect width='220' height='120' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='12'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>

              {/* Restaurant Details */}
              <div className="p-3 space-y-1.5">
                <div className="font-medium text-gray-900 text-sm">
                  <span className="text-xs text-gray-600">Name: </span>
                  {restaurant.name}
                </div>
                <div className="text-xs text-gray-600">
                  <span className="text-gray-500">Admin: </span>
                  <span className="font-medium text-gray-700">{restaurant.adminName}</span>
                </div>
                <div className="text-xs text-gray-600">
                  <span className="text-gray-500">Mobile: </span>
                  <span className="font-medium text-gray-700">{restaurant.mobileNumber}</span>
                </div>
                <div className="text-xs text-gray-600">
                  <span className="text-gray-500">Location: </span>
                  <span className="font-medium text-gray-700 line-clamp-1">{restaurant.location}</span>
                </div>
                <div className="text-xs text-blue-600 font-medium pt-1 border-t border-gray-100">
                  Total Orders: <span className="font-semibold">{restaurant.totalOrders}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <AddRestaurant onSave={handleAddRestaurant} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RestaurantList;

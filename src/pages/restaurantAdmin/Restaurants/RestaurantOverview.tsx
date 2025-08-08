// components/RestaurantOverview.tsx
import React from "react";

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

type Props = {
  restaurant: Restaurant;
  onEdit: (restaurant: Restaurant) => void;
};

const RestaurantOverview: React.FC<Props> = ({ restaurant, onEdit }) => {
  const handleEditClick = () => {
    onEdit(restaurant);
  };

  return (
    <div className="space-y-6">
      {/* Restaurant Information Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-black mb-4">Restaurant Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Restaurant Name</label>
              <p className="text-black font-medium">{restaurant.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Admin Name</label>
              <p className="text-black font-medium">{restaurant.adminName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Mobile Number</label>
              <p className="text-black font-medium">{restaurant.mobileNumber}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
              <p className="text-black font-medium">{restaurant.location}</p>
            </div>
          </div>
          <div className="flex justify-center">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-48 h-32 object-cover rounded-lg border border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='192' height='128' viewBox='0 0 192 128'%3E%3Crect width='192' height='128' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Delete
          </button>
          <button 
            onClick={handleEditClick}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantOverview;

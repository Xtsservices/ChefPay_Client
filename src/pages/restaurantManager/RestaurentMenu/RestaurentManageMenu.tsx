import React from 'react';
import RestaurantMenu from "@/common/RestaurantMenu";

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

const restaurant: Restaurant = 
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
  }

const RestaurentManageMenu = () => {
  return (
    <div className="min-h-screen">
      <RestaurantMenu restaurant={restaurant} />
    </div>
  );
};

export default RestaurentManageMenu;
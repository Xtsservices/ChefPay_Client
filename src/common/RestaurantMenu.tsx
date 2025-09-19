// components/RestaurantMenu.tsx
import React, { useState, useMemo, useEffect } from "react";
import { apiGet } from "@/api/apis";
import { AppState } from "@/store/storeTypes";
import { useSelector } from "react-redux";

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

type ApiCategory = {
  id: number;
  name: string;
};

type ApiMenuItem = {
  itemId: number;
  itemName: string;
  categoryId: number;
  categoryName: string;
  price: string;
  foodType: "veg" | "non-veg";
  image: string;
  status: boolean;
  days: string[];
};
type ApiMenuResponse =
  | {
      // Case 1: items[] structure
      items: ApiMenuItem[];
    }
  | {
      // Case 2: data[] structure
      data: { day: string; itemIds: string }[];
      items: ApiMenuItem[];
    };

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  image: string;
  availableDays: string[];
};

type Props = {
  restaurant: Restaurant;
};

const RestaurantMenu: React.FC<Props> = ({ restaurant }) => {
  const currentUserData = useSelector(
    (state: AppState) => state.currentUserData
  );
  const [selectedCategory, setSelectedCategory] = useState("All Items");
  const [viewMode, setViewMode] = useState<"veg" | "non-veg" | "all">("all");
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Date().getDay();
    const dayKeys = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayKeys[today];
  });

  const [categories, setCategories] = useState<string[]>(["All Items"]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  // Days of the week
  const daysOfWeek = [
    { key: "Mon", label: "Monday", display: "Mon" },
    { key: "Tue", label: "Tuesday", display: "Tue" },
    { key: "Wed", label: "Wednesday", display: "Wed" },
    { key: "Thu", label: "Thursday", display: "Thu" },
    { key: "Fri", label: "Friday", display: "Fri" },
    { key: "Sat", label: "Saturday", display: "Sat" },
    { key: "Sun", label: "Sunday", display: "Sun" },
  ];

  const getCurrentDay = () => {
    const today = new Date().getDay();
    const dayKeys = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayKeys[today];
  };

  // Fetch categories + menu from APIs
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiGet("/categories/getAllCategories");
        const apiData: ApiCategory[] = response.data.data || [];
        const newCategories = apiData.map((cat) => cat.name);
        setCategories(["All Items", ...newCategories]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchMenuItems = async () => {
      try {
        const response = await apiGet(
          `/menus/getMenuByCanteenID/${currentUserData.canteenId}`
        );

        const apiData: ApiMenuResponse = response.data.data || {};

        let transformed: MenuItem[] = [];

        // ✅ Case 1: items already contain days[]
        if (
          "items" in apiData &&
          apiData.items?.length > 0 &&
          apiData.items[0]?.days
        ) {
          transformed = apiData.items.map((item) => ({
            id: String(item.itemId),
            name: item.itemName,
            description: `${item.categoryName} special item`,
            price: Number(item.price),
            category: item.categoryName,
            isVeg: item.foodType === "veg",
            image: item.image,
            availableDays: item.days || [],
          }));
        }

        // ✅ Case 2: data[] + items[]
        else if ("data" in apiData && "items" in apiData) {
          const dayMap: Record<number, string[]> = {};

          apiData.data.forEach((entry) => {
            const ids = entry.itemIds.split(",").map((id) => Number(id.trim()));
            ids.forEach((id) => {
              if (!dayMap[id]) dayMap[id] = [];
              dayMap[id].push(entry.day);
            });
          });

          transformed = apiData.items.map((item) => ({
            id: String(item.itemId),
            name: item.itemName,
            description: `${item.categoryName} special item`,
            price: Number(item.price),
            category: item.categoryName,
            isVeg: item.foodType === "veg",
            image: item.image,
            availableDays: dayMap[item.itemId] || [],
          }));
        }

        setMenuItems(transformed);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    if (currentUserData?.canteenId) {
      fetchCategories();
      fetchMenuItems();
    }
  }, [currentUserData?.canteenId]);

  // Filter items
   const dayFilteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const dayMatch = item.availableDays.includes(selectedDay);
      const vegMatch =
        viewMode === "all" ||
        (viewMode === "veg" && item.isVeg) ||
        (viewMode === "non-veg" && !item.isVeg);
      return dayMatch && vegMatch;
    });
  }, [menuItems, selectedDay, viewMode]);

  const filteredItems = useMemo(() => {
    return dayFilteredItems.filter((item) => {
      return (
        selectedCategory === "All Items" || item.category === selectedCategory
      );
    });
  }, [dayFilteredItems, selectedCategory]);

  const getCategoryCount = (category: string) => {
    if (category === "All Items") {
      return dayFilteredItems.length;
    }
    return dayFilteredItems.filter((item) => item.category === category).length;
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
              { key: "all", label: "All", icon: "🍽️" },
              { key: "veg", label: "Veg", icon: "🥗" },
              { key: "non-veg", label: "Non-Veg", icon: "🍖" },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setViewMode(option.key as any)}
                className={`px-4 py-2 text-sm rounded-md transition-colors ${
                  viewMode === option.key
                    ? "bg-white text-black shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
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
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : count === 0
                        ? "text-gray-400 cursor-not-allowed bg-gray-50"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {category}
                    <span
                      className={`float-right text-xs px-2 py-1 rounded-full ${
                        count === 0
                          ? "bg-gray-200 text-gray-400"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
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
                        ? "bg-blue-600 text-white shadow-md"
                        : isToday
                        ? "bg-green-100 text-green-700 border-2 border-green-500"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                    title={`${day.label}${isToday ? " (Today)" : ""}`}
                  >
                    {day.display}
                    {isToday && !isSelected && (
                      <div className="w-1 h-1 bg-green-500 rounded-full mx-auto mt-1"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-40 w-full">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='160' viewBox='0 0 300 160'%3E%3Crect width='300' height='160' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-black text-sm">
                      {item.name}
                    </h5>
                    <span
                      className={`w-3 h-3 rounded-full border-2 ${
                        item.isVeg
                          ? "bg-green-500 border-green-500"
                          : "bg-red-500 border-red-500"
                      }`}
                    ></span>
                  </div>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-green-600">
                      ₹{item.price}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Available:{" "}
                    {item.availableDays.length === 7
                      ? "All Days"
                      : item.availableDays.join(", ")}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <p className="text-gray-500">
                No menu items available for the selected filters.
              </p>
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

import React, { useState, useMemo, useEffect } from "react";
import { apiGet } from "@/api/apis";
import { AppState } from "@/store/storeTypes";
import { useSelector } from "react-redux";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";

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
      items: ApiMenuItem[];
    }
  | {
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

        const menus = response.data.data || [];

        let transformed: MenuItem[] = [];
        const dayMap: Record<number, string[]> = {};

        menus.forEach((menu: any) => {
          const dayKey = menu.dayOfWeek.substring(0, 3);
          menu.items.forEach((item: any) => {
            if (!dayMap[item.id]) dayMap[item.id] = [];
            dayMap[item.id].push(dayKey);

            if (!transformed.find((m) => m.id === String(item.id))) {
              transformed.push({
                id: String(item.id),
                name: item.name,
                description:
                  item.description || `${item.categoryName} special item`,
                price: Number(item.price),
                category: item.categoryName,
                isVeg: item.foodType === "veg",
                image: item.image,
                availableDays: [],
              });
            }
          });
        });

        transformed = transformed.map((item) => ({
          ...item,
          availableDays: dayMap[Number(item.id)] || [],
        }));

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

  const getActiveItemsText = (): string => {
    const count = filteredItems.length;
    const categoryDisplayName =
      selectedCategory === "All Items" ? "all" : selectedCategory;
    return `Showing ${count} ${categoryDisplayName.toLowerCase()} items`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Menu Items
          </h1>
          <p className="text-muted-foreground mt-1">
            Browse the menu for {restaurant.name}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="flex gap-2">
            {[
              { key: "all", label: "All", icon: "🍽️" },
              { key: "veg", label: "Veg", icon: "🥗" },
              { key: "non-veg", label: "Non-Veg", icon: "🍖" },
            ].map((option) => (
              <Button
                key={option.key}
                onClick={() => setViewMode(option.key as any)}
                variant={viewMode === option.key ? "default" : "outline"}
                className={`px-4 py-2 text-sm transition-colors ${
                  viewMode === option.key
                    ? "bg-gradient-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="mr-2">{option.icon}</span>
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4 space-y-2">
              <h4 className="text-lg font-semibold text-white">Categories</h4>
              {categories.map((category) => {
                const count = getCategoryCount(category);
                return (
                  <div
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedCategory === category
                        ? "bg-gradient-primary text-primary-foreground shadow-md"
                        : "hover:bg-muted hover:shadow-sm text-white"
                    }`}
                  >
                    <span className="font-medium">{category}</span>
                    <Badge
                      variant={selectedCategory === category ? "secondary" : "outline"}
                      className={`transition-all duration-200 ${
                        selectedCategory === category
                          ? "bg-white/20 text-white border-white/30"
                          : count === 0
                          ? "bg-gray-700 text-gray-500"
                          : "bg-blue-100 text-blue-700 hover:bg-muted"
                      }`}
                    >
                      {count}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {getActiveItemsText()}
            </p>
            {selectedCategory !== "All Items" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategory("All Items")}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Clear Filter
              </Button>
            )}
          </div>

          <div className="mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-white">Available Days</h4>
                  <span className="text-sm text-gray-300">
                    Today: {getCurrentDay()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {daysOfWeek.map((day) => {
                    const isToday = getCurrentDay() === day.key;
                    const isSelected = selectedDay === day.key;

                    return (
                      <Button
                        key={day.key}
                        onClick={() => setSelectedDay(day.key)}
                        variant={isSelected ? "default" : isToday ? "outline" : "ghost"}
                        className={`px-4 py-2 text-sm font-medium min-w-[60px] ${
                          isSelected
                            ? "bg-gradient-primary text-primary-foreground shadow-md"
                            : isToday
                            ? "bg-green-700 text-green-200 border-2 border-green-500"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                        }`}
                        title={`${day.label}${isToday ? " (Today)" : ""}`}
                      >
                        {day.display}
                        {isToday && !isSelected && (
                          <div className="w-1 h-1 bg-green-500 rounded-full mx-auto mt-1"></div>
                        )}
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className=" border border-gray-700 hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 group"
              >
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='160' viewBox='0 0 300 160'%3E%3Crect width='300' height='160' fill='%23111111'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%2349a3ff'%3ENo Image%3C/text%3E%3C/svg%3E";
                      }}
                    />
                   
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-white line-clamp-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground capitalize">
                        {item.category}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-lg font-bold text-white">
                        ₹{item.price}
                      </span>
                      <Badge
                        variant={item.isVeg ? "default" : "destructive"}
                        className={`${
                          item.isVeg
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                      >
                        {item.isVeg ? "Veg" : "Non-Veg"}
                      </Badge>
                    </div>
                    <div className="mt-2 text-xs text-gray-300">
                      Available:{" "}
                      {item.availableDays.length === 7
                        ? "All Days"
                        : item.availableDays.join(", ")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-gray-300"
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
              <h3 className="text-lg font-semibold text-white mb-2">
                No items found
              </h3>
              <p className="text-sm text-gray-300 mb-4 max-w-sm">
                No menu items available for the selected filters.
              </p>
              <p className="text-sm text-gray-400">
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
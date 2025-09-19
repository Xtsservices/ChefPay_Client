import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, X, AlertCircle, Calendar, Clock } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSelector } from "react-redux";
import { AppState } from "@/store/storeTypes";
import { apiGet, apiPut } from "@/api/apis";

interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: string | number;
  categoryId: number;
  categoryName: string;
  foodType: "veg" | "non-veg";
  image: string;
  canteenId: number;
  canteenName?: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
  count?: number;
  active?: boolean;
}

interface EditMenuModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  menuItems: MenuItem[];
  categories: Category[];
  onSubmit?: (data: EditMenuData) => void;
}

interface EditMenuData {
  menuName?: string;
  menuType: "daily" | "day-specific";
  selectedDays: string[];
  selectedItems: number[]; // keep for daily
  selectedDayItems?: Record<string, number[]>; // NEW
  canteenId: number;
}


interface FormErrors {
  menuName?: string;
  menuType?: string;
  days?: string;
  items?: string;
}

const EditMenuModal: React.FC<EditMenuModalProps> = ({
  open,
  onOpenChange,
  menuItems,
  categories,
  onSubmit,
}) => {
  // Get current user data from Redux store
  const currentUserData = useSelector(
    (state: AppState) => state.currentUserData
  );

  const [formData, setFormData] = useState<EditMenuData>({
    menuName: "",
    menuType: "daily",
    selectedDays: [],
    selectedItems: [],
    canteenId: currentUserData?.canteenId || 1,
  });
  console.log(" form data payload for edit menu", formData);

  const [errors, setErrors] = useState<FormErrors>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("All");

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

  // Get current day for highlighting
  const getCurrentDay = () => {
    const today = new Date().getDay();
    const dayKeys = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return dayKeys[today];
  };

  const [menuId, setMenuId] = useState<number | null>(null);

  // Calculate category counts dynamically
  const getCategoryCount = useMemo(() => {
    return (categoryName: string): number => {
      if (categoryName === "All") {
        return menuItems?.length || 0;
      }
      return (
        menuItems?.filter(
          (item) =>
            item.categoryName.toLowerCase() === categoryName.toLowerCase()
        ).length || 0
      );
    };
  }, [menuItems]);

  // Create dynamic categories from props with "All" as first option and counts
  const dynamicCategories = useMemo(() => {
    const allCategory = {
      id: 0,
      name: "All",
      value: "all",
      count: getCategoryCount("All"),
    };
    const categoryTabs = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      value: cat.name.toLowerCase().replace(/\s+/g, "-"),
      count: getCategoryCount(cat.name),
    }));
    return [allCategory, ...categoryTabs];
  }, [categories, getCategoryCount]);

  // Filter items based on active tab and search term
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        activeTab === "All" ||
        item.categoryName.toLowerCase() === activeTab.toLowerCase();
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description &&
          item.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, activeTab, searchTerm]);

  // Update canteenId when currentUserData changes
  useEffect(() => {
    if (currentUserData?.canteenId) {
      setFormData((prev) => ({
        ...prev,
        canteenId: currentUserData.canteenId,
      }));
    }
  }, [currentUserData]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        menuName: "",
        menuType: "daily",
        selectedDays: [],
        selectedItems: [],
        canteenId: currentUserData?.canteenId || 1,
      });
      setErrors({});
      setSearchTerm("");
      setActiveTab("All");
    }
  }, [open, currentUserData]);

  // Reset days when menu type changes
  useEffect(() => {
    if (formData.menuType === "daily") {
      setFormData((prev) => ({ ...prev, selectedDays: [] }));
    }
  }, [formData.menuType]);

  // Validation functions
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (
      formData.menuType === "day-specific" &&
      formData.selectedDays.length === 0
    ) {
      newErrors.days = "Please select at least one day for day-specific menu";
    }

    if (formData.selectedItems.length === 0) {
      newErrors.items = "Please select at least one item";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle menu type change
  const handleMenuTypeChange = (value: "daily" | "day-specific"): void => {
    setFormData((prev) => ({ ...prev, menuType: value }));

    if (errors.menuType) {
      setErrors((prev) => ({ ...prev, menuType: undefined }));
    }
  };

  // Handle day selection
  const handleDayChange = (dayKey: string, checked: boolean): void => {
    setFormData((prev) => ({
      ...prev,
      selectedDays: checked
        ? [...prev.selectedDays, dayKey]
        : prev.selectedDays.filter((day) => day !== dayKey),
    }));

    if (errors.days) {
      setErrors((prev) => ({ ...prev, days: undefined }));
    }
  };

  // Handle item selection
 const handleItemChange = (itemId: number, checked: boolean, dayKey?: string): void => {
  if (formData.menuType === "day-specific" && dayKey) {
    setFormData((prev) => ({
      ...prev,
      selectedDayItems: {
        ...prev.selectedDayItems,
        [dayKey]: checked
          ? [...(prev.selectedDayItems?.[dayKey] || []), itemId]
          : (prev.selectedDayItems?.[dayKey] || []).filter((id) => id !== itemId),
      },
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      selectedItems: checked
        ? [...prev.selectedItems, itemId]
        : prev.selectedItems.filter((id) => id !== itemId),
    }));
  }
};


  // Handle menu name change
  const handleMenuNameChange = (value: string): void => {
    setFormData((prev) => ({ ...prev, menuName: value }));

    if (errors.menuName) {
      setErrors((prev) => ({ ...prev, menuName: undefined }));
    }
  };

  // Handle form submission
  const handleSubmit1 = async (): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
     const payload = {
  menuType: formData.menuType,
  canteenId: currentUserData?.canteenId || formData.canteenId,
  data:
    formData.menuType === "day-specific"
      ? Object.entries(formData.selectedDayItems || {}).map(([day, ids]) => ({
          day,
          itemIds: ids.join(","),
        }))
      : daysOfWeek.map((day) => ({
          day: day.key,
          itemIds: formData.selectedItems.join(","),
        })),
};


      console.log("Updating menu with payload:", payload);

      if (menuId) {
        const response = await apiPut(`menus/updateMenu/${menuId}`, payload);
        console.log("Menu API Response:", response);

        if (!response?.data) {
          throw new Error("Failed to update menu: Empty response");
        }

        console.log("Menu updated successfully:", response.data);
      }

      if (onSubmit) {
        await onSubmit(payload);
      }

      // Reset form after successful submit
      setFormData({
        menuName: "",
        menuType: "daily",
        selectedDays: [],
        selectedItems: [],
        canteenId: currentUserData?.canteenId || 1,
      });
      setErrors({});
      setSearchTerm("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating menu:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

const handleSubmit = async (): Promise<void> => {
  if (isSubmitting) return;
  setIsSubmitting(true);

  if (!validateForm()) {
    setIsSubmitting(false);
    return;
  }

  try {
    const payload = {
      menuType: formData.menuType,
      canteenId: currentUserData?.canteenId || formData.canteenId,
      data:
        formData.menuType === "day-specific"
          ? formData.selectedDays.map((day) => ({
              day,
              itemIds: formData.selectedItems.join(","),
            }))
          : daysOfWeek.map((day) => ({
              day: day.key,
              itemIds: formData.selectedItems.join(","),
            })),
    };

    console.log("Updating menu with payload:", payload);

    if (menuId) {
      const response = await apiPut(`/menus/updateMenu/${menuId}`, payload);
      console.log("Menu API Response:", response);

      if (!response?.data) {
        throw new Error("Failed to update menu: Empty response");
      }
      console.log("Menu updated successfully:", response.data);
    }

    // Reset state
    setFormData({
      menuName: "",
      menuType: "daily",
      selectedDays: [],
      selectedItems: [],
      canteenId: currentUserData?.canteenId || 1,
    });
    setErrors({});
    setSearchTerm("");
    onOpenChange(false);
  } catch (error) {
    console.error("Error updating menu:", error);
  } finally {
    setIsSubmitting(false);
  }
};

  // Handle cancel
  const handleCancel = (): void => {
    setFormData({
      menuName: "",
      menuType: "daily",
      selectedDays: [],
      selectedItems: [],
      canteenId: currentUserData?.canteenId || 1,
    });
    setErrors({});
    setSearchTerm("");
    onOpenChange(false);
  };

  // Remove selected day
  const removeDay = (dayKey: string): void => {
    handleDayChange(dayKey, false);
  };
const fetchMenuByCanteenId = async () => {
  try {
    const response = await apiGet(
      `/menus/getMenuByCanteenID/${currentUserData?.canteenId || 1}`
    );

    if (response.status === 200) {
      const menus = response.data.data;

      if (!menus || menus.length === 0) {
        setMenuId(null);
        return;
      }

      const menuType = menus[0].menuType;

      // Map day → itemIds
      const dayItemMap: Record<string, number[]> = {};
      menus.forEach((menu: any) => {
        const dayKey = menu.dayOfWeek.substring(0, 3); // "Monday" → "Mon"
        dayItemMap[dayKey] = menu.items.map((it: any) => it.id);
      });

      setMenuId(menus[0].menuId);
      setFormData({
        menuName: "",
        menuType,
        selectedDays: menuType === "day-specific"
          ? Object.keys(dayItemMap)
          : [],
        selectedItems: menuType === "daily"
          ? Object.values(dayItemMap).flat()
          : [],
        selectedDayItems: dayItemMap,
        canteenId: currentUserData?.canteenId || 1,
      });
    }
  } catch (error) {
    console.error("Error fetching menu by canteenId:", error);
  }
};



  useEffect(() => {
    if (open) {
      fetchMenuByCanteenId(); // fetch API when modal opens
      setErrors({});
      setSearchTerm("");
      setActiveTab("All");
    }
  }, [open, currentUserData]);

 return (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 bg-white border border-gray-200/20 shadow-2xl rounded-lg overflow-hidden flex flex-col backdrop-blur-md">
      {/* Header - Fixed */}
      <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200/20 flex-shrink-0 bg-transparent backdrop-blur-sm rounded-t-lg">
        <DialogTitle className="text-lg sm:text-xl font-semibold text-center text-black">
          Edit Menu
        </DialogTitle>
        {currentUserData?.canteenName && (
          <p className="text-sm text-gray-600 text-center">
            For {currentUserData.canteenName}
          </p>
        )}
      </DialogHeader>

      {/* Main Content Area */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Side - Categories Sidebar */}
        <div className="w-64 border-r border-gray-200/20 bg-transparent flex-shrink-0">
          <div className="p-4 border-b border-gray-200/20">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              Categories
            </h3>
          </div>
          <ScrollArea className="flex-1 h-full">
            <div className="p-2 space-y-1">
              {dynamicCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.name)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                    activeTab === category.name
                      ? "bg-blue-500/20 text-blue-700 shadow-sm backdrop-blur-sm border border-blue-300/30"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/10 backdrop-blur-sm"
                  }`}
                >
                  <span>{category.name}</span>
                  <Badge
                    variant="secondary"
                    className={`text-xs transition-all duration-200 ${
                      activeTab === category.name
                        ? "bg-blue-200/50 text-blue-800 border border-blue-300/50"
                        : "bg-gray-100/50 text-gray-700 border border-gray-300/30"
                    }`}
                  >
                    {category.count}
                  </Badge>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Center - Menu Configuration */}
        <div className="w-80 border-r border-gray-200/20 bg-transparent flex flex-col flex-shrink-0">
          <ScrollArea className="flex-1 px-4 sm:px-6">
            <div className="py-4 sm:py-6 space-y-4 mb-4">
              {/* Menu Name Input - Optional */}
              <div className="space-y-2">
                <Label
                  htmlFor="menuName"
                  className="text-sm font-medium text-black"
                >
                  Menu Name <span className="text-gray-400">(Optional)</span>
                </Label>
                <Input
                  id="menuName"
                  placeholder="Enter menu name (optional)"
                  value={formData.menuName}
                  onChange={(e) => handleMenuNameChange(e.target.value)}
                  className="w-full text-black bg-transparent border-gray-300/50 placeholder:text-gray-500 text-sm backdrop-blur-sm"
                />
              </div>

              {/* Menu Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-black">
                  Menu Type <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.menuType}
                  onValueChange={handleMenuTypeChange}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2 p-3 border border-gray-200/50 rounded-lg bg-transparent backdrop-blur-sm">
                    <RadioGroupItem
                      value="daily"
                      id="daily"
                      className="flex-shrink-0"
                    />
                    <Label htmlFor="daily" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-medium text-black text-sm">
                            Daily Menu
                          </div>
                          <div className="text-xs text-gray-600">
                            Available all days
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border border-gray-200/50 rounded-lg bg-transparent backdrop-blur-sm">
                    <RadioGroupItem
                      value="day-specific"
                      id="day-specific"
                      className="flex-shrink-0"
                    />
                    <Label
                      htmlFor="day-specific"
                      className="flex-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <div className="font-medium text-black text-sm">
                            Day Specific
                          </div>
                          <div className="text-xs text-gray-600">
                            Select specific days
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Days Selection - Only show if day-specific is selected */}
              {formData.menuType === "day-specific" && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-black">
                    Select Days <span className="text-red-500">*</span>
                  </Label>

                  {/* Selected Days Display */}
                  {formData.selectedDays.length > 0 && (
                    <div className="max-h-16 overflow-y-auto">
                      <div className="flex flex-wrap gap-1 p-2 bg-transparent backdrop-blur-sm rounded border border-gray-200/50">
                        {formData.selectedDays.map((dayKey) => {
                          const day = daysOfWeek.find((d) => d.key === dayKey);
                          return (
                            <Badge
                              key={dayKey}
                              variant="secondary"
                              className="bg-blue-100/50 text-black border border-blue-200/50 hover:bg-blue-200/50 cursor-pointer text-xs backdrop-blur-sm"
                              onClick={() => removeDay(dayKey)}
                            >
                              {day?.display}
                              <X className="h-2 w-2 ml-1" />
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Days Grid */}
                  <div className="grid grid-cols-2 gap-2">
                    {daysOfWeek.map((day) => {
                      const isToday = getCurrentDay() === day.key;
                      const isSelected = formData.selectedDays.includes(
                        day.key
                      );

                      return (
                        <div
                          key={day.key}
                          className="flex items-center space-x-2 p-2 border border-gray-200/50 rounded hover:bg-gray-50/20 transition-colors bg-transparent backdrop-blur-sm"
                        >
                          <Checkbox
                            id={`day-${day.key}`}
                            checked={isSelected}
                            onCheckedChange={(checked) =>
                              handleDayChange(day.key, checked as boolean)
                            }
                            className="flex-shrink-0"
                          />
                          <Label
                            htmlFor={`day-${day.key}`}
                            className={`text-xs font-medium cursor-pointer flex-1 min-w-0 ${
                              isToday ? "text-green-600" : "text-black"
                            }`}
                          >
                            {day.display}
                            {isToday && <span className="ml-1">•</span>}
                          </Label>
                        </div>
                      );
                    })}
                  </div>

                  {/* 🔥 Per-Day Selected Items Display */}
                  {formData.selectedDays.map((dayKey) => (
                    <div key={dayKey} className="mt-2">
                      <h4 className="text-xs font-semibold text-gray-700 mb-1">
                        {daysOfWeek.find((d) => d.key === dayKey)?.display} Items:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {(formData.selectedDayItems?.[dayKey] || []).map(
                          (itemId) => {
                            const item = menuItems.find((i) => i.id === itemId);
                            return item ? (
                              <Badge
                                key={itemId}
                                variant="secondary"
                                className="bg-gray-100 text-black border border-gray-200 text-xs"
                              >
                                {item.name}
                              </Badge>
                            ) : null;
                          }
                        )}
                        {(formData.selectedDayItems?.[dayKey] || []).length ===
                          0 && (
                          <span className="text-xs text-gray-400">
                            No items selected
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {errors.days && (
                    <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="break-words">{errors.days}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Selected Items Count */}
              <div className="p-3 sm:p-4 bg-blue-50/30 rounded-lg border border-blue-200/50 backdrop-blur-sm">
                <div className="text-sm text-black font-medium">
                  Selected Items
                </div>
                <div className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
                  {formData.menuType === "day-specific"
                    ? Object.values(formData.selectedDayItems || {}).reduce(
                        (sum: number, arr: number[]) => sum + arr.length,
                        0
                      )
                    : formData.selectedItems.length}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  items selected for this menu
                </div>
                {formData.menuType === "day-specific" &&
                  formData.selectedDays.length > 0 && (
                    <div className="text-xs text-gray-600 mt-1 break-words">
                      Available on: {formData.selectedDays.join(", ")}
                    </div>
                  )}
              </div>

              {/* Selected Items List - only for daily menus */}
              {formData.menuType === "daily" &&
                formData.selectedItems.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <Label className="text-sm font-medium text-black">
                      Selected Items:
                    </Label>
                    <ScrollArea className="max-h-48">
                      <div className="space-y-1">
                        {formData.selectedItems.map((itemId) => {
                          const item = menuItems.find(
                            (item) => item.id === itemId
                          );
                          return item ? (
                            <div
                              key={itemId}
                              className="flex items-center justify-between p-2 bg-transparent backdrop-blur-sm rounded border border-gray-200/50 text-xs"
                            >
                              <span className="text-black font-medium truncate flex-1 mr-2">
                                {item.name}
                              </span>
                              <button
                                onClick={() => handleItemChange(itemId, false)}
                                className="text-red-500 hover:text-red-700 flex-shrink-0"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </ScrollArea>
                  </div>
                )}
            </div>
          </ScrollArea>
        </div>

        {/* Right Side - Items Selection */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {/* Search Bar - Fixed */}
          <div className="p-4 sm:p-6 border-b border-gray-200/20 bg-transparent flex-shrink-0 backdrop-blur-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-black bg-transparent border-gray-300/50 placeholder:text-gray-500 text-sm backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Items Grid - Scrollable */}
          <div className="flex-1 overflow-hidden">
           <ScrollArea className="h-full">
  <div className="p-4 sm:p-6 pb-20">

    {/* 🔥 Selected Items Section */}
    {(formData.menuType === "daily" && formData.selectedItems.length > 0) ||
    (formData.menuType === "day-specific" &&
      Object.keys(formData.selectedDayItems || {}).length > 0) ? (
      <div className="mb-6 border border-gray-200/50 rounded-lg bg-blue-50/20 backdrop-blur-sm p-4">
        <h3 className="text-sm font-semibold text-black mb-3">
          Currently Selected Items
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
          {formData.menuType === "daily" &&
            formData.selectedItems.map((itemId) => {
              const item = filteredItems.find((i) => i.id === itemId);
              if (!item) return null;
              return (
                <div
                  key={itemId}
                  className="flex items-start gap-3 p-3 border border-gray-200/50 rounded-lg bg-white/70 backdrop-blur-sm shadow-sm"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-black text-sm truncate">
                      {item.name}
                    </h4>
                    {item.description && (
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-1">
                      <Badge
                        className={`text-xs ${
                          item.foodType === "veg"
                            ? "bg-green-100/50 text-green-800 border-green-200/50"
                            : "bg-red-100/50 text-red-800 border-red-200/50"
                        }`}
                      >
                        {item.foodType === "veg" ? "Veg" : "Non-Veg"}
                      </Badge>
                      <button
                        onClick={() => handleItemChange(itemId, false)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

          {formData.menuType === "day-specific" &&
            formData.selectedDays.map((dayKey) =>
              (formData.selectedDayItems?.[dayKey] || []).map((itemId) => {
                const item = filteredItems.find((i) => i.id === itemId);
                if (!item) return null;
                return (
                  <div
                    key={`${dayKey}-${itemId}`}
                    className="flex items-start gap-3 p-3 border border-gray-200/50 rounded-lg bg-white/70 backdrop-blur-sm shadow-sm"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-black text-sm truncate">
                        {item.name}{" "}
                        <span className="text-xs text-gray-500">
                          ({dayKey})
                        </span>
                      </h4>
                      {item.description && (
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-1">
                        <Badge
                          className={`text-xs ${
                            item.foodType === "veg"
                              ? "bg-green-100/50 text-green-800 border-green-200/50"
                              : "bg-red-100/50 text-red-800 border-red-200/50"
                          }`}
                        >
                          {item.foodType === "veg" ? "Veg" : "Non-Veg"}
                        </Badge>
                        <button
                          onClick={() => handleItemChange(itemId, false, dayKey)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
        </div>
      </div>
    ) : null}

    {/* Items Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
      {filteredItems.map((item) => (
        <div
          key={item.id}
          className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md backdrop-blur-sm ${
            formData.menuType === "daily"
              ? formData.selectedItems.includes(item.id)
                ? "border-blue-500/50 bg-blue-50/20 shadow-md"
                : "border-gray-200/50 bg-transparent hover:border-gray-300/50 hover:bg-gray-50/10"
              : Object.values(formData.selectedDayItems || {}).some(
                  (arr: number[]) => arr.includes(item.id)
                )
              ? "border-blue-500/50 bg-blue-50/20 shadow-md"
              : "border-gray-200/50 bg-transparent hover:border-gray-300/50 hover:bg-gray-50/10"
          }`}
          onClick={() =>
            handleItemChange(
              item.id,
              formData.menuType === "daily"
                ? !formData.selectedItems.includes(item.id)
                : undefined // handled per day elsewhere
            )
          }
        >
          <div className="flex items-start space-x-3">
            <Checkbox
              checked={
                formData.menuType === "daily"
                  ? formData.selectedItems.includes(item.id)
                  : Object.values(formData.selectedDayItems || {}).some(
                      (arr: number[]) => arr.includes(item.id)
                    )
              }
              onChange={() => {}}
              className="mt-1 flex-shrink-0"
            />
            <img
              src={item.image}
              alt={item.name}
              className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-lg flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-black text-sm line-clamp-1">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {item.description}
                </p>
              )}
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-black text-sm">
                  ₹{item.price}
                </span>
                <Badge
                  variant={item.foodType === "veg" ? "default" : "destructive"}
                  className={`text-xs ${
                    item.foodType === "veg"
                      ? "bg-green-100/50 text-green-800 border-green-200/50"
                      : "bg-red-100/50 text-red-800 border-red-200/50"
                  }`}
                >
                  {item.foodType === "veg" ? "Veg" : "Non-Veg"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {filteredItems.length === 0 && (
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">No items found</p>
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm("")}
            className="mt-2 text-black hover:text-black"
          >
            Clear search
          </Button>
        )}
      </div>
    )}
  </div>
</ScrollArea>

          </div>

          {errors.items && (
            <div className="px-4 sm:px-6 py-3 border-t border-red-200/20 bg-red-50/30 flex-shrink-0 backdrop-blur-sm">
              <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="break-words">{errors.items}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Fixed */}
      <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200/20 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 flex-shrink-0 bg-transparent backdrop-blur-sm rounded-b-lg">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-4 sm:px-6 text-black border-gray-300/50 hover:bg-gray-50/20 text-sm bg-transparent backdrop-blur-sm"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto px-4 sm:px-6 bg-green-600/80 hover:bg-green-700/80 text-white text-sm backdrop-blur-sm"
        >
          {isSubmitting ? "Updating..." : "Edit Menu"}
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

};

export default EditMenuModal;

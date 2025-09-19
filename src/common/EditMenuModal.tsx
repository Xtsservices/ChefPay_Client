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
  selectedItems: number[];
  selectedDayItems?: Record<string, number[]>;
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
  const currentUserData = useSelector((state: AppState) => state.currentUserData);

  const [formData, setFormData] = useState<EditMenuData>({
    menuName: "",
    menuType: "day-specific",
    selectedDays: [],
    selectedItems: [],
    canteenId: currentUserData?.canteenId || 1,
  });

  // Master data that persists items even when days are deselected
  const [masterDayItems, setMasterDayItems] = useState<Record<string, number[]>>({});

  const [errors, setErrors] = useState<FormErrors>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [activeDay, setActiveDay] = useState<string | null>(null);

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

  const [menuId, setMenuId] = useState<number | null>(null);

  const getCategoryCount = useMemo(() => {
    return (categoryName: string): number => {
      if (categoryName === "All") {
        return menuItems?.length || 0;
      }
      return (
        menuItems?.filter(
          (item) => item.categoryName.toLowerCase() === categoryName.toLowerCase()
        ).length || 0
      );
    };
  }, [menuItems]);

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

  useEffect(() => {
    if (currentUserData?.canteenId) {
      setFormData((prev) => ({
        ...prev,
        canteenId: currentUserData.canteenId,
      }));
    }
  }, [currentUserData]);

  useEffect(() => {
    if (open) {
      const currentDay = getCurrentDay();
      setFormData({
        menuName: "",
        menuType: "day-specific",
        selectedDays: [currentDay],
        selectedItems: [],
        selectedDayItems: { [currentDay]: [] },
        canteenId: currentUserData?.canteenId || 1,
      });
      setMasterDayItems({ [currentDay]: [] });
      setErrors({});
      setSearchTerm("");
      setActiveTab("All");
    }
  }, [open, currentUserData]);

  useEffect(() => {
    if (formData.menuType === "day-specific" && formData.selectedDays.length > 0) {
      const current = getCurrentDay();
      const newActive = formData.selectedDays.includes(current) ? current : formData.selectedDays[0];
      setActiveDay(newActive);
    } else {
      setActiveDay(null);
    }
  }, [formData.menuType, formData.selectedDays]);

  // Improved sync function that combines all items from all selected days
  const syncSelectedItemsAcrossDays = (masterData: Record<string, number[]>, selectedDays: string[]): Record<string, number[]> => {
    // Get all unique items from all selected days
    const allUniqueItems = new Set<number>();
    selectedDays.forEach(day => {
      if (masterData[day]) {
        masterData[day].forEach(itemId => allUniqueItems.add(itemId));
      }
    });

    const combinedItems = Array.from(allUniqueItems);

    // Create the result object with only selected days
    const result: Record<string, number[]> = {};
    selectedDays.forEach(day => {
      result[day] = [...combinedItems];
    });

    return result;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.menuType === "day-specific" && formData.selectedDays.length === 0) {
      newErrors.days = "Please select at least one day for day-specific menu";
    }

    const totalItems =
      formData.menuType === "daily"
        ? formData.selectedItems.length
        : Object.values(formData.selectedDayItems || {}).reduce(
            (sum: number, arr: number[]) => sum + arr.length,
            0
          );

    if (totalItems === 0) {
      newErrors.items = "Please select at least one item";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMenuTypeChange = (value: "daily" | "day-specific"): void => {
    if (value === "daily") {
      // Convert day-specific items to daily
      const allItems = new Set<number>();
      Object.values(masterDayItems).forEach(items => {
        items.forEach(itemId => allItems.add(itemId));
      });

      setFormData((prev) => ({
        ...prev,
        menuType: value,
        selectedDays: [],
        selectedItems: Array.from(allItems),
        selectedDayItems: undefined,
      }));
    } else {
      // Convert daily items to day-specific
      const currentDay = getCurrentDay();
      const newMasterData = { ...masterDayItems };
      
      if (formData.selectedItems.length > 0) {
        newMasterData[currentDay] = [...formData.selectedItems];
      } else if (!newMasterData[currentDay]) {
        newMasterData[currentDay] = [];
      }

      const selectedDayItems = syncSelectedItemsAcrossDays(newMasterData, [currentDay]);

      setFormData((prev) => ({
        ...prev,
        menuType: value,
        selectedDays: [currentDay],
        selectedItems: [],
        selectedDayItems,
      }));
      setMasterDayItems(newMasterData);
    }

    if (errors.menuType) {
      setErrors((prev) => ({ ...prev, menuType: undefined }));
    }
  };

  const handleDayChange = (dayKey: string, checked: boolean): void => {
    setFormData((prev) => {
      let newSelectedDays = checked
        ? [...prev.selectedDays, dayKey]
        : prev.selectedDays.filter((day) => day !== dayKey);

      // Update master data - preserve items even when day is deselected
      const newMasterData = { ...masterDayItems };
      if (checked && !newMasterData[dayKey]) {
        // Initialize new day with empty array if it doesn't exist
        newMasterData[dayKey] = [];
      }
      // Note: We DON'T delete from masterDayItems when unchecked

      // Only show items for selected days, but don't lose the data
      const newSelectedDayItems = syncSelectedItemsAcrossDays(newMasterData, newSelectedDays);

      setMasterDayItems(newMasterData);

      return {
        ...prev,
        selectedDays: newSelectedDays,
        selectedDayItems: newSelectedDayItems,
      };
    });

    if (errors.days) {
      setErrors((prev) => ({ ...prev, days: undefined }));
    }
  };

  const handleItemChange = (itemId: number, checked: boolean, dayKey?: string): void => {
    if (formData.menuType === "day-specific" && dayKey) {
      // Update master data first
      const newMasterData = { ...masterDayItems };
      if (checked) {
        // Add item to the specific day in master data
        newMasterData[dayKey] = [...(newMasterData[dayKey] || []), itemId];
      } else {
        // Remove item from the specific day in master data
        newMasterData[dayKey] = (newMasterData[dayKey] || []).filter((id) => id !== itemId);
      }

      // Sync items across all selected days based on updated master data
      const newSelectedDayItems = syncSelectedItemsAcrossDays(newMasterData, formData.selectedDays);

      setMasterDayItems(newMasterData);
      setFormData((prev) => ({
        ...prev,
        selectedDayItems: newSelectedDayItems,
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

  // New function to handle item removal from "Edit items for day" section
  const handleRemoveItemFromDay = (itemId: number, dayKey: string): void => {
    const newMasterData = { ...masterDayItems };
    newMasterData[dayKey] = (newMasterData[dayKey] || []).filter((id) => id !== itemId);

    // Sync items across all selected days based on updated master data
    const newSelectedDayItems = syncSelectedItemsAcrossDays(newMasterData, formData.selectedDays);

    setMasterDayItems(newMasterData);
    setFormData((prev) => ({
      ...prev,
      selectedDayItems: newSelectedDayItems,
    }));
  };

  const handleMenuNameChange = (value: string): void => {
    setFormData((prev) => ({ ...prev, menuName: value }));

    if (errors.menuName) {
      setErrors((prev) => ({ ...prev, menuName: undefined }));
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
        await onSubmit(formData);
      }

      const currentDay = getCurrentDay();
      setFormData({
        menuName: "",
        menuType: "day-specific",
        selectedDays: [currentDay],
        selectedItems: [],
        selectedDayItems: { [currentDay]: [] },
        canteenId: currentUserData?.canteenId || 1,
      });
      setMasterDayItems({ [currentDay]: [] });
      setErrors({});
      setSearchTerm("");
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating menu:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (): void => {
    const currentDay = getCurrentDay();
    setFormData({
      menuName: "",
      menuType: "day-specific",
      selectedDays: [currentDay],
      selectedItems: [],
      selectedDayItems: { [currentDay]: [] },
      canteenId: currentUserData?.canteenId || 1,
    });
    setMasterDayItems({ [currentDay]: [] });
    setErrors({});
    setSearchTerm("");
    onOpenChange(false);
  };

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

        const currentDay = getCurrentDay();
        let menuType = "day-specific";
        let dayItemMap: Record<string, number[]> = {};
        let selectedItems: number[] = [];
        let selectedDayItems: Record<string, number[]> | undefined;
        let selectedDays: string[] = [currentDay]; // Always start with current day only

        if (menus && menus.length > 0) {
          menuType = menus[0].menuType;
          
          // Build the complete master data from API
          menus.forEach((menu: any) => {
            const dayKey = menu.dayOfWeek.substring(0, 3);
            dayItemMap[dayKey] = menu.items.map((it: any) => it.id);
          });

          if (menuType === "daily") {
            const allItems = new Set<number>();
            Object.values(dayItemMap).forEach(items => {
              items.forEach(itemId => allItems.add(itemId));
            });
            selectedItems = Array.from(allItems);
            selectedDayItems = undefined;
            selectedDays = []; // No days selected for daily menu
          } else {
            // Set master data from API response (all days)
            setMasterDayItems(dayItemMap);
            
            // But only show current day initially in selectedDayItems
            selectedDayItems = {
              [currentDay]: dayItemMap[currentDay] || []
            };
            selectedDays = [currentDay]; // Only current day selected initially
            
            // Ensure current day exists in master data
            if (!dayItemMap[currentDay]) {
              setMasterDayItems(prev => ({ ...prev, [currentDay]: [] }));
            }
          }
          setMenuId(menus[0].menuId);
        } else {
          // Default state when no menus exist
          selectedDays = [currentDay];
          selectedDayItems = { [currentDay]: [] };
          setMasterDayItems({ [currentDay]: [] });
        }

        setFormData({
          menuName: "",
          menuType,
          selectedDays, // This will now only contain current day
          selectedItems,
          selectedDayItems,
          canteenId: currentUserData?.canteenId || 1,
        });
      }
    } catch (error) {
      console.error("Error fetching menu by canteenId:", error);
      const currentDay = getCurrentDay();
      setFormData({
        menuName: "",
        menuType: "day-specific",
        selectedDays: [currentDay], // Only current day
        selectedItems: [],
        selectedDayItems: { [currentDay]: [] },
        canteenId: currentUserData?.canteenId || 1,
      });
      setMasterDayItems({ [currentDay]: [] });
    }
  };

  useEffect(() => {
    if (open) {
      fetchMenuByCanteenId();
      setErrors({});
      setSearchTerm("");
      setActiveTab("All");
    }
  }, [open, currentUserData]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-full h-[95vh] p-0 bg-white border border-gray-200/20 shadow-2xl rounded-lg overflow-hidden flex flex-col backdrop-blur-md">
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

        <div className="flex flex-1 min-h-0 overflow-hidden">
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

          <div className="w-80 border-r border-gray-200/20 bg-transparent flex flex-col flex-shrink-0">
            <ScrollArea className="flex-1 px-4 sm:px-6">
              <div className="py-4 sm:py-6 space-y-4 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="menuName" className="text-sm font-medium text-black">
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
                      <RadioGroupItem value="daily" id="daily" className="flex-shrink-0" />
                      <Label htmlFor="daily" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="font-medium text-black text-sm">Daily Menu</div>
                            <div className="text-xs text-gray-600">Available all days</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border border-gray-200/50 rounded-lg bg-transparent backdrop-blur-sm">
                      <RadioGroupItem value="day-specific" id="day-specific" className="flex-shrink-0" />
                      <Label htmlFor="day-specific" className="flex-1 cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="font-medium text-black text-sm">Day Specific</div>
                            <div className="text-xs text-gray-600">Select specific days</div>
                          </div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.menuType === "day-specific" && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-black">
                      Select Days <span className="text-red-500">*</span>
                    </Label>

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

                    <div className="grid grid-cols-2 gap-2">
                      {daysOfWeek.map((day) => {
                        const isToday = getCurrentDay() === day.key;
                        const isSelected = formData.selectedDays.includes(day.key);
                        const hasItemsInMaster = masterDayItems[day.key] && masterDayItems[day.key].length > 0;

                        return (
                          <div
                            key={day.key}
                            className={`flex items-center space-x-2 p-2 border rounded hover:bg-gray-50/20 transition-colors backdrop-blur-sm ${
                              hasItemsInMaster 
                                ? "border-green-300/70 bg-green-50/30" 
                                : "border-gray-200/50 bg-transparent"
                            }`}
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
                              className={`text-xs font-medium cursor-pointer flex-1 min-w-0 flex items-center gap-1 ${
                                isToday ? "text-green-600 font-semibold" : "text-black"
                              }`}
                            >
                              {day.display}
                              {isToday && <span>•</span>}
                              {hasItemsInMaster && (
                                <div className={`w-2 h-2 rounded-full ${
                                  isSelected ? "bg-green-600" : "bg-green-400"
                                }`} />
                              )}
                            </Label>
                          </div>
                        );
                      })}
                    </div>

                    {/* Edit items for day sections - removed dropdown */}
                    {formData.selectedDays.map((dayKey) => (
                      <div key={dayKey} className="mt-4 p-3 bg-gray-50/30 rounded-lg border border-gray-200/50 backdrop-blur-sm">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">
                          {daysOfWeek.find((d) => d.key === dayKey)?.label} Menu Items:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {(formData.selectedDayItems?.[dayKey] || []).map(
                            (itemId) => {
                              const item = menuItems.find((i) => i.id === itemId);
                              return item ? (
                                <Badge
                                  key={itemId}
                                  variant="secondary"
                                  className="bg-blue-100/70 text-black border border-blue-200/50 text-xs cursor-pointer hover:bg-red-100/70 hover:border-red-200/50 transition-colors"
                                  onClick={() => handleRemoveItemFromDay(itemId, dayKey)}
                                >
                                  {item.name}
                                  <X className="h-2 w-2 ml-1" />
                                </Badge>
                              ) : null;
                            }
                          )}
                          {(formData.selectedDayItems?.[dayKey] || []).length === 0 && (
                            <span className="text-xs text-gray-400">
                              No items selected for this day
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

                {formData.menuType === "daily" &&
                  formData.selectedItems.length > 0 && (
                    <div className="space-y-2 mb-4">
                      <Label className="text-sm font-medium text-black">
                        Selected Items:
                      </Label>
                      <ScrollArea className="max-h-48">
                        <div className="space-y-1">
                          {formData.selectedItems.map((itemId) => {
                            const item = menuItems.find((item) => item.id === itemId);
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

          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200/20 bg-transparent flex-shrink-0 backdrop-blur-sm">
              {formData.menuType === "day-specific" && activeDay && (
                <h3 className="mb-4 text-lg font-semibold text-black">
                  Selecting for {daysOfWeek.find((d) => d.key === activeDay)?.label}
                  <span className="text-sm font-normal text-gray-600 block">
                    Items will be automatically synced to all selected days
                  </span>
                </h3>
              )}
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

            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                {formData.menuType === "day-specific" && !activeDay ? (
                  <div className="text-center py-8 text-gray-500">
                    Please select a day to edit its menu items
                  </div>
                ) : (
                  <div className="p-4 sm:p-6 pb-20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                      {filteredItems.map((item) => {
                        const isSelected =
                          formData.menuType === "daily"
                            ? formData.selectedItems.includes(item.id)
                            : activeDay
                            ? (formData.selectedDayItems?.[activeDay] || []).includes(item.id)
                            : false;
                        return (
                          <div
                            key={item.id}
                            className={`border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md backdrop-blur-sm ${
                              isSelected
                                ? "border-blue-500/50 bg-blue-50/20 shadow-md"
                                : "border-gray-200/50 bg-transparent hover:border-gray-300/50 hover:bg-gray-50/10"
                            }`}
                            onClick={() => {
                              if (formData.menuType === "daily") {
                                handleItemChange(
                                  item.id,
                                  !formData.selectedItems.includes(item.id)
                                );
                              } else if (activeDay) {
                                handleItemChange(
                                  item.id,
                                  !isSelected,
                                  activeDay
                                );
                              }
                            }}
                          >
                            <div className="flex items-start space-x-3">
                              <Checkbox
                                checked={isSelected}
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
                        );
                      })}
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
                )}
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
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditMenuModal;

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import ItemAddModal from "@/common/ItemAddModal";
import CreateMenuModal from "@/common/CreateMenuModal";
import EditMenuModal from "@/common/EditMenuModal";
import ItemEditModal from "@/common/ItemEditModal";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { apiGet, apiPost, apiPut, apiDelete } from "@/api/apis";
import { useSelector } from "react-redux";
import { AppState } from "@/store/storeTypes";

interface Category {
  id: number;
  name: string;
  count: number;
  active: boolean;
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  categoryName: string;
  foodType: "veg" | "non-veg";
  isVeg: boolean;
  image: string;
  canteenId: number;
  canteenName: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

interface ApiCategory {
  id: number;
  name: string;
  description: string | null;
  status: string;
  createdAt: number;
  updatedAt: number;
}

const ItemsList: React.FC = () => {
  const currentUserData = useSelector(
    (state: AppState) => state.currentUserData
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCreateMenuModalOpen, setIsCreateMenuModalOpen] =
    useState<boolean>(false);
  const [isEditMenuModalOpen, setIsEditMenuModalOpen] =
    useState<boolean>(false);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] =
    useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [items, setItems] = useState<MenuItem[]>([]);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("home");
  const [newCategoryName, setNewCategoryName] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([
    // Initialize with Home category
    {
      id: 0,
      name: "Home",
      count: 0,
      active: true,
    },
  ]);
  const [apiCategories, setApiCategories] = useState<ApiCategory[]>([]);
  const [toast, setToast] = useState(null);

  const showToast = (title, description, variant = "default") => {
    setToast({ title, description, variant });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchItems = async () => {
    try {
      const response = await apiGet(
        `/items/getItemsByCanteen/${currentUserData.canteenId}`
      );
      console.log(response, " items fetched");
      if (response.status === 200) {
        setItems(response.data.data);
      } else {
        console.error("Failed to fetch items:", response);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Calculate category counts dynamically
  const getCategoryCount = (categoryName: string): number => {
    if (categoryName.toLowerCase() === "home") {
      return items?.length || 0; // Show all items for "Home"
    }
    return (
      items?.filter(
        (item) =>
          item?.categoryName?.toLowerCase() === categoryName?.toLowerCase()
      ).length || 0
    );
  };

  const [menuData, setMenuData] = useState<any | null>(null); // store menu

  const fetchMenuByCanteenID = async () => {
    try {
      const response = await apiGet(
        `/menus/getMenuByCanteenID/${currentUserData.canteenId}`
      );
      console.log(response, " menu fetched");
      if (response.status === 200 && response.data.data) {
        setMenuData(response.data.data); // store fetched menu
      } else {
        setMenuData(null); // no menu exists
        console.error("Failed to fetch menu:", response);
      }
    } catch (error) {
      setMenuData(null);
      console.error("Error fetching menu:", error);
    }
  };

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiGet("/categories/getAllCategories");
        console.log(response);
        const apiData: ApiCategory[] = response.data.data;
        setApiCategories(apiData);

        // Create categories from API data, excluding duplicates
        const newCategories = apiData
          .filter(
            (apiCat) =>
              !categories.some(
                (cat) => cat.name.toLowerCase() === apiCat.name.toLowerCase()
              )
          )
          .map((apiCat) => ({
            id: apiCat.id,
            name: apiCat.name,
            count: 0, // Will be calculated dynamically
            active: false,
          }));

        // Merge with existing categories (including Home)
        setCategories((prev) => [...prev, ...newCategories]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    if (!currentUserData) {
      return;
    }

    fetchCategories();
    fetchItems();
    fetchMenuByCanteenID();
  }, [currentUserData]);

  // Update category counts and active state whenever items or selectedCategory changes
  const updatedCategories = categories.map((category) => ({
    ...category,
    count: getCategoryCount(category.name),
    active: selectedCategory === category.name.toLowerCase(),
  }));

  // Filter menu items based on selected category
  const filteredMenuItems =
    selectedCategory === "home"
      ? items // Show all items for "Home"
      : items.filter(
          (item) =>
            item.categoryName.toLowerCase() === selectedCategory.toLowerCase()
        );

  const handleCategoryClick = (categoryName: string): void => {
    setSelectedCategory(categoryName.toLowerCase());
  };

  const handleAddItem = (): void => {
    setModalMode("add");
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditItem = (item: MenuItem): void => {
    setModalMode("edit");
    setEditingItem(item);
    setIsModalOpen(true);
  };
  // Add this function inside your ItemsList component
  const handleDeleteItem = async (itemId: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await apiDelete(`/items/deleteItem/${itemId}`, {});
      console.log("Delete API response:", response);
      if (response.status === 200) {
        // Remove item from local state immediately
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId));

        showToast("Success", "Item deleted successfully", "success");
      } else {
        showToast("Error", "Failed to delete item", "destructive");
        console.error("Delete failed:", response);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      showToast("Error", "Failed to delete item", "destructive");
    }
  };

  const handleCreateMenu = (): void => {
    setIsCreateMenuModalOpen(true);
  };
  const handleEditMenu = (): void => {
    setIsEditMenuModalOpen(true);
  };

  const handleCreateCategory = (): void => {
    setIsCreateCategoryModalOpen(true);
  };

  const handleCreateCategorySubmit = async (
    e: React.FormEvent
  ): Promise<void> => {
    e.preventDefault();
    console.log("Submitting new category:", newCategoryName);
    if (!newCategoryName.trim()) {
      alert("Category name cannot be empty");
      return;
    }
    console.log("Creating category:", newCategoryName);
    try {
      const response = await apiPost("/category/createCategory", {
        name: newCategoryName,
      });

      if (response.status === 200) {
        // Add new category to the list
        setCategories((prev) => [
          ...prev,
          {
            id: response.data.id,
            name: newCategoryName,
            count: 0,
            active: false,
          },
        ]);
        setNewCategoryName("");
        setIsCreateCategoryModalOpen(false);
        alert("Category created successfully");
      } else {
        console.error("Failed to create category:", response);
        throw new Error("Failed to create category");
      }
    } catch (error) {
      console.log("Error details:", error);
      console.error("Error creating category:", error);
      alert("Failed to create category");
    }
  };
  const handleModalSubmit = async (
    idOrFormData: number | any,
    formData?: any
  ): Promise<void> => {
    if (modalMode === "add") {
      try {
        const response = await apiPost("/items/createItem", idOrFormData);
        if (response.status === 201) {
          fetchItems();
          showToast("Success", "Item created successfully", "success");
          setIsModalOpen(false);
        } else {
          showToast("Error", "Failed to create item", "destructive");
        }
      } catch (error) {
        console.error("Error creating item:", error);
        showToast("Error", "Failed to create item", "destructive");
      }
    } else if (modalMode === "edit" && editingItem && formData) {
      try {
        const id = idOrFormData; // first arg is ID
        // Merge existing item and form values
        const mergedData = { ...editingItem, ...formData };

        // Build payload exactly as backend expects
        const payload = {
          description: mergedData.description ?? "",
          price: mergedData.price ?? 0,
          foodType: mergedData.foodType ?? "",
          image: mergedData.image ?? "",
          canteenId: mergedData.canteenId ?? 1,
        };

        console.log("Updating item with ID:", id, payload);

        const response = await apiPut(`/items/updateItem/${id}`, payload);
        if (response.status === 200) {
          fetchItems();
          showToast("Success", "Item updated successfully", "success");
          setIsModalOpen(false);
        } else {
          showToast("Error", "Failed to update item", "destructive");
        }
      } catch (error) {
        console.error("Error updating item:", error);
        showToast("Error", "Failed to update item", "destructive");
      }
    }
  };

  const handleCreateMenuSubmit = async (menuData: any): Promise<void> => {
    menuData.canteenId = 1;
    console.log("Creating new menu:", menuData);
    const response = await apiPost("/menus/createMenu", menuData);
    console.log("Response from API:", response);
    if (response.status === 201) {
      showToast("Success", "Menu created successfully", "success");
      setIsCreateMenuModalOpen(false);
    } else {
      showToast("Error", "Failed to create menu", "destructive");
    }
    // Add logic to handle menu creation
  };

  const getActiveItemsText = (): string => {
    const count = filteredMenuItems.length;
    const categoryDisplayName =
      categories.find((cat) => cat.name.toLowerCase() === selectedCategory)
        ?.name || selectedCategory;

    if (selectedCategory === "home") {
      return `Showing all ${count} items`;
    }
    return `Showing ${count} ${categoryDisplayName.toLowerCase()} items`;
  };

  console.log("categories", categories);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Item List
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your menu items and categories
          </p>
        </div>
        <div className="flex gap-3">
          {menuData ? (
            <Button className="bg-gradient-primary" onClick={handleEditMenu}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Menu
            </Button>
          ):(
            <Button variant="outline" onClick={handleCreateMenu}>
              <Plus className="h-4 w-4 mr-2" />
              Create Menu
            </Button>
          )
          }

          <Button className="bg-gradient-primary" onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {updatedCategories?.map((category, index) => (
                <div
                  key={index}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                    category.active
                      ? "bg-gradient-primary text-primary-foreground shadow-md"
                      : "hover:bg-muted hover:shadow-sm"
                  }`}
                >
                  <span className="font-medium">{category.name}</span>
                  <Badge
                    variant={category.active ? "secondary" : "outline"}
                    className={`transition-all duration-200 ${
                      category.active
                        ? "bg-white/20 text-white border-white/30"
                        : "hover:bg-muted"
                    }`}
                  >
                    {category.count}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Items Grid */}
        <div className="lg:col-span-3">
          {/* Filter Results Header */}
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {getActiveItemsText()}
            </p>
            {selectedCategory !== "home" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCategoryClick("home")}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Clear Filter
              </Button>
            )}
          </div>

          {/* Items Grid */}
          {filteredMenuItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {filteredMenuItems.map((item) => (
                <Card
                  key={item.id}
                  className="hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 group"
                >
                  <CardContent className="p-0">
                    {/* Item Image */}
                    <div className="relative aspect-square overflow-hidden rounded-t-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Item Details */}
                    <div className="p-4 space-y-2">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-foreground line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-muted-foreground capitalize">
                          {item.categoryName}
                        </p>
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-lg font-bold text-foreground">
                          ₹{item.price}
                        </span>
                        <Badge
                          variant={
                            item.foodType === "veg" ? "default" : "destructive"
                          }
                          className={`${
                            item.foodType === "veg"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-red-100 text-red-800 hover:bg-red-200"
                          }`}
                        >
                          {item.foodType === "veg" ? "Veg" : "Non-Veg"}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No items found
              </h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                No items available in the{" "}
                <span className="font-medium capitalize">
                  {selectedCategory}
                </span>{" "}
                category.
              </p>
              <Button onClick={handleAddItem} className="bg-gradient-primary">
                <Plus className="h-4 w-4 mr-2" />
                Add First Item
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      {modalMode === "add" ? (
        <ItemAddModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          mode="add"
          editItem={null}
          onSubmit={handleModalSubmit}
          categories={categories}
        />
      ) : (
        <ItemEditModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          editItem={editingItem!}
          onSubmit={handleModalSubmit}
          categories={categories}
        />
      )}

      {/* Create Menu Modal */}
      <CreateMenuModal
        open={isCreateMenuModalOpen}
        onOpenChange={setIsCreateMenuModalOpen}
        menuItems={items}
        onSubmit={handleCreateMenuSubmit}
        categories={categories}
      />
      <EditMenuModal
        open={isEditMenuModalOpen}
        onOpenChange={setIsEditMenuModalOpen}
        menuItems={items}
        // onSubmit={handleCreateMenuSubmit}
        categories={categories}
      />

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg backdrop-blur-md transform transition-all duration-300 ${
            toast.variant === "destructive"
              ? "bg-red-500/20 border border-red-500/30 text-red-100"
              : "bg-green-500/20 border border-green-500/30 text-green-100"
          }`}
        >
          <h4 className="font-semibold">{toast.title}</h4>
          <p className="text-sm opacity-90">{toast.description}</p>
        </div>
      )}

      {/* Create Category Modal */}
      <Dialog
        open={isCreateCategoryModalOpen}
        onOpenChange={setIsCreateCategoryModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCategorySubmit}>
            <div className="space-y-4">
              <Select
                value={newCategoryName}
                onValueChange={setNewCategoryName}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {apiCategories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateCategoryModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!newCategoryName.trim()}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ItemsList;
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import ItemAddModal from "@/common/ItemAddModal";
import CreateMenuModal from "@/common/CreateMenuModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { apiGet, apiPost } from "@/api/apis";


interface Category {
  name: string;
  count: number;
  active: boolean;
}

interface MenuItem {
  id: number;
  name: string;
  category: string;
  price: number;
  isVeg: boolean;
  description: string;
  image: string;
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isCreateMenuModalOpen, setIsCreateMenuModalOpen] = useState<boolean>(false);
   const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("home");
   const [newCategoryName, setNewCategoryName] = useState<string>("");
   const [categories, setCategories] = useState<Category[]>([
    
  ]);

  // { name: "Home", count: 0, active: true },
  //   { name: "Tiffins", count: 0, active: false },
  //   { name: "Lunch", count: 0, active: false },
  //   { name: "Beverages", count: 0, active: false },
  //   { name: "Snacks", count: 0, active: false },
  //   { name: "Desserts", count: 0, active: false },

   const [apiCategories, setApiCategories] = useState<ApiCategory[]>([]);

  const menuItems: MenuItem[] = [
    {
      id: 1,
      name: "Chicken Biryani",
      category: "lunch",
      price: 299,
      isVeg: false,
      description: "Aromatic basmati rice cooked with tender chicken",
      image: "https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01-750x750.jpg"
    },
    {
      id: 2,
      name: "Paneer Butter Masala",
      category: "lunch",
      price: 249,
      isVeg: true,
      description: "Creamy tomato-based curry with soft paneer cubes and aromatic",
      image: "https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01-750x750.jpg"
    },
    {
      id: 3,
      name: "Masala Chai",
      category: "beverages",
      price: 25,
      isVeg: true,
      description: "Traditional Indian spiced tea with cardamom, cloves and",
      image: "https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01-750x750.jpg"
    },
    {
      id: 4,
      name: "Masala Dosa",
      category: "tiffins",
      price: 120,
      isVeg: true,
      description: "Crispy rice crepe filled with spiced potato mixture",
      image: "https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01-750x750.jpg"
    },
    {
      id: 5,
      name: "Chocolate Brownie",
      category: "desserts",
      price: 150,
      isVeg: true,
      description: "Rich chocolate brownie served warm with vanilla ice cream and",
      image: "https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01-750x750.jpg"
    },
    {
      id: 6,
      name: "Vegetable Samosa",
      category: "snacks",
      price: 45,
      isVeg: true,
      description: "Crispy pastry filled with spiced potatoes and peas, served with",
      image: "https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01-750x750.jpg"
    },
    {
      id: 7,
      name: "Mango Lassi",
      category: "beverages",
      price: 80,
      isVeg: true,
      description: "Refreshing yogurt-based drink blended with fresh mango pulp and",
      image: "https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01-750x750.jpg"
    },
    {
      id: 8,
      name: "Butter Chicken",
      category: "lunch",
      price: 320,
      isVeg: false,
      description: "Tender chicken in rich cashew and herbs",
      image: "https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01-750x750.jpg"
    },
    {
      id: 9,
      name: "Vada Pav",
      category: "home",
      price: 35,
      isVeg: true,
      description: "Mumbai's favorite street food with potato fritters",
      image: "https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01-750x750.jpg"
    },
    {
      id: 10,
      name: "Idli Sambar",
      category: "home",
      price: 60,
      isVeg: true,
      description: "Steamed rice cakes served with lentil curry",
      image: "https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01-750x750.jpg"
    },
    {
      id: 11,
      name: "Poha",
      category: "home",
      price: 40,
      isVeg: true,
      description: "Traditional flattened rice breakfast with vegetables",
      image: "https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01-750x750.jpg"
    },
    {
      id: 12,
      name: "Upma",
      category: "home",
      price: 45,
      isVeg: true,
      description: "Savory semolina porridge with vegetables and spices",
      image: "https://www.licious.in/blog/wp-content/uploads/2022/06/chicken-hyderabadi-biryani-01-750x750.jpg"
    },
    
  ];

   // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await apiGet('/category/allCategories');
        const apiData: ApiCategory[] = response.data.data;
        setApiCategories(apiData);
        // Merge API categories with initial categories, avoiding duplicates
        setCategories(prev => {
          const newCategories = apiData
            .filter(apiCat => !prev.some(cat => cat.name.toLowerCase() === apiCat.name.toLowerCase()))
            .map(apiCat => ({
              name: apiCat.name,
              count: 0,
              active: false
            }));
          return [
            ...prev,
            ...newCategories
          ];
        });
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Calculate category counts dynamically
  const getCategoryCount = (categoryName: string): number => {
    if (categoryName.toLowerCase() === "home") {
      return menuItems.length; // Show all items for "Home"
    }
    return menuItems.filter(item => 
      item.category.toLowerCase() === categoryName.toLowerCase()
    ).length;
  };

  // Update category counts
  const updatedCategories = categories.map(category => ({
    ...category,
    count: getCategoryCount(category.name),
    active: selectedCategory === category.name.toLowerCase()
  }));


  // Generate categories with dynamic counts
  const categories2: Category[] = [
    { name: "Home", count: getCategoryCount("home"), active: selectedCategory === "home" },
    { name: "Tiffins", count: getCategoryCount("tiffins"), active: selectedCategory === "tiffins" },
    { name: "Lunch", count: getCategoryCount("lunch"), active: selectedCategory === "lunch" },
    { name: "Beverages", count: getCategoryCount("beverages"), active: selectedCategory === "beverages" },
    { name: "Snacks", count: getCategoryCount("snacks"), active: selectedCategory === "snacks" },
    { name: "Desserts", count: getCategoryCount("desserts"), active: selectedCategory === "desserts" },
  ];

  // Filter menu items based on selected category
  const filteredMenuItems = selectedCategory === "home" 
    ? menuItems // Show all items for "Home"
    : menuItems.filter(item => 
        item.category.toLowerCase() === selectedCategory.toLowerCase()
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

  const handleCreateMenu = (): void => {
    setIsCreateMenuModalOpen(true);
  };

   const handleCreateCategory = (): void => {
    setIsCreateCategoryModalOpen(true);
  };

  const handleCreateCategorySubmit = async (e: React.FormEvent): Promise<void> => {
     e.preventDefault(); 
    console.log("Submitting new category:", newCategoryName);
    if (!newCategoryName.trim()) {
      alert("Category name cannot be empty");
      return;
    }
console.log("Creating category:", newCategoryName);
    try {
      const response = await apiPost('/category/createCategory', {
        name: newCategoryName,
      });
console.log("Create category response:", response);

      if (response.status === 200) {
        setCategories([...categories, {
          name: newCategoryName,
          count: 0,
          active: false
        }]);
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

  const handleModalSubmit = (formData: any): void => {
    if (modalMode === "add") {
      console.log("Adding new item:", formData);
      // Add logic to add new item
      // You might want to update your menuItems state here
    } else {
      console.log("Updating item:", editingItem?.id, formData);
      // Add logic to update existing item
      // You might want to update your menuItems state here
    }
  };



  const handleCreateMenuSubmit = (menuData: any): void => {
    console.log("Creating new menu:", menuData);
    // Add logic to handle menu creation
    // You might want to send this data to your backend
  };

  const getActiveItemsText = (): string => {
    const count = filteredMenuItems.length;
    const categoryDisplayName = categories.find(cat => 
      cat.name.toLowerCase() === selectedCategory
    )?.name || selectedCategory;
    
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
              {/* <Button 
              variant="outline"
              onClick={handleCreateCategory}
            >
              Create Category
            </Button> */}
          <Button 
            variant="outline"
            onClick={handleCreateMenu}
          >
            Create Menu
          </Button>
          <Button 
            className="bg-gradient-primary"
            onClick={handleAddItem}
          >
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
              {categories?.map((category, index) => (
                <div
                  key={index}
                  onClick={() => handleCategoryClick(category.name)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                    category.active 
                      ? 'bg-gradient-primary text-primary-foreground shadow-md' 
                      : 'hover:bg-muted hover:shadow-sm'
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
                <Card key={item.id} className="hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 group">
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
                        <Button size="sm" variant="secondary">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="secondary"
                          onClick={() => handleEditItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="destructive">
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
                          {item.category}
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
                <span className="font-medium capitalize">{selectedCategory}</span> category.
              </p>
              <Button 
                onClick={handleAddItem}
                className="bg-gradient-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add First Item
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      <ItemAddModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
        mode={modalMode}
        editItem={editingItem}
        onSubmit={handleModalSubmit}
        categories={categories.map(cat => cat.name)}
      />

      {/* Create Menu Modal */}
      <CreateMenuModal
        open={isCreateMenuModalOpen}
        onOpenChange={setIsCreateMenuModalOpen}
        menuItems={menuItems}
        onSubmit={handleCreateMenuSubmit}
      />

       {/* Create Category Modal */}
       <Dialog open={isCreateCategoryModalOpen} onOpenChange={setIsCreateCategoryModalOpen}>
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

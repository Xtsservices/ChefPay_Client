import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle } from "lucide-react";

interface AppState {
  currentUserData: {
    canteenId: number;
  };
}

interface FormData {
  name: string;
  description: string;
  categoryId: string; // String for form handling, will convert to number
  foodType: "veg" | "non-veg";
  price: string; // String in form, will convert to number
  image: string;
  canteenId: number;
}

interface FormErrors {
  name?: string;
  description?: string;
  categoryId?: string;
  price?: string;
  image?: string;
}

interface MenuItem {
  id?: number;
  name: string;
  category: string; // Assumed to be category name
  price: number;
  isVeg: boolean;
  description: string;
  image: string;
}

interface Category {
  id: number;
  name: string;
  count?: number;
  active?: boolean;
}

interface ItemAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  editItem?: MenuItem | null;
  onSubmit?: (data: {
    name: string;
    description: string;
    price: number;
    categoryId: number;
    foodType: "veg" | "non-veg";
    image: string;
    canteenId: number;
  }) => void;
  categories: Category[];
}

const ItemAddModal: React.FC<ItemAddModalProps> = ({
  open,
  onOpenChange,
  mode = "add",
  editItem = null,
  onSubmit,
  categories,
}) => {
  const currentUserData = useSelector((state: AppState) => state.currentUserData);
  const canteenId = currentUserData?.canteenId || 0;

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    categoryId: "",
    foodType: "veg",
    price: "",
    image: "",
    canteenId,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form data when editing
  useEffect(() => {
    if (mode === "edit" && editItem) {
      // Map category name to categoryId
      const selectedCategory = categories.find(
        (cat) => cat.name.toLowerCase() === editItem.category.toLowerCase()
      );
      setFormData({
        name: editItem.name,
        description: editItem.description,
        categoryId: selectedCategory ? selectedCategory.id.toString() : "",
        foodType: editItem.isVeg ? "veg" : "non-veg",
        price: editItem.price.toString(),
        image: editItem.image,
        canteenId,
      });
    } else if (mode === "add") {
      // Reset form for add mode
      setFormData({
        name: "",
        description: "",
        categoryId: "",
        foodType: "veg",
        price: "",
        image: "",
        canteenId,
      });
    }
    // Clear errors when modal opens/mode changes
    setErrors({});
  }, [mode, editItem, open, canteenId, categories]);

  // Validation functions
  const validateItemName = (value: string): string | undefined => {
    if (!value.trim()) return "Item name is required";
    if (value.trim().length < 2) return "Item name must be at least 2 characters";
    if (value.trim().length > 50) return "Item name must not exceed 50 characters";
    if (/^\d+$/.test(value.trim())) return "Item name cannot contain only numbers";
    return undefined;
  };

  const validateDescription = (value: string): string | undefined => {
    if (!value.trim()) return "Description is required";
    if (value.trim().length < 10) return "Description must be at least 10 characters";
    if (value.trim().length > 200) return "Description must not exceed 200 characters";
    return undefined;
  };

  const validateCategory = (value: string): string | undefined => {
    if (!value) return "Category is required";
    if (!categories.some((cat) => cat.id.toString() === value)) {
      return "Selected category is invalid";
    }
    return undefined;
  };

  const validatePrice = (value: string): string | undefined => {
    if (!value.trim()) return "Price is required";
    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return "Price must be a valid number";
    if (numericValue <= 0) return "Price must be greater than 0";
    if (numericValue > 9999) return "Price must not exceed ₹9999";
    return undefined;
  };

  const validateImage = (url: string): string | undefined => {
    if (mode === "add" && !url.trim()) return "Image URL is required";
    if (url.trim()) {
      const urlPattern = /^(https?:\/\/.*\.(?:png|jpg))$/i;
      if (!urlPattern.test(url.trim())) return "Please enter a valid image URL (png, jpg)";
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    newErrors.name = validateItemName(formData.name);
    newErrors.description = validateDescription(formData.description);
    newErrors.categoryId = validateCategory(formData.categoryId);
    newErrors.price = validatePrice(formData.price);
    newErrors.image = validateImage(formData.image);

    // Remove undefined errors
    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key as keyof FormErrors]) {
        delete newErrors[key as keyof FormErrors];
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear specific field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleItemNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (!/^\d+$/.test(value) || value === "") {
      handleInputChange("name", value);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      handleInputChange("price", value);
    }
  };

  const resetForm = (): void => {
    setFormData({
      name: "",
      description: "",
      categoryId: "",
      foodType: "veg",
      price: "",
      image: "",
      canteenId,
    });
    setErrors({});
  };

  const handleSubmit = async (): Promise<void> => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare payload for API
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId),
        foodType: formData.foodType,
        image: formData.image.trim(),
        canteenId: formData.canteenId,
      };

      if (onSubmit) {
        await onSubmit(payload);
      }

      console.log(`${mode === "add" ? "Adding" : "Updating"} item:`, payload);

      // Reset form and close modal
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = (): void => {
    resetForm();
    onOpenChange(false);
  };

  const modalTitle = mode === "add" ? "ADD NEW ITEM" : "EDIT ITEM";
  const submitButtonText = mode === "add" ? "Save Item" : "Update Item";

  console.log("Categories in modal:", categories);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0 bg-transparent border-0 shadow-none">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border border-white/20 max-h-[90vh] flex flex-col">
          {/* Header - Fixed */}
          <DialogHeader className="px-6 py-4 border-b border-gray-200/50 flex-shrink-0">
            <DialogTitle className="text-lg font-semibold text-center text-gray-800">
              {modalTitle}
            </DialogTitle>
          </DialogHeader>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-6 space-y-4">
              {/* Item Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Item Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Enter item name"
                  value={formData.name}
                  onChange={handleItemNameChange}
                  className={`w-full text-gray-900 bg-white/80 backdrop-blur-sm border-gray-300 ${
                    errors.name ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Enter description (min 10 characters)"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className={`w-full text-gray-900 min-h-[80px] resize-none bg-white/80 backdrop-blur-sm border-gray-300 ${
                    errors.description ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                <div className="flex justify-between items-center">
                  {errors.description ? (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.description}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500">
                      {formData.description.length}/200 characters
                    </p>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => handleInputChange("categoryId", value)}
                >
                  <SelectTrigger
                    className={`w-full text-gray-900 bg-white/80 backdrop-blur-sm border-gray-300 ${
                      errors.categoryId ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 text-gray-900 backdrop-blur-sm">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="" disabled>
                        No categories available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.categoryId}
                  </p>
                )}
              </div>

              {/* Food Type and Price Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Food Type */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Food Type <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup
                    value={formData.foodType}
                    onValueChange={(value: "veg" | "non-veg") => handleInputChange("foodType", value)}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="veg" id="veg" className="text-green-600" />
                      <Label htmlFor="veg" className="text-sm text-green-600 font-medium cursor-pointer">
                        Vegetarian
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non-veg" id="non-veg" className="text-red-600" />
                      <Label htmlFor="non-veg" className="text-sm text-red-600 font-medium cursor-pointer">
                        Non-Vegetarian
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                    Price (₹) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    type="text"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handlePriceChange}
                    className={`w-full text-gray-900 bg-white/80 backdrop-blur-sm border-gray-300 ${
                      errors.price ? "border-red-500 focus:border-red-500" : ""
                    }`}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.price}
                    </p>
                  )}
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="image-url" className="text-sm font-medium text-gray-700">
                  Image URL <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="image-url"
                  type="text"
                  placeholder="Enter image URL (png, jpg)"
                  value={formData.image}
                  onChange={(e) => handleInputChange("image", e.target.value)}
                  className={`w-full text-gray-900 bg-white/80 backdrop-blur-sm border-gray-300 ${
                    errors.image ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
                {errors.image && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.image}
                  </p>
                )}
                {mode === "edit" && editItem?.image && formData.image === editItem.image && (
                  <p className="text-xs text-gray-500">
                    Current image URL will be kept if not changed
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Footer Buttons - Fixed */}
          <div className="px-6 py-4 border-t border-gray-200/50 flex gap-3 flex-shrink-0 bg-white/90 backdrop-blur-sm rounded-b-lg">
            <Button
              variant="outline"
              className="flex-1 text-gray-900 bg-white/80 backdrop-blur-sm hover:bg-gray-50/80"
              onClick={handleCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : submitButtonText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemAddModal;
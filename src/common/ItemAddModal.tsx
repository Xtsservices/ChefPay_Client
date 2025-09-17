import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Upload, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface FormData {
  itemName: string;
  description: string;
  category: string;
  foodType: "vegetarian" | "non-vegetarian";
  price: string;
  image: File | null;
}

interface FormErrors {
  itemName?: string;
  description?: string;
  category?: string;
  price?: string;
  image?: string;
}

interface MenuItem {
  id?: number;
  name: string;
  category: string;
  price: number;
  isVeg: boolean;
  description: string;
  image: string;
}

interface ItemAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "add" | "edit";
  editItem?: MenuItem | null;
  onSubmit?: (data: FormData) => void;
  categories: string[];
}

const ItemAddModal: React.FC<ItemAddModalProps> = ({ 
  open, 
  onOpenChange, 
  mode = "add", 
  editItem = null,
  onSubmit ,
  categories
}) => {
  const [formData, setFormData] = useState<FormData>({
    itemName: "",
    description: "",
    category: "",
    foodType: "vegetarian",
    price: "",
    image: null
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const categories: string[] = [
  //   "Home",
  //   "Tiffins", 
  //   "Lunch",
  //   "Beverages",
  //   "Snacks",
  //   "Desserts"
  // ];

  // Populate form data when editing
  useEffect(() => {
    if (mode === "edit" && editItem) {
      setFormData({
        itemName: editItem.name,
        description: editItem.description,
        category: editItem.category.toLowerCase(),
        foodType: editItem.isVeg ? "vegetarian" : "non-vegetarian",
        price: editItem.price.toString(),
        image: null // Reset image for edit mode
      });
    } else if (mode === "add") {
      // Reset form for add mode
      setFormData({
        itemName: "",
        description: "",
        category: "",
        foodType: "vegetarian",
        price: "",
        image: null
      });
    }
    // Clear errors when modal opens/mode changes
    setErrors({});
  }, [mode, editItem, open]);

  // Validation functions
  const validateItemName = (value: string): string | undefined => {
    if (!value.trim()) return "Item name is required";
    if (value.trim().length < 2) return "Item name must be at least 2 characters";
    if (value.trim().length > 50) return "Item name must not exceed 50 characters";
    // Check if contains only numbers
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

  const validateImage = (file: File | null): string | undefined => {
    if (mode === "add" && !file) return "Image is required";
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) return "Please select a valid image file";
      // Check file size (2MB = 2 * 1024 * 1024 bytes)
      if (file.size > 2 * 1024 * 1024) return "Image size must not exceed 2MB";
    }
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    newErrors.itemName = validateItemName(formData.itemName);
    newErrors.description = validateDescription(formData.description);
    newErrors.category = validateCategory(formData.category);
    newErrors.price = validatePrice(formData.price);
    newErrors.image = validateImage(formData.image);

    // Remove undefined errors
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key as keyof FormErrors]) {
        delete newErrors[key as keyof FormErrors];
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | File | null): void => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear specific field error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleItemNameChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    // Prevent input if it's only numbers
    if (!/^\d+$/.test(value) || value === "") {
      handleInputChange("itemName", value);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (/^\d*\.?\d*$/.test(value) || value === "") {
      handleInputChange("price", value);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    if (file) {
      const imageError = validateImage(file);
      if (imageError) {
        setErrors(prev => ({ ...prev, image: imageError }));
        return;
      }
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      // Clear image error
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: undefined }));
      }
    }
  };

  const resetForm = (): void => {
    setFormData({
      itemName: "",
      description: "",
      category: "",
      foodType: "vegetarian",
      price: "",
      image: null
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
      // Handle form submission
      if (onSubmit) {
        await onSubmit(formData);
      }
      
      console.log(`${mode === "add" ? "Adding" : "Updating"} item:`, formData);
      
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
                <Label htmlFor="itemName" className="text-sm font-medium text-gray-700">
                  Item Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="itemName"
                  placeholder="Enter item name"
                  value={formData.itemName}
                  onChange={handleItemNameChange}
                  className={`w-full text-gray-900 bg-white/80 backdrop-blur-sm border-gray-300 ${
                    errors.itemName ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                />
                {errors.itemName && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.itemName}
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
                    errors.description ? 'border-red-500 focus:border-red-500' : ''
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
                  value={formData.category} 
                  onValueChange={(value) => handleInputChange("category", value)}
                >
                  <SelectTrigger className={`w-full text-gray-900 bg-white/80 backdrop-blur-sm border-gray-300 ${
                    errors.category ? 'border-red-500 focus:border-red-500' : ''
                  }`}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 text-gray-900 backdrop-blur-sm">
                    {categories?.map((category) => (
                      <SelectItem key={category} value={category ? category.toLowerCase() : ''}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.category}
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
                    onValueChange={(value: "vegetarian" | "non-vegetarian") => handleInputChange("foodType", value)}
                    className="flex flex-col sm:flex-row gap-3"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="vegetarian" id="vegetarian" className="text-green-600" />
                      <Label htmlFor="vegetarian" className="text-sm text-green-600 font-medium cursor-pointer">
                        Vegetarian
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="non-vegetarian" id="non-vegetarian" className="text-red-600" />
                      <Label htmlFor="non-vegetarian" className="text-sm text-red-600 font-medium cursor-pointer">
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
                      errors.price ? 'border-red-500 focus:border-red-500' : ''
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

              {/* Upload Image */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Upload Image <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 ml-1">(Max 2MB)</span>
                </Label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-gray-400/60 transition-colors bg-white/40 backdrop-blur-sm ${
                  errors.image ? 'border-red-500/60' : 'border-gray-300/60'
                }`}>
                  {formData.image ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center text-green-600">
                        <Upload className="h-6 w-6" />
                      </div>
                      <p className="text-sm text-gray-600">{formData.image.name}</p>
                      <p className="text-xs text-gray-500">
                        {(formData.image.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange("image", null)}
                        className="bg-white/80 text-gray-500 backdrop-blur-sm"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center text-gray-400">
                        <Upload className="h-8 w-8" />
                      </div>
                      <p className="text-sm text-gray-500">Click to browse files (Max 2MB)</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <Label
                        htmlFor="image-upload"
                        className="inline-block px-4 py-2 text-sm text-blue-600 bg-blue-50/80 backdrop-blur-sm rounded-md cursor-pointer hover:bg-blue-100/80 transition-colors"
                      >
                        Choose File
                      </Label>
                    </div>
                  )}
                </div>
                {errors.image && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.image}
                  </p>
                )}
                {mode === "edit" && editItem?.image && !formData.image && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Current image will be kept if no new image is uploaded</p>
                  </div>
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

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle } from "lucide-react";

interface AppState {
  currentUserData: {
    canteenId: number;
  };
}

interface MenuItem {
  id: number;
  name: string;
  description: string;
  categoryId: number;
  categoryName: string;
  price: number;
  foodType: "veg" | "non-veg";
  isVeg: boolean;
  image: string;
  canteenId: number;
}

interface Category {
  id: number;
  name: string;
}

interface ItemEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: MenuItem;
  onSubmit: (id: number, data: any) => Promise<void>;
  categories: Category[];
}

const ItemEditModal: React.FC<ItemEditModalProps> = ({
  open,
  onOpenChange,
  editItem,
  onSubmit,
  categories,
}) => {
  const currentUserData = useSelector(
    (state: AppState) => state.currentUserData
  );
  const canteenId = currentUserData?.canteenId || 0;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    foodType: "veg",
    price: "",
    image: "",
    canteenId,
  });

  const [errors, setErrors] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editItem) {
      setFormData({
        name: editItem.name,
        description: editItem.description,
        categoryId: editItem.categoryId.toString(),
        foodType: editItem.foodType,
        price: editItem.price.toString(),
        image: editItem.image,
        canteenId,
      });
      setErrors({});
    }
  }, [editItem, canteenId]);

  const validateForm = (): boolean => {
    const newErrors: any = {};
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (
      !formData.price ||
      isNaN(Number(formData.price)) ||
      Number(formData.price) <= 0
    )
      newErrors.price = "Price must be a valid number greater than 0";
    if (!formData.image.trim()) newErrors.image = "Image URL is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        categoryId: parseInt(formData.categoryId),
        foodType: formData.foodType,
        image: formData.image,
        canteenId: formData.canteenId,
      };
      await onSubmit(editItem.id, payload);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0 bg-transparent border-0 shadow-none">
        <div className="bg-white/95 backdrop-blur-sm rounded-lg shadow-2xl border border-white/20 max-h-[90vh] flex flex-col">
          <DialogHeader className="px-6 py-4 border-b border-gray-200/50 flex-shrink-0">
            <DialogTitle className="text-lg font-semibold text-center text-gray-800">
              EDIT ITEM
            </DialogTitle>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {/* Item Name (Disabled) */}
            <div className="space-y-2">
              <Label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Item Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                disabled
                className="w-full text-gray-500 bg-gray-100 border-gray-300"
              />
            </div>

            {/* Category (Disabled) */}
            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-sm font-medium text-gray-700"
              >
                Category
              </Label>
              <Input
                id="category"
                value={
                  categories.find((c) => c.id === parseInt(formData.categoryId))
                    ?.name || ""
                }
                disabled
                className="w-full text-gray-500 bg-gray-100 border-gray-300"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className={`w-full min-h-[80px] resize-none bg-white text-black ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter description"
              />

              {errors.description && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.description}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label
                htmlFor="price"
                className="text-sm font-medium text-gray-700"
              >
                Price (₹)
              </Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className={`w-full bg-white text-black ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.price && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.price}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Food Type
              </Label>
              <RadioGroup
                value={formData.foodType}
                onValueChange={(value: "veg" | "non-veg") =>
                  handleInputChange("foodType", value)
                }
                className="flex flex-row gap-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="veg" id="veg" />
                  <Label htmlFor="veg" className="text-black">
                    Veg
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="non-veg" id="non-veg" />
                  <Label htmlFor="non-veg" className="text-black">
                    Non-Veg
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* Image URL */}
            <div className="space-y-2">
              <Label
                htmlFor="image"
                className="text-sm font-medium text-gray-700"
              >
                Image URL
              </Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => handleInputChange("image", e.target.value)}
                className={`w-full bg-white text-black ${
                  errors.image ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.image && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {errors.image}
                </p>
              )}
            </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200/50 flex gap-3 flex-shrink-0">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-green-600 text-white"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Item"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ItemEditModal;

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Product } from "../../interface/product";
import { useState, useEffect } from "react"; // Add useEffect for debugging
import { Category } from "../../interface/category";

interface EditProductFormProps {
  product: Product;
  onClose: () => void;
  onSubmit: (product: Product) => void;
  categories?: Category[]; // Make `categories` optional
}

export default function EditProductForm({
  product,
  onClose,
  onSubmit,
  categories = [], // Default to an empty array if `categories` is undefined
}: EditProductFormProps) {
  // Debugging: Log the product and categories
  useEffect(() => {
    console.log("Product:", product);
    console.log("Categories:", categories);
  }, [product, categories]);

  useEffect(() => {
    if (categories.length > 0) {
      console.log("Categories updated in EditProductForm:", categories);
    }
  }, [categories]);
  
  
  // Ensure `image` is always an array
  const [editedProduct, setEditedProduct] = useState<Product>({
    ...product,
    image: product.image || [], // Default to an empty array if `image` is undefined
  });

  const [newImage, setNewImage] = useState("");

  const handleAddImage = () => {
    if (newImage.trim() !== "") {
      setEditedProduct((prev) => ({
        ...prev,
        image: [...prev.image, newImage],
      }));
      setNewImage("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setEditedProduct((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    onSubmit(editedProduct);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl font-semibold">
            Edit Product
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Product Name */}
          <label className="block">
            <span className="font-medium text-sm sm:text-base">Product Name</span>
            <Input
              type="text"
              value={editedProduct.name}
              onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
              placeholder="Product Name"
              className="w-full mt-1 text-sm sm:text-base"
            />
          </label>

          {/* Category */}
          <label className="block">
            <span className="font-medium text-sm sm:text-base">Category</span>
            <select
              value={editedProduct.category?.id || ""}
              onChange={(e) => {
                const selectedCategory = categories.find((cat) => cat.id === e.target.value);
                setEditedProduct({ ...editedProduct, category: selectedCategory });
              }}
              className="w-full mt-1 p-2 border rounded text-sm sm:text-base"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          {/* Image URLs */}
          <div className="space-y-2">
            <label className="block">
              <span className="font-medium text-sm sm:text-base">Add Image</span>
              <div className="flex flex-col sm:flex-row gap-2 mt-1">
                <Input
                  type="text"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="Add Image URL"
                  className="w-full text-sm sm:text-base"
                />
                <Button
                  type="button"
                  onClick={handleAddImage}
                  className="w-full sm:w-auto text-sm sm:text-base"
                >
                  Add Image
                </Button>
              </div>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {editedProduct.image.map((img, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border rounded p-2"
                >
                  <span className="truncate w-3/4 text-sm sm:text-base">{img}</span>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveImage(index)}
                    className="text-sm sm:text-base"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <label className="block">
            <span className="font-medium text-sm sm:text-base">Price</span>
            <Input
              type="number"
              value={editedProduct.price}
              onChange={(e) => setEditedProduct({ ...editedProduct, price: parseFloat(e.target.value) })}
              placeholder="Price"
              className="w-full mt-1 text-sm sm:text-base"
            />
          </label>

          {/* Quantity */}
          <label className="block">
            <span className="font-medium text-sm sm:text-base">Quantity</span>
            <Input
              type="number"
              value={editedProduct.quantity}
              onChange={(e) => setEditedProduct({ ...editedProduct, quantity: parseInt(e.target.value) })}
              placeholder="Quantity"
              className="w-full mt-1 text-sm sm:text-base"
            />
          </label>

          {/* Description */}
          <label className="block">
            <span className="font-medium text-sm sm:text-base">Description</span>
            <Input
              type="text"
              value={editedProduct.description || ""}
              onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
              placeholder="Description (optional)"
              className="w-full mt-1 text-sm sm:text-base"
            />
          </label>

          {/* Save Changes Button */}
          <Button onClick={handleSubmit} className="w-full text-sm sm:text-base">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
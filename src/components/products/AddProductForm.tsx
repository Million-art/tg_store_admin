import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";
import { Product } from "../../interface/product";
import { Category } from "../../interface/category";

interface AddProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (product: Product) => void;
  categories: Category[];
}

export default function AddProductForm({ isOpen, onClose, onSubmit, categories }: AddProductFormProps) {
  const [product, setProduct] = useState<Partial<Product>>({
    name: "",
    image: [], // Initialize image as an empty array
    price: 0,
    quantity: 0,
    description: "",
    category: undefined,
  });

  const [imageInput, setImageInput] = useState(""); // Temporary input for a single image URL

  const handleAddImage = () => {
    if (imageInput.trim() !== "") {
      setProduct((prev) => ({
        ...prev,
        image: [...(prev.image || []), imageInput], // Add the new image URL to the array
      }));
      setImageInput(""); // Clear the input field
    }
  };

  const handleRemoveImage = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      image: (prev.image || []).filter((_, i) => i !== index), // Remove the image at the specified index
    }));
  };

  const handleSubmit = () => {
    onSubmit(product as Product); // Cast to Product and call onSubmit
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            type="text"
            value={product.name || ""}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
            placeholder="Product name"
            className="w-full"
          />
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="text"
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="Image URL"
                className="w-full"
              />
              <Button type="button" onClick={handleAddImage}>
                Add Image
              </Button>
            </div>
            <div className="space-y-1">
              {product.image?.map((img, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span>{img}</span>
                  <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveImage(index)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <Input
            type="number"
            value={product.price || 0}
            onChange={(e) => setProduct({ ...product, price: parseFloat(e.target.value) })}
            placeholder="Price"
            className="w-full"
          />
          <Input
            type="number"
            value={product.quantity || 0}
            onChange={(e) => setProduct({ ...product, quantity: parseInt(e.target.value) })}
            placeholder="Quantity"
            className="w-full"
          />
          <Input
            type="text"
            value={product.description || ""}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            placeholder="Description (optional)"
            className="w-full"
          />
          <select
            value={product.category?.id || ""}
            onChange={(e) => {
              const selectedCategory = categories.find((cat) => cat.id === e.target.value);
              setProduct({ ...product, category: selectedCategory });
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <Button onClick={handleSubmit} className="w-full">
            Add Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
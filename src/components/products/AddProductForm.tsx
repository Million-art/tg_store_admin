import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";
import { Product } from "../../interface/product";
import { Category } from "../../interface/category";

interface AddProductFormProps {
  isOpen: boolean; // Add isOpen prop
  onClose: () => void; // Add onClose prop
  onSubmit: (product: Product) => void; // Add onSubmit prop
  categories: Category[]; // Add categories prop
}

export default function AddProductForm({ isOpen, onClose, onSubmit, categories }: AddProductFormProps) {
  const [product, setProduct] = useState<Partial<Product>>({
    name: "",
    image: "",
    price: 0,
    quantity: 0,
    description: "",
    category: undefined, // Initialize category as undefined
  });

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
          <Input
            type="text"
            value={product.image || ""}
            onChange={(e) => setProduct({ ...product, image: e.target.value })}
            placeholder="Image URL"
            className="w-full"
          />
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
              const selectedCategory = categories.find(cat => cat.id === e.target.value);
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
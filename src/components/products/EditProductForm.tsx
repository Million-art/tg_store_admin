import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Product } from "../../interface/product";
import { useState } from "react";

interface EditProductFormProps {
  product: Product;
  onClose: () => void;
  onSubmit: (product: Product) => void;
}

export default function EditProductForm({ product, onClose, onSubmit }: EditProductFormProps) {
  const [editedProduct, setEditedProduct] = useState<Product>(product);
  const [newImage, setNewImage] = useState(""); // Temporary input for adding a new image URL

  // Add a new image to the image array
  const handleAddImage = () => {
    if (newImage.trim() !== "") {
      setEditedProduct((prev) => ({
        ...prev,
        image: [...prev.image, newImage], // Add the new image URL to the array
      }));
      setNewImage(""); // Clear the input field
    }
  };

  // Remove an image from the image array
  const handleRemoveImage = (index: number) => {
    setEditedProduct((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index), // Remove the image at the specified index
    }));
  };

  const handleSubmit = () => {
    onSubmit(editedProduct);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {/* Product Name */}
          <Input
            type="text"
            value={editedProduct.name}
            onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
            placeholder="Product Name"
            className="w-full"
          />

          {/* Image URLs */}
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                type="text"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Add Image URL"
                className="w-full"
              />
              <Button type="button" onClick={handleAddImage}>
                Add Image
              </Button>
            </div>
            <div className="space-y-1">
              {editedProduct.image.map((img, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <span>{img}</span>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveImage(index)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Price */}
          <Input
            type="number"
            value={editedProduct.price}
            onChange={(e) => setEditedProduct({ ...editedProduct, price: parseFloat(e.target.value) })}
            placeholder="Price"
            className="w-full"
          />

          {/* Quantity */}
          <Input
            type="number"
            value={editedProduct.quantity}
            onChange={(e) => setEditedProduct({ ...editedProduct, quantity: parseInt(e.target.value) })}
            placeholder="Quantity"
            className="w-full"
          />

          {/* Description */}
          <Input
            type="text"
            value={editedProduct.description || ""}
            onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
            placeholder="Description (optional)"
            className="w-full"
          />

          {/* Save Changes Button */}
          <Button onClick={handleSubmit} className="w-full">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
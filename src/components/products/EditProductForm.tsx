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
          <Input
            type="text"
            value={editedProduct.name}
            onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
            className="w-full"
          />
          <Input
            type="text"
            value={editedProduct.image}
            onChange={(e) => setEditedProduct({ ...editedProduct, image: e.target.value })}
            placeholder="Image URL"
            className="w-full"
          />
          <Input
            type="number"
            value={editedProduct.price}
            onChange={(e) => setEditedProduct({ ...editedProduct, price: parseFloat(e.target.value) })}
            placeholder="Price"
            className="w-full"
          />
          <Input
            type="number"
            value={editedProduct.quantity}
            onChange={(e) => setEditedProduct({ ...editedProduct, quantity: parseInt(e.target.value) })}
            placeholder="Quantity"
            className="w-full"
          />
          <Input
            type="text"
            value={editedProduct.description || ""}
            onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
            placeholder="Description (optional)"
            className="w-full"
          />
          <Button onClick={handleSubmit} className="w-full">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
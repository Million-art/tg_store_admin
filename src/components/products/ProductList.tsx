import { useState } from "react";
import { Product } from "../../interface/product";
import { Button } from "../ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { Dialog, DialogContent } from "../ui/dialog";  

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);  

  // Filter products based on search term
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open full-screen image view
  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  // Close full-screen image view
  const handleCloseFullScreen = () => {
    setSelectedImage(null);
  };

  return (
    <div className="space-y-4">
      {/* Search Section */}
      <div className="p-4 rounded-lg border">
        <div className="space-y-3">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products by name..."
            className="w-full"
          />
        </div>
      </div>

      {/* Display Filtered Products */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 text-center">No products found.</p>
      ) : (
        filteredProducts.map((product) => (
          <div key={product.id} className="p-4 rounded-lg shadow-sm border">
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{product.name}</h3>

              {/* Display Multiple Images */}
              <div className="flex gap-2 overflow-x-auto">
                {product.image.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-24 h-24 object-cover rounded cursor-pointer hover:opacity-80"
                    onClick={() => handleImageClick(img)} // Open full-screen view on click
                  />
                ))}
              </div>

              <p className="text-sm text-gray-600">Price: ${product.price}</p>
              <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
              {product.description && (
                <p className="text-sm text-gray-600">{product.description}</p>
              )}

              {/* Edit and Delete Buttons */}
              <div className="flex space-x-2">
                <Button
                  variant="secondary"
                  onClick={() => onEdit(product)}
                  className="flex-1"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => onDelete(product.id)}
                  className="flex-1"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Full-Screen Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={handleCloseFullScreen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full-Screen"
              className="max-w-full max-h-full object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
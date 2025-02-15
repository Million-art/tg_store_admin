import { useState } from "react";
import { Product } from "../../interface/product";
import { Button } from "../ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Input } from "../ui/input";

interface ProductListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearchTerm
  });

  return (
    <div className="space-y-4">
      {/* Search and Filter Section */}
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
              <img src={product.image} alt={product.name} className="w-24 h-24 object-cover" />
              <p className="text-sm text-gray-600">Price: ${product.price}</p>
              <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
              {product.description && (
                <p className="text-sm text-gray-600">{product.description}</p>
              )}
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
    </div>
  );
}
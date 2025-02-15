import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  fetchProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../store/slice/productSlice";
import { fetchCategories } from "../store/slice/categoryReducer"; // Import the fetchCategories action
import { Product } from "../interface/product";
import { setShowMessage } from "../store/slice/messageReducer";
import { AppDispatch, RootState } from "../store/store";
import { Loader2, Plus } from "lucide-react";
import ProductList from "../components/products/ProductList";
import AddProductForm from "../components/products/AddProductForm";
import EditProductForm from "../components/products/EditProductForm";
import DeleteConfirmationDialog from "../components/products/DeleteConfirmationDialog";

export default function Products() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: products, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const { categories } = useSelector((state: RootState) => state.category); // Fetch categories from the Redux store

  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories()); // Fetch categories when the component mounts
  }, [dispatch]);

  const handleAddProduct = async (product: Product) => {
    try {
      await dispatch(addProduct(product)).unwrap();
      setIsAddProductOpen(false);
      dispatch(
        setShowMessage({ message: "Product added successfully", color: "green" })
      );
    } catch (error) {
      dispatch(
        setShowMessage({ message: "Failed to add product", color: "red" })
      );
    }
  };

  const handleUpdateProduct = async (product: Product) => {
    try {
      await dispatch(updateProduct({
        id: product.id,
        productData: product,
      })).unwrap();
      setEditingProduct(null);
      dispatch(
        setShowMessage({ message: "Product updated successfully", color: "green" })
      );
    } catch (error) {
      dispatch(
        setShowMessage({ message: "Failed to update product", color: "red" })
      );
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      dispatch(
        setShowMessage({ message: "Product deleted successfully", color: "green" })
      );
    } catch (error) {
      dispatch(
        setShowMessage({ message: "Failed to delete product", color: "red" })
      );
    } finally {
      setProductToDelete(null);
    }
  };

  return (
    <div className="flex flex-col h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products Dashboard</h1>
        <Button onClick={() => setIsAddProductOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <Card className="flex-1 overflow-y-auto">
        <CardContent>
          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : products.length === 0 ? (
            <p className="text-gray-500 text-center">No products found.</p>
          ) : (
            <ProductList
              products={products}
              onEdit={setEditingProduct}
              onDelete={setProductToDelete}
            />
          )}
        </CardContent>
      </Card>

      <AddProductForm
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSubmit={handleAddProduct}
        categories={categories} // Pass categories to the AddProductForm
      />

      {editingProduct && (
        <EditProductForm
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSubmit={handleUpdateProduct}
        />
      )}

      <DeleteConfirmationDialog
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={() => {
          if (productToDelete) {
            handleDeleteProduct(productToDelete);
          }
        }}
      />
    </div>
  );
}
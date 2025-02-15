import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../store/slice/categoryReducer";
import { Category } from "../interface/category";
import { setShowMessage } from "../store/slice/messageReducer";
import { AppDispatch, RootState } from "../store/store";
import { Edit, Loader2, Plus, Save, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"; 
export default function Categories() {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector(
    (state: RootState) => state.category
  );
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);  
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);  

  // Fetch categories on component mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Handle adding a new category
  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        const newCategory: Partial<Category> = {
          name: newCategoryName,
          description: newCategoryDescription,
        };
        await dispatch(createCategory(newCategory)).unwrap();
        setNewCategoryName("");
        setNewCategoryDescription("");
        dispatch(
          setShowMessage({ message: "Category added successfully", color: "green" })
        );
      } catch (error) {
        dispatch(
          setShowMessage({ message: "Failed to add category", color: "red" })
        );
      }
    }
  };

  // Handle updating a category
  const handleUpdateCategory = async () => {
    if (editingCategory && editingCategory.name.trim()) {
      try {
        await dispatch(updateCategory(editingCategory)).unwrap();
        setEditingCategory(null);
        dispatch(
          setShowMessage({ message: "Category updated successfully", color: "green" })
        );
      } catch (error) {
        dispatch(
          setShowMessage({ message: "Failed to update category", color: "red" })
        );
      }
    }
  };

  // Handle deleting a category
  const handleDeleteCategory = async (id: string) => {
    try {
      await dispatch(deleteCategory(id)).unwrap();
      dispatch(
        setShowMessage({ message: "Category deleted successfully", color: "green" })
      );
    } catch (error) {
      dispatch(
        setShowMessage({ message: "Failed to delete category", color: "red" })
      );
    } finally {
      setIsDeleteDialogOpen(false); 
      setCategoryToDelete(null);  
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (id: string) => {
    setCategoryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Card className="w-full overflow-y-auto max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Add Category Section */}
          <div className="p-4 rounded-lg border">
            <div className="space-y-3">
              <Input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="New category name"
                disabled={loading}
                className="w-full"
              />
              <Input
                type="text"
                value={newCategoryDescription}
                onChange={(e) => setNewCategoryDescription(e.target.value)}
                placeholder="Description (optional)"
                disabled={loading}
                className="w-full"
              />
              <Button
                onClick={handleAddCategory}
                disabled={loading || !newCategoryName.trim()}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="mr-2 h-4 w-4" />
                )}
                Add Category
              </Button>
            </div>
          </div>

          {/* Display Categories */}
          {loading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : error ? (
            <p className="text-red-500 text-center">{error}</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-500 text-center">No categories found.</p>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-4 rounded-lg shadow-sm border"
                >
                  {editingCategory && editingCategory.id === category.id ? (
                    <div className="space-y-3">
                      <Input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) =>
                          setEditingCategory({ ...editingCategory, name: e.target.value })
                        }
                        disabled={loading}
                        className="w-full"
                      />
                      <Input
                        type="text"
                        value={editingCategory.description || ""}
                        onChange={(e) =>
                          setEditingCategory({ ...editingCategory, description: e.target.value })
                        }
                        placeholder="Description (optional)"
                        disabled={loading}
                        className="w-full"
                      />
                      <div className="flex space-x-2">
                        <Button
                          onClick={handleUpdateCategory}
                          disabled={loading}
                          className="flex-1"
                        >
                          {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="mr-2 h-4 w-4" />
                          )}
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingCategory(null)}
                          disabled={loading}
                          className="flex-1"
                        >
                          <X className="mr-2 h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-gray-600">{category.description}</p>
                      )}
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setEditingCategory(category)}
                          disabled={loading}
                          className="flex-1"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => openDeleteDialog(category.id)}
                          disabled={loading}
                          className="flex-1"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (categoryToDelete) {
                  handleDeleteCategory(categoryToDelete);
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
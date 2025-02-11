import { useState, useEffect } from "react"
import { addCategory, updateCategory, deleteCategory, getCategories } from "../firebase/firebaseUtils"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { useDispatch } from "react-redux"
import { setShowMessage } from "../store/slice/messageReducer"

interface Category {
  id: string
  name: string
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const dispatch = useDispatch() // Get the dispatch function from Redux

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const fetchedCategories = await getCategories()
      setCategories(fetchedCategories as Category[])
    } catch (error) {
      dispatch(setShowMessage({ message: "Failed to fetch categories", color: "red" }))
    }
  }

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        const newCategoryId = await addCategory(newCategoryName)
        setCategories([...categories, { id: newCategoryId, name: newCategoryName }])
        setNewCategoryName("")
        dispatch(setShowMessage({ message: "Category added successfully", color: "green" }))
      } catch (error) {
        dispatch(setShowMessage({ message: "Failed to add category", color: "red" }))
      }
    }
  }

  const handleUpdateCategory = async () => {
    if (editingCategory && editingCategory.name.trim()) {
      try {
        await updateCategory(editingCategory.id, editingCategory.name)
        setCategories(categories.map((cat) => (cat.id === editingCategory.id ? editingCategory : cat)))
        setEditingCategory(null)
        dispatch(setShowMessage({ message: "Category updated successfully", color: "green" }))
      } catch (error) {
        dispatch(setShowMessage({ message: "Failed to update category", color: "red" }))
      }
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id)
      setCategories(categories.filter((cat) => cat.id !== id))
      dispatch(setShowMessage({ message: "Category deleted successfully", color: "green" }))
    } catch (error) {
      dispatch(setShowMessage({ message: "Failed to delete category", color: "red" }))
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <Input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="New category name"
            />
            <Button onClick={handleAddCategory}>Add</Button>
          </div>
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              {editingCategory && editingCategory.id === category.id ? (
                <>
                  <Input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  />
                  <Button onClick={handleUpdateCategory}>Save</Button>
                  <Button variant="outline" onClick={() => setEditingCategory(null)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-grow">{category.name}</span>
                  <Button variant="outline" onClick={() => setEditingCategory(category)}>
                    Edit
                  </Button>
                  <Button variant="destructive" onClick={() => handleDeleteCategory(category.id)}>
                    Delete
                  </Button>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// redux/categorySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { db } from "../../firebase/firebase";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { Category } from "../../interface/category";

// Define the state type
interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  loading: false,
  error: null,
};

// Thunks for Firebase CRUD operations

// Fetch categories from Firestore
export const fetchCategories = createAsyncThunk<Category[], void, { rejectValue: string }>(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const categoriesCollection = collection(db, "categories");
      const categorySnapshot = await getDocs(categoriesCollection);
      const categoryList = categorySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Category[];
      return categoryList;
    } catch (error) {
      return rejectWithValue("Failed to fetch categories");
    }
  }
);

// Create a new category
export const createCategory = createAsyncThunk<Category, Category, { rejectValue: string }>(
  "categories/create",
  async (category, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "categories"), category);
      return { ...category, id: docRef.id }; // Return the created category with its ID
    } catch (error) {
      return rejectWithValue("Failed to create category");
    }
  }
);

// Update a category
export const updateCategory = createAsyncThunk<
  Category, 
  { id: string; categoryData: Partial<Category> }, 
  { rejectValue: string }  
>(
  "categories/update",
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const categoryDocRef = doc(db, "categories", id);
      await updateDoc(categoryDocRef, categoryData);
      return { id, ...categoryData } as Category;  
    } catch (error) {
      return rejectWithValue("Failed to update category");
    }
  }
);

// Delete a category
export const deleteCategory = createAsyncThunk<string, string, { rejectValue: string }>(
  "categories/delete",
  async (id, { rejectWithValue }) => {
    try {
      const categoryDocRef = doc(db, "categories", id);
      await deleteDoc(categoryDocRef);
      return id; // Return the ID of the deleted category
    } catch (error) {
      return rejectWithValue("Failed to delete category");
    }
  }
);

// Category slice
const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch categories";
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.loading = false;
        state.categories.push(action.payload); // Add the new category to the state
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create category";
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.loading = false;
        const index = state.categories.findIndex((category) => category.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload; // Update the category
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update category";
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.categories = state.categories.filter((category) => category.id !== action.payload); // Remove the category
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete category";
      });
  },
});

export default categorySlice.reducer;

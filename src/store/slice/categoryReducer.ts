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
    } catch (error: any) {
      if (error.code === "network-error") {
        return rejectWithValue("Network error: Please check your internet connection.");
      } else if (error.code === "internal-error") {
        return rejectWithValue("Internal server error: Please try again later.");
      } else {
        return rejectWithValue("Failed to fetch categories.");
      }
    }
  }
);

// Create a new category
export const createCategory = createAsyncThunk<Category, Partial<Category>, { rejectValue: string }>(
  "categories/create",
  async (category, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "categories"), category);
      return { id: docRef.id, ...category } as Category;
    } catch (error: any) {
      if (error.code === "network-error") {
        return rejectWithValue("Network error: Please check your internet connection.");
      } else if (error.code === "internal-error") {
        return rejectWithValue("Internal server error: Please try again later.");
      } else {
        return rejectWithValue("Failed to create category.");
      }
    }
  }
);

// Update a category
export const updateCategory = createAsyncThunk<Category, Category, { rejectValue: string }>(
  "categories/update",
  async (category, { rejectWithValue }) => {
    try {
      const { id, ...categoryData } = category;
      const categoryDocRef = doc(db, "categories", id);
      await updateDoc(categoryDocRef, categoryData);
      return category;
    } catch (error: any) {
      if (error.code === "network-error") {
        return rejectWithValue("Network error: Please check your internet connection.");
      } else if (error.code === "internal-error") {
        return rejectWithValue("Internal server error: Please try again later.");
      } else {
        return rejectWithValue("Failed to update category.");
      }
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
      return id;
    } catch (error: any) {
      if (error.code === "network-error") {
        return rejectWithValue("Network error: Please check your internet connection.");
      } else if (error.code === "internal-error") {
        return rejectWithValue("Internal server error: Please try again later.");
      } else {
        return rejectWithValue("Failed to delete category.");
      }
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
        state.categories.push(action.payload); 
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
          state.categories[index] = action.payload;  
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
        state.categories = state.categories.filter((category) => category.id !== action.payload);  
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete category";
      });
  },
});

export default categorySlice.reducer;

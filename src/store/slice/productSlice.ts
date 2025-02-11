import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // assuming db is initialized properly
import { Product } from "../../interface/product"; // Ensure Product interface is well-defined

// Define state type
interface ProductState {
  items: Product[];
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: ProductState = {
  items: [],
  loading: false,
  error: null,
};

// Fetch all products
export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  "products/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const productsCollection = collection(db, "products");
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Product[];
      return productList;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  }
);

// Add a new product
export const addProduct = createAsyncThunk<Product, Product, { rejectValue: string }>(
  "products/add",
  async (product, { rejectWithValue }) => {
    try {
      const docRef = await addDoc(collection(db, "products"), product);
      return { ...product, id: docRef.id }; // Ensure ID is returned with the product
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to add product");
    }
  }
);

// Update an existing product
export const updateProduct = createAsyncThunk<Product, { id: string; productData: Partial<Product> }, { rejectValue: string }>(
  "products/update",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const productDocRef = doc(db, "products", id);
      await updateDoc(productDocRef, productData);
      return { id, ...productData } as Product; // Return updated product with the same ID
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update product");
    }
  }
);

// Delete a product
export const deleteProduct = createAsyncThunk<string, string, { rejectValue: string }>(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      const productDocRef = doc(db, "products", id);
      await deleteDoc(productDocRef);
      return id; // Return the ID of the deleted product
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete product");
    }
  }
);

// Product slice
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // You can add any non-async reducers here if needed
    resetErrorState: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products";
      })
      // Add product
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.items.push(action.payload); // Append new product to the list
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add product";
      })
      // Update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        // Update the product in the state array
        const index = state.items.findIndex((product) => product.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to update product";
      })
      // Delete product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        // Remove the product by its ID
        state.items = state.items.filter((product) => product.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete product";
      });
  },
});

export const { resetErrorState } = productSlice.actions; 
export default productSlice.reducer;

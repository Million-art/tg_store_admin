import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { User } from '../../interface/user';

// Define the state type for user
export type TUserSlice = {
  items: User[]; // Array of users
  loading: boolean; // Loading state
  error: string | null; // Error state
};

// Initial state
const initialState: TUserSlice = {
  items: [],
  loading: false,
  error: null,
};

// Create the user slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Action to set the list of users
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.items = action.payload;
      state.loading = false; // Data fetched, loading is false
    },
    // Action to delete a user
    deleteUser: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(user => user.uid !== action.payload);
    },
    // Action to set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // Action to set error state
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

// Selector to get the users from the Redux state
export const selectUsers = (state: RootState): User[] => state.user.items;
export const selectUserById = (state: RootState, userId: string): User | undefined =>
  state.user.items.find(user => user.uid === userId);

// Export actions and reducer
export const { setUsers, deleteUser, setLoading, setError } = userSlice.actions;
export default userSlice.reducer;

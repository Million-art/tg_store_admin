import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./slice/userReducer";
import messageReducer from "./slice/messageReducer";
import productReducer from "./slice/productSlice";
import orderReducer from "./slice/orderSlice";
import coinShowReducer from "./slice/coinShowSlice";
import categoryReducer from "./slice/categoryReducer";
export const store = configureStore({
    reducer: {
        user: userReducer,
        message:messageReducer,
        products: productReducer,
        order:orderReducer,
        coinShow:coinShowReducer,
        category: categoryReducer, 



    },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

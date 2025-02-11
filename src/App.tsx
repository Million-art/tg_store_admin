import { Provider } from "react-redux";
import { store } from "./store/store";
import { ThemeProvider } from "next-themes";
import { Routes, Route } from "react-router-dom";

import BottomNav from "./components/BottomNav";
import Home from "./screens/Home";
import Order from "./screens/Order";
import Products from "./screens/Products";
import Users from "./screens/Users";
import Categories from "./screens/Category";
import TopNav from "./components/TopNav";

function App() {
  return (
    <Provider store={store}>
      {/* ThemeProvider from next-themes */}
      <ThemeProvider attribute="class" defaultTheme="system">
        {/* Top Navigation (Header) */}
        <TopNav />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<Order />} />
          <Route path="/products" element={<Products />} />
          <Route path="/category" element={<Categories />} />
          <Route path="/customers" element={<Users />} />
        </Routes>

        {/* Bottom Navigation (Footer) */}
        <BottomNav />
      </ThemeProvider>
    </Provider>
  );
}

export default App;

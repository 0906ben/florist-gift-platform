import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AdminLayout, StoreLayout } from "./components/Layouts";
import { CartProvider } from "./context/CartContext";
import { CartPage } from "./pages/CartPage";
import { CatalogPage } from "./pages/CatalogPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { HomePage } from "./pages/HomePage";
import { OrderSuccessPage } from "./pages/OrderSuccessPage";
import { ProductPage } from "./pages/ProductPage";
import { ProfilesPage } from "./pages/ProfilesPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminOrdersPage } from "./pages/admin/AdminOrdersPage";
import { AdminProductsPage } from "./pages/admin/AdminProductsPage";
import { AdminProfilesPage } from "./pages/admin/AdminProfilesPage";

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Routes>
          <Route element={<StoreLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/profiles" element={<ProfilesPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order/:orderId" element={<OrderSuccessPage />} />
          </Route>

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="profiles" element={<AdminProfilesPage />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}

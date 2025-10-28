import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./services/Guard";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CategoryPage from "./pages/CategoryPage";
import SupplierPage from "./pages/SupplierPage";
import SupplierFormPage from "./pages/SupplierFormPage";
import ProductPage from "./pages/ProductPage";
import ProductFormPage from "./pages/ProductFormPage";
import PurchasePage from "./pages/PurchasePage";
import SalePage from "./pages/SalePage";
import TransactionPage from "./pages/TransactionPage";
import TransactionDetailPage from "./pages/TransactionDetailPage";
import ProfilePage from "./pages/ProfilePage";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/*ADMIN ROUTES*/}
        <Route path="/category" element={<AdminRoute element={<CategoryPage />} />} />
        <Route path="/supplier" element={<AdminRoute element={<SupplierPage />} />} />
        <Route path="/add-supplier" element={<AdminRoute element={<SupplierFormPage />} />} />
        <Route path="/edit-supplier/:supplierId" element={<AdminRoute element={<SupplierFormPage />} />} />
        <Route path="/product" element={<AdminRoute element={<ProductPage />} />} />
        <Route path="/add-product" element={<AdminRoute element={<ProductFormPage />} />} />
        <Route path="/edit-product/:productId" element={<AdminRoute element={<ProductFormPage />} />} />

        {/*PROTECTED ROUTES (ADMIN AND MANAGER)*/}
        <Route path="/purchase" element={<ProtectedRoute element={<PurchasePage />} />} />
        <Route path="/sell" element={<ProtectedRoute element={<SalePage />} />} />
        <Route path="/transaction" element={<ProtectedRoute element={<TransactionPage />} />} />
        <Route path="/transaction/:transactionId" element={<ProtectedRoute element={<TransactionDetailPage />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<ProfilePage />} />} />



      </Routes>
    </Router>
  );
}

export default App;

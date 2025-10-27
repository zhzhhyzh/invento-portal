import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./services/Guard";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CategoryPage from "./pages/CategoryPage";
import SupplierPage from "./pages/SupplierPage";
import SupplierFormPage from "./pages/SupplierFormPage";
import ProductPage from "./pages/ProductPage";
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


      </Routes>
    </Router>
  );
}

export default App;

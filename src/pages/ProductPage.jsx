import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../services/ApiService";
import { useNavigate } from "react-router-dom";
import Pagination from "../component/Pagination";

// Child component for each product
const ProductItem = ({ product, onDelete }) => {
  const [imageSrc, setImageSrc] = useState("https://via.placeholder.com/200");

  useEffect(() => {
    const fetchImage = async () => {
      if (!product.imageUrl) return;

      try {
        // Fetch image as Blob to handle auth-protected endpoints
        const response = await ApiService.getImage(product.imageUrl);
        // If backend returns the image as base64 or blob URL
        setImageSrc(response);
      } catch (e) {
        console.error("Image fetch error", e);
      }
    };

    fetchImage();
  }, [product.imageUrl]);

  return (
    <div className="product-item">
      <img src={imageSrc} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3 className="name">{product.name}</h3>
        <p className="sku">SKU: {product.sku}</p>
        <p className="price">Price: ${product.price}</p>
        <p className="quantity">Quantity: {product.stockQuantity}</p>
      </div>
      <div className="product-actions">
        <button
          className="edit-btn"
          onClick={() => window.location.assign(`/edit-product/${product.id}`)}
        >
          Edit
        </button>
        <button className="delete-btn" onClick={() => onDelete(product.id)}>
          Delete
        </button>
      </div>
    </div>
  );
};

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const itemsPerPage = 20;

  const navigate = useNavigate();

  useEffect(() => {
    const getProducts = async () => {
      try {
        const productData = await ApiService.getAllProducts();

        if (productData.status === 200) {
          const allProducts = productData.products || [];
          setTotalPages(Math.ceil(allProducts.length / itemsPerPage));

          const paginatedProducts = allProducts.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
          );

          setProducts(paginatedProducts);
        }
      } catch (e) {
        console.error("Fetch error:", e);
        const backendMsg =
          e.response?.data?.message || e.message || "Error fetching products.";
        showMessage(backendMsg);
      }
    };

    getProducts();
  }, [currentPage]);

  const deleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await ApiService.deleteProduct(productId);
        showMessage("Product successfully removed");
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      } catch (e) {
        console.error("Delete error:", e);
        const backendMsg =
          e.response?.data?.message || e.message || "Error deleting product.";
        showMessage(backendMsg);
      }
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 4000);
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}

      <div className="product-page">
        <div className="product-header">
          <h1>Products</h1>
          <div className="add-pro">
            <button
              className="add-product-btn"
              onClick={() => navigate("/add-product")}
            >
              Add Product
            </button>
          </div>
        </div>

        {products.length > 0 ? (
          <div className="product-list">
            {products.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                onDelete={deleteProduct}
              />
            ))}
          </div>
        ) : (
          <p>No products found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </Layout>
  );
};

export default ProductPage;

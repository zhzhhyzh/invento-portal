import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../services/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const ProductFormPage = () => {
    const { productId } = useParams();
    const [name, setName] = useState("");
    const [sku, setSku] = useState("");
    const [price, setPrice] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImageFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all categories
        const getCategories = async () => {
            try {
                const data = await ApiService.getAllCategories();
                if (data.status === 200) {
                    setCategories(data.categories);
                }
            } catch (e) {
                console.error("Category fetch error:", e);
                const backendMsg =
                    e.response?.data?.message || e.message || "Error fetching categories.";
                showMessage(backendMsg);
            }
        };



        // Fetch product details if editing
        const getProductById = async () => {
            if (productId) {
                setIsEditing(true);
                try {
                    const productData = await ApiService.getProductById(productId);

                    if (productData.status === 200) {
                        const p = productData.product;
                        setName(p.name);
                        setSku(p.sku);
                        setPrice(p.price);
                        setStockQuantity(p.stockQuantity);
                        setCategoryId(p.categoryId);
                        setDescription(p.description);
                        setImageFile(p.imageUrl)
                        // setImageUrl(`${ApiService.BASE_URL}/images/${encodeURIComponent(p.imageUrl)}`);
                        const imageBlob = await ApiService.getImage(p.imageUrl);
                        setImageUrl(imageBlob);
                        // setImageUrl(imageUrl);

                    } else {
                        showMessage(productData.message);
                    }
                } catch (e) {
                    console.error("Product fetch error:", e);
                    const backendMsg =
                        e.response?.data?.message || e.message || "Error fetching product.";
                    showMessage(backendMsg);
                }
            }
        };

        getCategories();
        getProductById();
    }, [productId]);

    const handleImgFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImageUrl(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("productId", productId);

        formData.append("name", name);
        formData.append("sku", sku);
        formData.append("price", price);
        formData.append("stockQuantity", stockQuantity);
        formData.append("description", description);
        formData.append("categoryId", categoryId);
        if (image instanceof File) {
            formData.append("image", image);
        }


        try {
            if (isEditing) {

                await ApiService.updateProduct(formData);
                showMessage("Product updated successfully");
            } else {
                await ApiService.addProduct(formData);
                showMessage("Product added successfully");
            }
            navigate("/product");
        } catch (e) {
            console.error("Product submit error:", e);
            const backendMsg =
                e.response?.data?.message || e.message || "Error adding/updating product.";
            showMessage(backendMsg);
        }
    };

    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 4000);
    };

    return (
        <Layout>
            {message && <div className="message">{message}</div>}

            <div className="product-form-page">

                      <div className="page-header">
                <h1>{isEditing ? "Edit Product" : "Add Product"}</h1>

  <div className="back-button-container">
    <button className="back-button" onClick={() => navigate(-1)}>
      ← Back
    </button>
  </div>
</div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Product Name</label>
                        <input
                            type="text"
                            value={name}
                            placeholder="Product Name"
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>SKU</label>
                        <input
                            type="text"
                            value={sku}
                            placeholder="SKU"
                            onChange={(e) => setSku(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Stock Quantity</label>
                        <input
                            type="number"
                            value={stockQuantity}
                            placeholder="Stock Quantity"
                            onChange={(e) => setStockQuantity(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Price</label>
                        <input
                            type="number"
                            value={price}
                            placeholder="Price"
                            onChange={(e) => setPrice(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            value={description}
                            placeholder="Description"
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            required
                        >
                            <option value="">Select a category</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Product Image</label>
                        <input type="file" onChange={handleImgFile} />
                        {imageUrl && (
                            <img src={imageUrl} alt="Preview" className="image-preview" />
                        )}
                    </div>

                    <button type="submit">{isEditing ? "Update Product" : "Add Product"}</button>
                </form>
            </div>
        </Layout>
    );
};

export default ProductFormPage;

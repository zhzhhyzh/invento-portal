import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../services/ApiService";

const PurchasePage = () => {
    const [products, setProducts] = useState([]);
    const [suppliers, setSupplier] = useState([]);
    const [productId, setProductId] = useState("");
    const [supplierId, setSupplierId] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState("");
    const [note, setNote] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProdandSup = async () => {
            try {
                const productData = await ApiService.getAllProducts();
                const supplierData = await ApiService.getAllSuppliers();
                setProducts(productData.products);
                setSupplier(supplierData.suppliers);
            } catch (e) {
                console.error("Product and Supplier fetch error:", e);
                const backendMsg =
                    e.response?.data?.message || e.message || "Error fetching product and supplier.";
                showMessage(backendMsg);
            }
        }

        fetchProdandSup();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productId || !supplierId || !quantity) {
            showMessage("Please fill in all required fields")

        }
        const body = {
            productId,
            quantity: parseInt(quantity),
            supplierId,
            description,
            note
        };

        try {
            await ApiService.purchase(body)
            showMessage("Product purchased successfully");
            resetForm();

        } catch (e) {
            console.error("Product purchasing error:", e);
            const backendMsg =
                e.response?.data?.message || e.message || "Error purchasing product.";
            showMessage(backendMsg);
        }
    }

    const resetForm = () => {
        setProductId("");
        setSupplierId("");
        setDescription("");
        setNote("");
        setQuantity("");

    }
    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 4000);
    };

    return (

        <Layout>
            {message && <div className="message">{message}</div>}

            <div className="purchase-form-page">
                <h1>Receive Inventory</h1>
                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label>Select Product</label>
                        <select
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            required
                        >
                            <option value="">Select a product</option>
                            {products.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Select Supplier</label>
                        <select
                            value={supplierId}
                            onChange={(e) => setSupplierId(e.target.value)}
                            required
                        >
                            <option value="">Select a supplier</option>
                            {suppliers.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
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
                        <label>Note</label>
                        <textarea
                            value={note}
                            placeholder="Note"
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>



                    <div className="form-group">
                        <label>Quantity</label>
                        <input
                            type="number"
                            value={quantity}
                            placeholder="Quantity"
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </div>



                    <button type="submit">Purchase Product</button>
                </form>
            </div>
        </Layout>
    )
}

export default PurchasePage;
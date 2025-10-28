import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../services/ApiService";

const SalePage = () => {
    const [products, setProducts] = useState([]);
    const [productId, setProductId] = useState("");
    const [description, setDescription] = useState("");
    const [quantity, setQuantity] = useState("");
    const [note, setNote] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchProd = async () => {
            try {
                const productData = await ApiService.getAllProducts();
                setProducts(productData.products);
            } catch (e) {
                console.error("Product fetch error:", e);
                const backendMsg =
                    e.response?.data?.message || e.message || "Error fetching product.";
                showMessage(backendMsg);
            }
        }

        fetchProd();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productId || !quantity) {
            showMessage("Please fill in all required fields")

        }
        const body = {
            productId,
            quantity: parseInt(quantity),
            description,
            note
        };

        try {
            await ApiService.sell(body)
            showMessage("Product sold successfully");
            resetForm();

        } catch (e) {
            console.error("Product selling error:", e);
            const backendMsg =
                e.response?.data?.message || e.message || "Error selling product.";
            showMessage(backendMsg);
        }
    }

    const resetForm = () => {
        setProductId("");
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

            <div className="sale-form-page">
                <h1>Sell Product</h1>
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
                        <label>Quantity</label>
                        <input
                            type="number"
                            value={quantity}
                            placeholder="Quantity"
                            onChange={(e) => setQuantity(e.target.value)}
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
                        <label>Note</label>
                        <textarea
                            value={note}
                            placeholder="Note"
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>




                    <button type="submit">Sell Product</button>
                </form>
            </div>
        </Layout>
    )
}

export default SalePage;
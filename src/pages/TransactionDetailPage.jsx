import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../services/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const TransactionDetailPage = () => {
    const { transactionId } = useParams();
    const [transaction, setTransaction] = useState(null);
    const [message, setMessage] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [status, setStatus] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        const getTransactions = async () => {
            try {
                const transactionData = await ApiService.getTransactionById(transactionId);

                if (transactionData.status === 200) {


                    setTransaction(transactionData.transaction);
                    setStatus(transactionData.transaction.status);
                    const imageBlob = await ApiService.getImage(transactionData.transaction.product.imageUrl);
                    setImageUrl(imageBlob);
                }
            } catch (e) {
                console.error("Fetch error:", e);
                const backendMsg =
                    e.response?.data?.message || e.message || "Error fetching transaction.";
                showMessage(backendMsg);
            }
        };

        getTransactions();
    }, [transactionId]);

    //Update transaction status
    const handleUpdateStatus = async () => {
        try {
            await ApiService.updateTransaction(transactionId, status);
            navigate("/transaction")
        } catch (e) {
            console.error("update error:", e);
            const backendMsg =
                e.response?.data?.message || e.message || "Error update transaction status.";
            showMessage(backendMsg);
        };
    }

    //Method to show message
    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("")
        }, 4000);
    }

    return (
        <Layout>
            {message && <div className="message">{message}</div>}

            <div className="transaction-details-page">
                <div className="back-button-container">
                    <button className="back-button" onClick={() => navigate(-1)}>
                        ← Back
                    </button>
                </div>
                {transaction && (
                    <>
                        <div className="section-card">
                            <h2>Transaction Information</h2>
                            <p>Type: {transaction.transactionType}</p>
                            <p>Status: {transaction.status}</p>
                            <p>Description: {transaction.description}</p>
                            <p>Note: {transaction.note}</p>
                            <p>Total Products: {transaction.totalProducts}</p>
                            <p>Total Price: {transaction.totalPrice.toFixed(2)}</p>
                            <p>Created At: {new Date(transaction.createdAt).toLocaleDateString()}</p>

                            {transaction.updatedAt && (
                                <p>Updated At: {new Date(transaction.updatedAt).toLocaleDateString()}</p>

                            )}

                        </div>
                        <div className="section-card">
                            <h2>Product Information</h2>
                            <p>Name: {transaction.product.name}</p>
                            <p>SKU: {transaction.product.sku}</p>
                            <p>Price: {transaction.product.price.toFixed(2)}</p>

                            <p>Stock Quantity: {transaction.product.stockQuantity}</p>
                            <p>Description {transaction.product.description}</p>


                            {imageUrl && (
                                <img src={imageUrl} alt="Preview" className="image-preview" />
                            )}

                        </div>

                        <div className="section-card">
                            <h2>User Information</h2>
                            <p>Name: {transaction.user.name}</p>
                            <p>Email: {transaction.user.email}</p>
                            <p>Phone Number: {transaction.user.phoneNumber}</p>
                            <p>Role: {transaction.user.role}</p>
                            <p>Created At: {new Date(transaction.createdAt).toLocaleDateString()}</p>

                        </div>

                        {transaction.suppliers && (
                            <div className="section-card">
                                <h2>Supplier Information</h2>
                                <p>Name: {transaction.supplier.name}</p>
                                <p>Contact Info: {transaction.supplier.contactInfo}</p>
                                <p>Address: {transaction.supplier.address}</p>

                            </div>
                        )}

                        <div className="section-card transaction-status-update">
                            <label>
                                Status:
                            </label>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option value="PENDING">PENDING</option>
                                <option value="PROCESSING">PROCESSING</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </select>

                            <button onClick={() => { handleUpdateStatus() }}>Update Status</button>

                        </div>

                    </>
                )}
            </div>
        </Layout >
    )
}

export default TransactionDetailPage;
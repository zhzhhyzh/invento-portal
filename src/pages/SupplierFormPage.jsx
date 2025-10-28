import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../services/ApiService";
import { useNavigate, useParams } from "react-router-dom";

const SupplierFormPage = () => {
    const { supplierId } = useParams("");
    const [name, setName] = useState("");
    const [contactInfo, setContactInfo] = useState("");
    const [address, setAddress] = useState("");
    const [message, setMessage] = useState("");
    const [isEditing, setIdEditing] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (supplierId) {
            setIdEditing(true)

            const fetchSupplier = async () => {
                try {
                    const supplierData = await ApiService.getSupplierById(supplierId);
                    if (supplierData.status === 200) {
                        setName(supplierData.supplier.name);
                        setContactInfo(supplierData.supplier.contactInfo);
                        setAddress(supplierData.supplier.address);
                    }
                } catch (e) {
                    console.error("Login error:", e);

                    // Handle network or server errors
                    const backendMsg =
                        e.response?.data?.message ||
                        e.message ||
                        "Error Supplier Deletion.";
                    showMessage(backendMsg);
                }
            }
            fetchSupplier();

        }
    }, [supplierId])


    //handle form submission for both add and edit supplier
    const handleSubmit = async (e) => {
        e.preventDefault();
        const supplierData = { name, contactInfo, address };

        try {
            if (isEditing) {
                await ApiService.updateSupplier(supplierId, supplierData)
                showMessage("Supplier updated Successfully")
                navigate("/supplier")
            } else {
                await ApiService.addSupplier(supplierData);
                showMessage("Supplier added Successfully")
                navigate("/supplier")


            }

        } catch (e) {
            console.error("Login error:", e);

            // Handle network or server errors
            const backendMsg =
                e.response?.data?.message ||
                e.message ||
                "Error Supplier Add-Update.";
            showMessage(backendMsg);
        }
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

            <div className="supplier-form-page">
                <div className="page-header">
                    <h1>{isEditing ? "Edit Supplier" : "Add Supplier"}</h1>

                    <div className="back-button-container">
                        <button className="back-button" onClick={() => navigate(-1)}>
                            ← Back
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Supplier Name</label>
                        <input type="text"
                            value={name}
                            placeholder="Supplier Name"
                            onChange={(e) => setName(e.target.value)}
                            required />
                    </div>

                    <div className="form-group">
                        <label>Contact Info</label>
                        <input type="text"
                            value={contactInfo}
                            placeholder="Contact Info"
                            onChange={(e) => setContactInfo(e.target.value)}
                            required />
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <input type="text"
                            value={address}
                            placeholder="Address"
                            onChange={(e) => setAddress(e.target.value)}
                            required />
                    </div>
                    <button type="submit">{isEditing ? "Edit Supplier" : "Add Supplier"}</button>
                </form>
            </div>
        </Layout>
    )


}





export default SupplierFormPage;
import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../services/ApiService";
import { useNavigate } from "react-router-dom";

const SupplierPage = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    //Fetch suppliers from the backend
    useEffect(() => {
        const getSuppliers = async () => {
            try {
                const data = await ApiService.getAllSuppliers();
                if (data.status == 200) {
                    setSuppliers(data.suppliers)
                } else {
                    showMessage(data.message);
                }
            } catch (e) {
                console.error("Login error:", e);

                // Handle network or server errors
                const backendMsg =
                    e.response?.data?.message ||
                    e.message ||
                    "Error Supplier Fetching.";
                showMessage(backendMsg);
            }
        }

        getSuppliers();
    }, []);

    // //Populating the edit supplier data
    // const handleEditSupplier = (supplier) => {
    //     setIsEditing(true)
    //     setEditingSupplierId(supplier.id)
    //     setSupplierName(supplier.name);
    // }

    //delete supplier
    const deleteSupplier = async (supplierId) => {
        if (window.confirm("Are you sure you want to delete this supplier")) {
            try {
                await ApiService.deleteSupplier(supplierId);
                showMessage("Supplier successfully removed");
                window.location.reload(); //reload page
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
    }

    //Navigate to add-edit page
    const navFormPage = (supplierId) => {
        navigate(`/edit-supplier/${supplierId}`)
    }

    //Method to show message
    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("")
        }, 4000);


    }

    // //add supplier
    // const addSupplier = async () => {
    //     if (!supplierName) {
    //         showMessage("Supplier name can't be empty")
    //         return;
    //     }

    //     try {
    //         await ApiService.addSupplier({ name: supplierName })
    //         showMessage("Supplier successfully added");
    //         setSupplierName("")//Clear input
    //         window.location.reload(); //reload page
    //     } catch (e) {
    //         console.error("Login error:", e);

    //         // Handle network or server errors
    //         const backendMsg =
    //             e.response?.data?.message ||
    //             e.message ||
    //             "Error Supplier Creation.";
    //         showMessage(backendMsg);
    //     }
    // }

    // //Edit supplier
    // const editSupplier = async () => {


    //     try {
    //         await ApiService.updateSupplier(editingSupplierId, { name: supplierName });
    //         showMessage("Supplier successfully edited");
    //         setIsEditing(false);
    //         setSupplierName("")//Clear input
    //         window.location.reload(); //reload page
    //     } catch (e) {
    //         console.error("Login error:", e);

    //         // Handle network or server errors
    //         const backendMsg =
    //             e.response?.data?.message ||
    //             e.message ||
    //             "Error Supplier Updates.";
    //         showMessage(backendMsg);
    //     }
    // }

    return (
        <Layout>
            {message && <div className="message">{message}</div>}

            <div className="supplier-page">
                <div className="supplier-header">
                    <h1>
                        Suppliers
                    </h1>

                    <div className="add-sup">
                        <button onClick={() => {
                            navigate("/add-supplier")
                        }}>
                            Add Supplier
                        </button>
                    </div>
                </div>

                {suppliers &&
                    <ul>
                         <li className="supplier-table-header" >
                                <span>Name</span>
                                <span>Contact Info</span>
                                <span>Address</span>
                                <span>Action</span>
                                
                            </li>
                        {suppliers.map((supplier) => (
                            <li className="supplier-item" key={supplier.id}>
                                <span>{supplier.name}</span>
                                <span>{supplier.contactInfo}</span>
                                <span>{supplier.address}</span>
                                <div className="supplier-actions">
                                    <button onClick={() => navFormPage(supplier.id)}>Edit</button>
                                    <button onClick={() => deleteSupplier(supplier.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>

                }
            </div>
        </Layout>


    )


}

export default SupplierPage;
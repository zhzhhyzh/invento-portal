import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../services/ApiService";

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    //Fetch categories from the backend

    useEffect(() => {
        const getCategories = async () => {
            try {
                const data = await ApiService.getAllCategories();
                if (data.status == 200) {
                    setCategories(data.categories)
                }
            } catch (e) {
                console.error("Login error:", e);

                // Handle network or server errors
                const backendMsg =
                    e.response?.data?.message ||
                    e.message ||
                    "Error Category Fetching.";
                showMessage(backendMsg);
            }
        }

        getCategories();
    }, []);


    //add category
    const addCategory = async () => {
        if (!categoryName) {
            showMessage("Category name can't be empty")
            return;
        }

        try {
            await ApiService.addCategory({ name: categoryName })
            showMessage("Category successfully added");
            setCategoryName("")//Clear input
            window.location.reload(); //reload page
        } catch (e) {
            console.error("Login error:", e);

            // Handle network or server errors
            const backendMsg =
                e.response?.data?.message ||
                e.message ||
                "Error Category Creation.";
            showMessage(backendMsg);
        }
    }

    //Edit category
    const editCategory = async () => {


        try {
            await ApiService.updateCategory(editingCategoryId, { name: categoryName });
            showMessage("Category successfully edited");
            setIsEditing(false);
            setCategoryName("")//Clear input
            window.location.reload(); //reload page
        } catch (e) {
            console.error("Login error:", e);

            // Handle network or server errors
            const backendMsg =
                e.response?.data?.message ||
                e.message ||
                "Error Category Updates.";
            showMessage(backendMsg);
        }
    }

    //Populating the edit category data
    const handleEditCategory = (category) => {
        setIsEditing(true)
        setEditingCategoryId(category.id)
        setCategoryName(category.name);
    }

    //delete category
    const deleteCategory = async (categoryId) => {
        if (window.confirm("Are you sure you want to delete this category")) {
            try {
                await ApiService.deleteCategory(categoryId);
                showMessage("Category successfully removed");
                window.location.reload(); //reload page
            } catch (e) {
                console.error("Delete error:", e);

                // Handle network or server errors
                const backendMsg =
                    e.response?.data?.message ||
                    e.message ||
                    "Error Category Deletion.";
                showMessage(backendMsg);
            }
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

            <div className="category-page">
                <div className="category-header">
                    <h1>
                        Categories
                    </h1>

                    <div className="add-cat">
                        <input
                            type="text"
                            placeholder="Category Name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)} />
                        {!isEditing ? (
                            <button type="button" onClick={addCategory}>Add Category</button>
                        ) : (
                            <button type="button" onClick={editCategory}>Edit Category</button>
                        )}

                    </div>
                </div>

                {categories &&
                    <ul>
                        {categories.map((category) => (
                            <li className="category-item" key={category.id}>
                                <span>{category.name}</span>
                                <div className="category-actions">
                                    <button onClick={() => handleEditCategory(category)}>Edit</button>
                                    <button onClick={() => deleteCategory(category.id)}>Delete</button>
                                </div>
                            </li>
                        ))}
                    </ul>

                }
            </div>
        </Layout>


    )


}

export default CategoryPage;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";
import "../index.css";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

   const handleRegister = async (e) => {
    e.preventDefault();
    try {
        const registerData = { name, email, password, phoneNumber };
        const response = await ApiService.registerUser(registerData);

        // Log full response for debugging
        console.log("Register response:", response);

        // Some backends return data in different shapes; handle both
        const data = response.data || response;

        // If backend sent a status=400 or an error message, show it
        if (data.status === 400 || data.message?.toLowerCase().includes("exists")) {
            showMessage(data.message || "Registration failed.");
            return;
        }

        // ✅ Success case
        showMessage("Registration successful!");
        setTimeout(() => navigate("/login"), 1200);

    } catch (e) {
        console.error("Registration error:", e);

        // Handle network or server errors
        const backendMsg =
            e.response?.data?.message ||
            e.message ||
            "Error registering user.";
        showMessage(backendMsg);
    }
};


    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => {
            setMessage("")
        }, 4000);


    }

    return (
        <div className="auth-container">
            <h2>Register</h2>
            {message && <p className="message">
                {message}
            </p>}
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    name=""
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required />

                <input
                    type="text"
                    name=""
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required />

                <input
                    type="text"
                    name=""
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required />

                <input
                    type="text"
                    name=""
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required />

                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <a href="/login">Login</a></p>
        </div>
    )
}

export default RegisterPage
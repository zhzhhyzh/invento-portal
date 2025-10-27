import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";
import "../index.css";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const loginData = { email, password };
            const response = await ApiService.loginUser(loginData);

            // Log full response for debugging
            console.log("Login response:", response);

            // Some backends return data in different shapes; handle both
            const data = response.data || response;

            // If backend sent a status=400 or an error message, show it
            if (data.status === 400 || data.message?.toLowerCase().includes("exists")) {
                showMessage(data.message || "Login failed.");
                return;
            }

            if (response.status === 200) {
                ApiService.saveToken(response.token)
                ApiService.saveRole(response.role)
                setMessage(response.message)
                navigate("/dashboard")
            }
            // ✅ Success case
            showMessage("Login successful!");
            setTimeout(() => navigate("/dashboard"), 1200);

        } catch (e) {
            console.error("Login error:", e);

            // Handle network or server errors
            const backendMsg =
                e.response?.data?.message ||
                e.message ||
                "Error login user.";
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
            <h2>Login</h2>
            {message && <p className="message">
                {message}
            </p>}
            <form onSubmit={handleLogin}>
            

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


                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="/register">Login</a></p>
        </div>
    )
}

export default LoginPage
import React from "react";
import "../index.css";
import { Link, useLocation } from "react-router-dom";
import ApiService from "../services/ApiService";

const logout = () => {
    ApiService.logout();
}

const SideBar = () => {
    const isAuth = ApiService.isAuthenticated();
    const isAdmin = ApiService.isAdmin();

    const location = useLocation(); // Get current path

    const navItems = [
        { path: "/dashboard", label: "Dashboard", auth: true },
        { path: "/transaction", label: "Transactions", auth: true },
        { path: "/category", label: "Category", auth: isAdmin },
        { path: "/product", label: "Product", auth: isAdmin },
        { path: "/supplier", label: "Supplier", auth: isAdmin },
        { path: "/purchase", label: "Purchase", auth: true },
        { path: "/sell", label: "Sell", auth: true },
        { path: "/profile", label: "Profile", auth: true },
        { path: "/login", label: "Logout", auth: true, onClick: logout }
    ];

    return (
        <div className="sidebar">
            <h1 className="ims">Invento</h1>
            <ul className="nav-links">
                {navItems.map(
                    (item) =>
                        item.auth && (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    onClick={item.onClick}
                                    className={location.pathname === item.path ? "active" : ""}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        )
                )}
            </ul>
        </div>
    );
};

export default SideBar;

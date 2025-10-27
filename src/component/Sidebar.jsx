import React from "react";
import "../index.css";
import { Link } from "react-router-dom";
import ApiService from "../services/ApiService";

const logout = () => {
    ApiService.logout();
}

const SideBar = () => {
    const isAuth = ApiService.isAuthenticated();

    const isAdmin = ApiService.isAdmin();

    return (
        <div className="sidebar">
            <h1 className="ims">Invento</h1>
            <ul className="nav-links">
                {isAuth &&
                    <li>
                        <Link to="/dashboard">Dashboard</Link>
                    </li>
                }

                {isAuth &&
                    <li>
                        <Link to="/transaction">Transactions</Link>
                    </li>
                }

                {isAdmin &&
                    <li>
                        <Link to="/category">Category</Link>
                    </li>
                }

                {isAdmin &&
                    <li>
                        <Link to="/product">Product</Link>
                    </li>
                }

                {isAdmin &&
                    <li>
                        <Link to="/supplier">Supplier</Link>
                    </li>
                }

                {isAuth &&
                    <li>
                        <Link to="/purchase">Purchase</Link>
                    </li>
                }

                {isAuth &&
                    <li>
                        <Link to="/sell">Sell</Link>
                    </li>
                }

                {isAuth &&
                    <li>
                        <Link to="/profile">Profile</Link>
                    </li>
                }

                {isAuth &&
                    <li>
                        <Link onClick={logout} to="/login">Logout</Link>
                    </li>
                }


            </ul>
        </div>
    );
};

export default Sidebar;
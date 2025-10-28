import React, { useEffect, useState } from "react";
import Layout from "../component/Layout";
import ApiService from "../services/ApiService";

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetctUser = async () => {
            try {
                const userInfo = await ApiService.getLoggedInUserInfo();
                setUser(userInfo);
            } catch (e) {
                console.error("User fetch error:", e);
                const backendMsg =
                    e.response?.data?.message || e.message || "Error fetching user.";
                showMessage(backendMsg);
            }
        }
        fetctUser();
    }, [])


    const showMessage = (msg) => {
        setMessage(msg);
        setTimeout(() => setMessage(""), 4000);
    };
    return (
        <Layout>
            {message && <div className="message">{message}</div>}

           <div className="profile-page">
  {user && (
    <div className="profile-card">
      <div className="profile-avatar">
        {user.name ? user.name.charAt(0) : "?"}
      </div>
      <h1>Hello, {user.name} 👋</h1>

      <div className="profile-details">
        <div className="profile-item">
          <label>Name</label>
          <span>{user.name}</span>
        </div>
        <div className="profile-item">
          <label>Email</label>
          <span>{user.email}</span>
        </div>
        <div className="profile-item">
          <label>Phone Number</label>
          <span>{user.phoneNumber}</span>
        </div>
        <div className="profile-item">
          <label>Role</label>
          <span>{user.role}</span>
        </div>
      </div>
    </div>
  )}
</div>

        </Layout>
    )
}

export default ProfilePage;
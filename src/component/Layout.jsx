import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import "../index.css";

const Layout = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">{children}</div>

      {/* Floating Theme Button */}
      <button className="theme-toggle-btn" onClick={toggleTheme}>
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
    </div>
  );
};

export default Layout;

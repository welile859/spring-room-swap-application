
import React from "react";
import {
    FiHome,
    FiPlusSquare,
    FiMessageSquare,
    FiUser,
    FiLogIn,
    FiUserPlus
} from "react-icons/fi";

import { useNavigate, useLocation } from "react-router-dom";

function PublicSidebar() {

    const navigate = useNavigate();
    const location = useLocation();

    const isHome = location.pathname === "/home";

    return (
        <aside className="sidebar">

            <nav className="sidebar-nav">

                <button
                    className={`sidebar-item ${isHome ? "active" : ""}`}
                    onClick={() => navigate("/home")}
                >
                    <FiHome />
                    <span>Home</span>
                </button>

                <button
                    className="sidebar-item"
                    onClick={() => navigate("/login")}
                >
                    <FiPlusSquare />
                    <span>Post a Room</span>
                </button>

                <button
                    className="sidebar-item"
                    onClick={() => navigate("/login")}
                >
                    <FiMessageSquare />
                    <span>Messages</span>
                </button>

                <button
                    className="sidebar-item"
                    onClick={() => navigate("/login")}
                >
                    <FiUser />
                    <span>Profile</span>
                </button>

            </nav>

            <div className="sidebar-auth">

                <button
                    className={`sidebar-item ${location.pathname === "/login" ? "active" : ""}`}
                    onClick={() => navigate("/login")}
                >
                    <FiLogIn />
                    <span>Login</span>
                </button>

                <button
                    className={`sidebar-item ${location.pathname === "/register" ? "active" : ""}`}
                    onClick={() => navigate("/register")}
                >
                    <FiUserPlus />
                    <span>Register</span>
                </button>

            </div>

        </aside>
    );
}

export default PublicSidebar;

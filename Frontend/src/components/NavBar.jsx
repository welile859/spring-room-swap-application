
import React, { useEffect, useState } from "react";
import {
    FiSearch,
    FiBell,
    FiUser,
} from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

function Navbar() {

    const navigate = useNavigate();
    const location = useLocation();

    const [unreadCount, setUnreadCount] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        setSearchTerm(params.get("search") || "");
    }, [location.search]);

    const handleSearch = (e) => {
        const value = e.target.value;

        setSearchTerm(value);

        navigate(
            `/home${value ? `?search=${encodeURIComponent(value)}` : ""}`,
            { replace: true }
        );
    };

    useEffect(() => {

        let isMounted = true;

        const fetchUnreadCount = async () => {

            try {

                const response = await api.get("/chat/unread-count");

                if (isMounted) {
                    setUnreadCount(response.data);
                }

            } catch (error) {

                console.error(
                    "Error retrieving unread message count:",
                    error
                );

            }
        };

        fetchUnreadCount();

        const interval = setInterval(fetchUnreadCount, 5000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };

    }, []);

    return (
        <header className="navbar">

            <div className="navbar-left">
                <img
                    src="/U-dubswap.jfif"
                    alt="RoomSwap Logo"
                    className="logo"
                />
            </div>

            <div className="navbar-search">

                <FiSearch />

                <input
                    type="text"
                    placeholder="Search rooms by name..."
                    value={searchTerm}
                    onChange={handleSearch}
                />

            </div>

            <div className="navbar-right">

                <button
                    className="icon-button notification-button"
                    onClick={() => navigate("/messages")}
                    aria-label={`Notifications: ${unreadCount} unread conversations`}
                    title="Unread messages"
                >
                    <FiBell />

                    {unreadCount > 0 && (
                        <span className="notification-badge">
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}

                </button>

                <button
                    className="profile-button"
                    onClick={() => navigate("/profile")}
                    aria-label="Profile"
                >
                    <FiUser />
                </button>

            </div>

        </header>
    );
}

export default Navbar;


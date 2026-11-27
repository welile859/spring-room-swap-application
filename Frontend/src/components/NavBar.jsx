
import React, { useEffect, useState } from "react";
import {
    FiSearch,
    FiBell,
    FiUser,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Navbar() {

    const navigate = useNavigate();

    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {

        let isMounted = true;

        // Retrieve unread conversation count
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

        // Fetch immediately
        fetchUnreadCount();

        // Check for new unread conversations every 5 seconds
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
                    placeholder="Search rooms, areas, or universities..."
                />
            </div>

            <div className="navbar-right">

                {/* Notification Bell */}
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

                {/* Profile Button */}
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

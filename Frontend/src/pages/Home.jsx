
import React, { useState, useEffect } from "react";

import {
    FiHome,
    FiPlusSquare,
    FiMessageSquare,
    FiUser,
    FiLogOut
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import RoomCard from "../components/RoomCard";
import { logoutUser } from "../services/api";

function Home() {
    const [selectedGender, setSelectedGender] = useState("All");

    const [rooms, setRooms] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    // Fetch the logged-in user and room listings.
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userResponse, roomsResponse] = await Promise.all([
                    fetch("http://localhost:8080/api/auth/me", {
                        credentials: "include"
                    }),

                    fetch("http://localhost:8080/api/rooms", {
                        credentials: "include"
                    })
                ]);

                if (!userResponse.ok) {
                    throw new Error("Failed to retrieve current user.");
                }

                if (!roomsResponse.ok) {
                    throw new Error("Failed to retrieve room listings.");
                }

                const userData = await userResponse.json();
                const roomsData = await roomsResponse.json();

                setCurrentUserId(Number(userData.userId));
                setRooms(roomsData);

            } catch (error) {
                console.error("Error loading home page:", error);
                setError(error.message);

            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Handle logout.
    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate("/login");

        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Only show rooms belonging to other users.
    const otherUsersRooms = rooms.filter(
        room => Number(room.ownerId) !== currentUserId
    );

    // Filter other users' rooms according to gender preference.
    const filteredRooms =
        selectedGender === "All"
            ? otherUsersRooms
            : otherUsersRooms.filter(
                room => room.genderPreference === selectedGender
            );

    return (
        <div className="app">

            <Navbar />

            <div className="layout">

                {/* Sidebar */}
                <aside className="sidebar">

                    <nav className="sidebar-nav">

                        <button className="sidebar-item active">
                            <FiHome />
                            <span>Home</span>
                        </button>

                        <button
                            className="sidebar-item"
                            onClick={() => navigate("/post-room")}
                        >
                            <FiPlusSquare />
                            <span>Post a Room</span>
                        </button>

                        <button
                            className="sidebar-item"
                            onClick={() => navigate("/messages")}
                        >
                            <FiMessageSquare />
                            <span>Messages</span>
                        </button>

                        <button
                            className="sidebar-item"
                            onClick={() => navigate("/profile")}
                        >
                            <FiUser />
                            <span>Profile</span>
                        </button>

                    </nav>

                    <button
                        className="sidebar-item logout"
                        onClick={handleLogout}
                    >
                        <FiLogOut />
                        <span>Logout</span>
                    </button>

                </aside>

                {/* Main Content */}
                <main className="main-content">

                    <div className="page-header">
                        <h1>Available Rooms</h1>
                    </div>

                    {/* Filters */}
                    <div className="room-controls">

                        <div className="gender-filters">

                            {["All", "Male", "Female", "Any"].map(gender => (

                                <button
                                    key={gender}
                                    className={
                                        selectedGender === gender
                                            ? "filter-button selected"
                                            : "filter-button"
                                    }
                                    onClick={() => setSelectedGender(gender)}
                                >
                                    {gender}
                                </button>

                            ))}

                        </div>

                        <select className="sort-select">
                            <option>Sort by: Newest</option>
                        </select>

                    </div>

                    {/* Room Grid */}
                    <div className="room-grid">

                        {loading && (
                            <p>Loading room listings...</p>
                        )}

                        {!loading && error && (
                            <p>{error}</p>
                        )}

                        {!loading && !error && filteredRooms.length === 0 && (
                            <p>No rooms from other users are currently available.</p>
                        )}

                        {!loading && !error && filteredRooms.map(room => (

                            <RoomCard
                                key={room.roomId}
                                room={room}
                                currentUserId={currentUserId}
                            />

                        ))}

                    </div>

                </main>

            </div>

        </div>
    );
}

export default Home;

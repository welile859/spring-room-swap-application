
import React, { useState, useEffect } from "react";

import {
    FiHome,
    FiPlusSquare,
    FiMessageSquare,
    FiUser,
    FiLogOut,
    FiLogIn,
    FiUserPlus
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

    // Fetch room listings and check whether a user is logged in.
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Retrieve rooms without requiring authentication.
                const roomsResponse = await fetch(
                    "http://localhost:8080/api/rooms"
                );

                if (!roomsResponse.ok) {
                    throw new Error("Failed to retrieve room listings.");
                }

                const roomsData = await roomsResponse.json();
                setRooms(roomsData);

                // Check whether the visitor is logged in.
                const userResponse = await fetch(
                    "http://localhost:8080/api/auth/me",
                    {
                        credentials: "include"
                    }
                );

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setCurrentUserId(Number(userData.userId));
                } else {
                    // Visitor is not logged in.
                    setCurrentUserId(null);
                }

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
            setCurrentUserId(null);
            navigate("/home");

        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Check whether the visitor is logged in.
    const isLoggedIn = currentUserId !== null;

    // Show all rooms to visitors.
    // Registered users do not see their own room listings.
    const otherUsersRooms = rooms.filter(
        room =>
            !isLoggedIn ||
            Number(room.ownerId) !== currentUserId
    );

    // Filter rooms according to gender preference.
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
                            onClick={() =>
                                navigate(
                                    isLoggedIn ? "/post-room" : "/login"
                                )
                            }
                        >
                            <FiPlusSquare />
                            <span>Post a Room</span>
                        </button>

                        <button
                            className="sidebar-item"
                            onClick={() =>
                                navigate(
                                    isLoggedIn ? "/messages" : "/login"
                                )
                            }
                        >
                            <FiMessageSquare />
                            <span>Messages</span>
                        </button>

                        <button
                            className="sidebar-item"
                            onClick={() =>
                                navigate(
                                    isLoggedIn ? "/profile" : "/login"
                                )
                            }
                        >
                            <FiUser />
                            <span>Profile</span>
                        </button>

                    </nav>

                    {/* Authentication options */}
                    {isLoggedIn ? (

                        <button
                            className="sidebar-item logout"
                            onClick={handleLogout}
                        >
                            <FiLogOut />
                            <span>Logout</span>
                        </button>

                    ) : (

                        <div className="sidebar-auth">

                            <button
                                className="sidebar-item"
                                onClick={() => navigate("/login")}
                            >
                                <FiLogIn />
                                <span>Login</span>
                            </button>

                            <button
                                className="sidebar-item"
                                onClick={() => navigate("/register")}
                            >
                                <FiUserPlus />
                                <span>Register</span>
                            </button>

                        </div>

                    )}

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
                            <p>No rooms are currently available.</p>
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

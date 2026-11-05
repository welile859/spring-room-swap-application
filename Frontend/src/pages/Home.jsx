import React, { useState } from "react";
import {
    FiHome,
    FiPlusSquare,
    FiMessageSquare,
    FiUser,
    FiLogOut
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import RoomCard from "../components/RoomCard";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";

function Home() {

    const [selectedGender, setSelectedGender] = useState("All");

    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const rooms = [
        {
            id: 1,
            title: "Cozy room in Hatfield",
            price: 3500,
            location: "Hatfield, Pretoria",
            availability: "Available now",
            gender: "Male",
            available: true,
            image: null
        },
        {
            id: 2,
            title: "Spacious room near campus",
            price: 4000,
            location: "Groenkloof, Pretoria",
            availability: "Available 15 Nov",
            gender: "Any",
            available: false,
            image: null
        },
        {
            id: 3,
            title: "Modern room in Arcadia",
            price: 3800,
            location: "Arcadia, Pretoria",
            availability: "Available now",
            gender: "Female",
            available: true,
            image: null
        },
        {
            id: 4,
            title: "Room in shared house",
            price: 2800,
            location: "Arcadia, Pretoria",
            availability: "Available 1 Nov",
            gender: "Any",
            available: false,
            image: null
        },
        {
            id: 5,
            title: "Large room in Hatfield",
            price: 3200,
            location: "Hatfield, Pretoria",
            availability: "Available now",
            gender: "Male",
            available: true,
            image: null
        },
        {
            id: 6,
            title: "Student room near campus",
            price: 3000,
            location: "Groenkloof, Pretoria",
            availability: "Available 20 Nov",
            gender: "Female",
            available: false,
            image: null
        }
    ];

    const filteredRooms =
        selectedGender === "All"
            ? rooms
            : rooms.filter(room => room.gender === selectedGender);

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

                        <button className="sidebar-item">
                            <FiMessageSquare />
                            <span>Messages</span>
                        </button>

                        <button className="sidebar-item">
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


                {/* Main content */}
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
                            <option>Sort by: Price Low</option>
                            <option>Sort by: Price High</option>
                        </select>

                    </div>


                    {/* Room grid */}
                    <div className="room-grid">

                        {filteredRooms.map(room => (
                            <RoomCard
                                key={room.id}
                                room={room}
                            />
                        ))}

                    </div>

                </main>

            </div>

        </div>
    );
}

export default Home;
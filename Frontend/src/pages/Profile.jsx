
import React, { useEffect, useState } from "react";

import {
    FiHome,
    FiPlusSquare,
    FiMessageSquare,
    FiUser,
    FiLogOut,
    FiEdit2,
    FiMapPin,
    FiImage,
    FiUsers
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { logoutUser } from "../services/api";

import "./Profile.css";

function Profile() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [conversations, setConversations] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetch profile information, rooms and conversations.
    useEffect(() => {

        const fetchProfileData = async () => {

            try {

                const [userResponse, roomsResponse, conversationsResponse] =
                    await Promise.all([

                        fetch("http://localhost:8080/api/auth/me", {
                            credentials: "include"
                        }),

                        fetch("http://localhost:8080/api/rooms", {
                            credentials: "include"
                        }),

                        fetch("http://localhost:8080/api/chat/conversations", {
                            credentials: "include"
                        })

                    ]);

                if (!userResponse.ok) {
                    throw new Error("Failed to retrieve profile information.");
                }

                if (!roomsResponse.ok) {
                    throw new Error("Failed to retrieve room listings.");
                }

                if (!conversationsResponse.ok) {
                    throw new Error("Failed to retrieve conversations.");
                }

                const userData = await userResponse.json();
                const roomsData = await roomsResponse.json();
                const conversationsData = await conversationsResponse.json();

                setUser(userData);
                setRooms(roomsData);
                setConversations(conversationsData);

            } catch (error) {

                console.error("Error loading profile:", error);
                setError(error.message);

            } finally {

                setLoading(false);

            }
        };

        fetchProfileData();

    }, []);

    // Get only the logged-in user's room listings.
    const myRooms = rooms.filter(
        room => Number(room.ownerId) === Number(user?.userId)
    );

    // Each conversation represents a distinct other user.
    const peopleMessaged = conversations.length;

    // Handle logout.
    const handleLogout = async () => {

        try {

            await logoutUser();
            navigate("/login");

        } catch (error) {

            console.error("Logout failed:", error);

        }
    };

    return (

        <div className="app">

            <Navbar />

            <div className="layout">

                {/* Sidebar */}
                <aside className="sidebar">

                    <nav className="sidebar-nav">

                        <button
                            className="sidebar-item"
                            onClick={() => navigate("/home")}
                        >
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
                            className="sidebar-item active"
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

                {/* Main Profile Content */}
                <main className="main-content profile-page">

                    <div className="page-header">
                        <h1>My Profile</h1>
                    </div>

                    {loading && (
                        <p>Loading profile...</p>
                    )}

                    {!loading && error && (
                        <p className="profile-error">{error}</p>
                    )}

                    {!loading && !error && user && (

                        <>

                            {/* Profile Information */}
                            <section className="profile-information">

                                <div className="profile-avatar">
                                    <FiUser />
                                </div>

                                <div className="profile-user-details">

                                    <h2>{user.fullName}</h2>

                                    <p>{user.email}</p>

                                </div>

                                <button
                                    className="edit-profile-button"
                                    onClick={() => alert("Edit Profile coming soon.")}
                                >
                                    <FiEdit2 />
                                    Edit Profile
                                </button>

                            </section>

                            {/* Profile Statistics */}
                            <section className="profile-statistics">

                                <div className="profile-stat-card">

                                    <h2>{myRooms.length}</h2>

                                    <p>Rooms Posted</p>

                                </div>

                                <div className="profile-stat-card">

                                    <h2>{peopleMessaged}</h2>

                                    <p>People Messaged</p>

                                </div>

                            </section>

                            {/* My Rooms */}
                            <section className="my-rooms-section">

                                <div className="my-rooms-header">
                                    <h2>My Rooms</h2>
                                    <span>{myRooms.length} listings</span>
                                </div>

                                {myRooms.length === 0 ? (

                                    <div className="no-rooms">

                                        <FiImage size={35} />

                                        <p>You haven't posted any rooms yet.</p>

                                        <button
                                            onClick={() => navigate("/post-room")}
                                        >
                                            Post a Room
                                        </button>

                                    </div>

                                ) : (

                                    <div className="room-grid">

                                        {myRooms.map(room => (

                                            <div
                                                className="room-card"
                                                key={room.roomId}
                                            >

                                                <div className="room-image-gallery">

                                                    {room.images?.length > 0 ? (

                                                        room.images.slice(0, 3).map(
                                                            (image, index) => (

                                                                <img
                                                                    key={index}
                                                                    src={image}
                                                                    alt={`${room.roomTitle} - Image ${index + 1}`}
                                                                />

                                                            )
                                                        )

                                                    ) : (

                                                        <div className="image-placeholder">
                                                            <FiImage />
                                                        </div>

                                                    )}

                                                </div>

                                                <div className="room-card-content">

                                                    <h3>{room.roomTitle}</h3>

                                                    <div className="room-info">
                                                        <FiMapPin />
                                                        <span>{room.location}</span>
                                                    </div>

                                                    <p className="room-description">
                                                        {room.description}
                                                    </p>

                                                    <div className="room-card-footer">

                                                        <span className={`gender-tag ${(room.genderPreference || "any").toLowerCase()}`}>
                                                            <FiUsers />
                                                            {room.genderPreference}
                                                        </span>

                                                    </div>

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                )}

                            </section>

                        </>

                    )}

                </main>

            </div>

        </div>

    );
}

export default Profile;

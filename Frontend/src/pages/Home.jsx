
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import PublicSidebar from "../components/PublicSidebar";
import Navbar from "../components/Navbar";
import RoomCard from "../components/RoomCard";

function Home() {

    const [selectedGender, setSelectedGender] = useState("All");

    const [rooms, setRooms] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchParams] = useSearchParams();

    const searchTerm = (searchParams.get("search") || "")
        .trim()
        .toLowerCase();

    useEffect(() => {

        const fetchData = async () => {

            try {

                const roomsResponse = await fetch(
                    "http://localhost:8080/api/rooms"
                );

                if (!roomsResponse.ok) {
                    throw new Error("Failed to retrieve room listings.");
                }

                const roomsData = await roomsResponse.json();
                setRooms(roomsData);

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

    const isLoggedIn = currentUserId !== null;

    const otherUsersRooms = rooms.filter(
        room =>
            !isLoggedIn ||
            Number(room.ownerId) !== currentUserId
    );

    const searchedRooms = otherUsersRooms.filter(room =>
        (room.roomTitle || "")
            .toLowerCase()
            .startsWith(searchTerm)
    );

    const filteredRooms =
        selectedGender === "All"
            ? searchedRooms
            : searchedRooms.filter(
                room => room.genderPreference === selectedGender
            );

    return (
        <div className="app">

            <Navbar />

            <div className="layout">

                <PublicSidebar />

                <main className="main-content">

                    <div className="page-header">
                        <h1>Available Rooms</h1>
                    </div>

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

                    <div className="room-grid">

                        {loading && (
                            <p>Loading room listings...</p>
                        )}

                        {!loading && error && (
                            <p>{error}</p>
                        )}

                        {!loading && !error && filteredRooms.length === 0 && (
                            <p>
                                {searchTerm
                                    ? "No rooms found with that name."
                                    : "No rooms are currently available."
                                }
                            </p>
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


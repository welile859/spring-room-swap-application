
import React from "react";
import {
    FiMapPin,
    FiImage,
    FiUsers,
    FiMessageSquare
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function RoomCard({ room, currentUserId }) {

    const navigate = useNavigate();

    const roomImages = room.images?.slice(0, 3) || [];

    const openChat = () => {
        navigate(`/chat/${room.ownerId}`);
    };

    const isOwnRoom = Number(room.ownerId) === Number(currentUserId);

    return (
        <div className="room-card">

            <div className="room-image-gallery">

                {roomImages.length > 0 ? (

                    roomImages.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`${room.roomTitle} - Image ${index + 1}`}
                        />
                    ))

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

                    <span className={`gender-tag ${room.genderPreference.toLowerCase()}`}>
                        <FiUsers />
                        {room.genderPreference}
                    </span>

                    {!isOwnRoom && (
                        <button
                            className="view-details"
                            onClick={openChat}
                        >
                            <FiMessageSquare />
                            Message
                        </button>
                    )}

                </div>

            </div>

        </div>
    );
}

export default RoomCard;


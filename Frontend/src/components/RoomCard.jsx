import React from "react";
import {
    FiMapPin,
    FiCalendar,
    FiImage
} from "react-icons/fi";

function RoomCard({ room }) {
    return (
        <div className="room-card">

            <div className="room-image">
                {room.image ? (
                    <img src={room.image} alt={room.title} />
                ) : (
                    <div className="image-placeholder">
                        <FiImage />
                    </div>
                )}
            </div>

            <div className="room-card-content">

                <h3>{room.title}</h3>

                <div className="room-info">
                    <FiMapPin />
                    <span>{room.location}</span>
                </div>

                <div className="room-info">
                    <strong>R {room.price.toLocaleString()} / month</strong>
                </div>

                <div className="room-info">
                    <FiCalendar />
                    <span>{room.availability}</span>
                </div>

                <div className="room-card-footer">
                    <span className={`gender-tag ${room.gender.toLowerCase()}`}>
                        {room.gender}
                    </span>

                    {room.available && (
                        <span className="available-tag">
                            Available now
                        </span>
                    )}
                </div>

            </div>

        </div>
    );
}

export default RoomCard;
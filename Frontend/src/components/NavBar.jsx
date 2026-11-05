import React from "react";
import {
    FiSearch,
    FiBell,
    FiUser,
} from "react-icons/fi";

function Navbar() {
    return (
        <header className="navbar">
            <div className="navbar-left">
                <h2 className="logo">RoomsSwap</h2>
            </div>

            <div className="navbar-search">
                <FiSearch />
                <input
                    type="text"
                    placeholder="Search rooms, areas, or universities..."
                />
            </div>

            <div className="navbar-right">
                <button className="icon-button">
                    <FiBell />
                </button>

                <button className="profile-button">
                    <FiUser />
                </button>
            </div>
        </header>
    );
}

export default Navbar;
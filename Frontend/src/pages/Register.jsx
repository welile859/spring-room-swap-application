
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../services/api.js";
import Navbar from "../components/Navbar";
import PublicSidebar from "../components/PublicSidebar";

function Register() {

    const [registered, setRegistered] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");

        const formData = new FormData(e.target);

        const registerRequest = {
            fullName: formData.get("fullName"),
            email: formData.get("email"),
            password: formData.get("password")
        };

        const result = await registerUser(registerRequest);

        if (result === "success") {
            navigate("/home");
        } else {
            setError(result);
        }
    };

    return (
        <div className="app">

            <Navbar />

            <div className="layout">

                <PublicSidebar />

                <main className="main-content login-main">

                    <div className="login-card">

                        <div className="login-heading">

                            <h1>Create Account</h1>

                            <p>
                                Join RoomsSwap and find or share student rooms
                            </p>

                        </div>

                        <form onSubmit={handleSubmit}>

                            <div className="login-form-group">

                                <label htmlFor="name">
                                    Full name
                                </label>

                                <div className="login-input-wrapper">

                                    <input
                                        id="name"
                                        type="text"
                                        name="fullName"
                                        placeholder="Full name"
                                        required
                                    />

                                </div>

                            </div>

                            <div className="login-form-group">

                                <label htmlFor="register-email">
                                    Email address
                                </label>

                                <div className="login-input-wrapper">

                                    <input
                                        id="register-email"
                                        name="email"
                                        type="email"
                                        placeholder="Email address"
                                        required
                                    />

                                </div>

                            </div>

                            <div className="login-form-group">

                                <label htmlFor="register-password">
                                    Password
                                </label>

                                <div className="login-input-wrapper">

                                    <input
                                        id="register-password"
                                        name="password"
                                        type="password"
                                        placeholder="Password"
                                        required
                                    />

                                </div>

                            </div>

                            <div className="login-form-group">

                                <label htmlFor="confirm-password">
                                    Confirm password
                                </label>

                                <div className="login-input-wrapper">

                                    <input
                                        id="confirm-password"
                                        type="password"
                                        placeholder="Confirm password"
                                        required
                                    />

                                </div>

                            </div>

                            {error && (
                                <p className="error-message">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                className="login-button"
                            >
                                Sign Up
                            </button>

                        </form>

                        <div className="forgot-password">

                            <Link to="/login">
                                Already have an account? Log in
                            </Link>

                        </div>

                    </div>

                </main>

            </div>

        </div>
    );
}

export default Register;

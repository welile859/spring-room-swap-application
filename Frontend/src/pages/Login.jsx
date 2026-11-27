
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PublicSidebar from "../components/PublicSidebar";
import Navbar from "../components/Navbar";
import { loginUser } from "../services/api";

import InvalidCredentialsCard
    from "../components/InvalidCredentialsCard";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.email || !formData.password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            await loginUser(formData);

            navigate("/home");

        } catch (err) {
            if (err.response?.status === 401) {
                setError(
                    "Invalid email or password. Please try again."
                );
            } else {
                setError(
                    "Unable to log in right now. Please try again later."
                );
            }
        } finally {
            setLoading(false);
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

                            <h1>Welcome to U-dubswap</h1>

                            <p>
                                Log in to your account
                            </p>

                        </div>

                        <form onSubmit={handleSubmit}>

                            {error && (
                                <InvalidCredentialsCard message={error} />
                            )}

                            <div className="login-form-group">

                                <label htmlFor="email">
                                    Email address
                                </label>

                                <div className="login-input-wrapper">

                                    <svg
                                        className="login-input-icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <rect
                                            x="3"
                                            y="5"
                                            width="18"
                                            height="14"
                                            rx="2"
                                        />

                                        <path d="m3 7 9 6 9-6" />

                                    </svg>

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="Email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                            <div className="login-form-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="login-input-wrapper">

                                    <svg
                                        className="login-input-icon"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                    >
                                        <rect
                                            x="5"
                                            y="10"
                                            width="14"
                                            height="10"
                                            rx="2"
                                        />

                                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />

                                    </svg>

                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >
                                {loading
                                    ? "Logging in..."
                                    : "Log In"
                                }
                            </button>

                        </form>

                        <div className="forgot-password">
                            <a href="#forgot-password">
                                Forgot password?
                            </a>
                        </div>

                        <div className="login-divider">

                            <span></span>

                            <p>OR</p>

                            <span></span>

                        </div>

                        <Link
                            to="/register"
                            className="create-account-button"
                        >
                            Create a new account
                        </Link>

                    </div>

                </main>

            </div>

        </div>
    );
}

export default Login;

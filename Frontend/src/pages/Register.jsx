import React, {useState} from "react";
import {registerUser} from "../services/api.js"
import {Link, useNavigate} from "react-router-dom"; // EDIT: added useNavigate

function Register() {

    const[registered, setRegistered] = useState(false);
    const[error, setError] = useState(""); // EDIT: stores registration error
    const navigate = useNavigate(); // EDIT: allows navigation to login

    const handleSubmit = async (e) => {

        e.preventDefault(); // EDIT: prevents the form from refreshing the page

        const formData = new FormData(e.target);

        const registerRequest = {
            fullName: formData.get("fullName"),
            email: formData.get("email"),
            password: formData.get("password")
        }

        const result = await registerUser(registerRequest);


             if (result === "success") {
                          navigate("/home");
                   } else {
                      setError(result);
                    }


    }

    return (
        <div className="login-page">

            {/* Header */}
            <header className="auth-header">

                <div className="auth-logo">
                    RoomsSwap
                </div>

                <nav className="auth-nav">

                    <Link
                        to="/login"
                        className="auth-nav-link"
                    >
                        Login
                    </Link>

                    <Link
                        to="/register"
                        className="auth-nav-link active"
                    >
                        Sign Up
                    </Link>

                </nav>

            </header>


            {/* Main */}
            <main className="login-main">

                <div className="login-card">

                    <div className="login-heading">

                        <h1>Create Account</h1>

                        <p>
                            Join RoomsSwap and find or share student rooms
                        </p>

                    </div>


                    <form onSubmit={handleSubmit}>

                        {/* Full Name */}
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
                                />

                            </div>

                        </div>


                        {/* Email */}
                        <div className="login-form-group">

                            <label htmlFor="register-email">
                                Email address
                            </label>

                            <div className="login-input-wrapper">

                                <input
                                    id="register-email"
                                    name="email" // EDIT: needed for FormData.get("email")
                                    type="email"
                                    placeholder="Email address"
                                />

                            </div>

                        </div>


                        {/* Password */}
                        <div className="login-form-group">

                            <label htmlFor="register-password">
                                Password
                            </label>

                            <div className="login-input-wrapper">

                                <input
                                    id="register-password"
                                    name="password" // EDIT: needed for FormData.get("password")
                                    type="password"
                                    placeholder="Password"
                                />

                            </div>

                        </div>


                        {/* Confirm Password */}
                        <div className="login-form-group">

                            <label htmlFor="confirm-password">
                                Confirm password
                            </label>

                            <div className="login-input-wrapper">

                                <input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="Confirm password"
                                />

                            </div>

                        </div>


                        {/* EDIT: ternary displays error if registration fails */}
                        {error ? (
                            <p className="error-message">{error}</p>
                        ) : null}


                        {/* Sign Up */}
                        <button
                            type="submit"
                            className="login-button"
                        >
                            Sign Up
                        </button>

                    </form>


                    {/* Login Link */}
                    <div className="forgot-password">

                        <Link to="/login">
                            Already have an account? Log in
                        </Link>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Register;
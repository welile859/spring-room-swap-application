import { useEffect, useState } from "react";
import axios from "axios";

function VerifyEmail() {
    const [status, setStatus] = useState("loading");
    const [message, setMessage] = useState(
        "Verifying your email..."
    );

    useEffect(() => {
        const params = new URLSearchParams(
            window.location.search
        );

        const token = params.get("token");

        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link.");
            return;
        }

        axios
            .get("http://localhost:8080/api/auth/verify", {
                params: { token }
            })
            .then((response) => {
                const result = response.data;

                if (
                    typeof result === "string" &&
                    result.toLowerCase().includes("successfully")
                ) {
                    setStatus("success");
                    setMessage(result);
                } else {
                    setStatus("error");
                    setMessage(result);
                }
            })
            .catch((error) => {
                setStatus("error");

                if (error.response?.data) {
                    setMessage(error.response.data);
                } else {
                    setMessage(
                        "Unable to verify your email. Please try again."
                    );
                }
            });
    }, []);

    return (
        <main className="verification-page">
            <section className="verification-card">
                {status === "loading" && (
                    <div className="verification-icon loading">
                        ...
                    </div>
                )}

                {status === "success" && (
                    <div className="verification-icon success">
                        ✓
                    </div>
                )}

                {status === "error" && (
                    <div className="verification-icon error">
                        !
                    </div>
                )}

                <h1>
                    {status === "loading"
                        ? "Verifying your email"
                        : status === "success"
                        ? "Email verified!"
                        : "Verification unsuccessful"}
                </h1>

                <p>{message}</p>

                {status === "success" && (
                    <a href="/login" className="verification-button">
                        Continue to login
                    </a>
                )}

                {status === "error" && (
                    <a href="/register" className="verification-button">
                        Return to registration
                    </a>
                )}
            </section>
        </main>
    );
}

export default VerifyEmail;
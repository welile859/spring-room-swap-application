
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
    const [authenticated, setAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8080/api/auth/me",
                    {
                        credentials: "include"
                    }
                );

                setAuthenticated(response.ok);

            } catch (error) {
                console.error("Authentication check failed:", error);
                setAuthenticated(false);
            }
        };

        checkAuthentication();
    }, []);

    // Wait until authentication has been checked.
    if (authenticated === null) {
        return <p>Checking authentication...</p>;
    }

    // Redirect visitors who are not logged in.
    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    // Allow authenticated users to access the page.
    return children;
}

export default ProtectedRoute;

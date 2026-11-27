
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PostRoom from "./pages/PostRoom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home />} />

                {/* Protected pages */}
                <Route
                    path="/post-room"
                    element={
                        <ProtectedRoute>
                            <PostRoom />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/messages"
                    element={
                        <ProtectedRoute>
                            <Messages />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/chat/:recipientId"
                    element={
                        <ProtectedRoute>
                            <Chat />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                {/* Default page */}
                <Route
                    path="/"
                    element={<Navigate to="/home" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;

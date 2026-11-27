
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PostRoom from "./pages/PostRoom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Authentication */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />

                {/* Main application */}
                <Route path="/home" element={<Home />} />
                <Route path="/post-room" element={<PostRoom />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/chat/:recipientId" element={<Chat />} />

                {/* Default */}
                <Route
                    path="/"
                    element={<Navigate to="/login" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PostRoom from "./pages/PostRoom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Authentication */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Main application */}
                <Route path="/home" element={<Home />} />
                <Route path="/post-room" element={<PostRoom />} />

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
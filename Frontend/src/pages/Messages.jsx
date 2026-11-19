
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    FiHome,
    FiPlusSquare,
    FiMessageSquare,
    FiUser,
    FiLogOut,
    FiEdit2
} from "react-icons/fi";

import Navbar from "../components/Navbar";
import websocketService from "../services/webSocketServices";
import { logoutUser } from "../services/api";

import "./Messages.css";

function Messages() {

    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedConversation, setSelectedConversation] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {

        let active = true;
        let messageSubscription = null;

        const fetchConversations = async () => {

            try {

                const response = await fetch(
                    "http://localhost:8080/api/chat/conversations",
                    {
                        method: "GET",
                        credentials: "include"
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to retrieve conversations.");
                }

                const data = await response.json();

                if (active) {
                    setConversations(data);
                    setError("");
                }

            } catch (error) {

                console.error("Error fetching conversations:", error);

                if (active) {
                    setError(error.message);
                }

            } finally {

                if (active) {
                    setLoading(false);
                }

            }
        };

        fetchConversations();

        websocketService.connect(() => {

            if (!active) return;

            console.log("Messages page WebSocket connected!");

            messageSubscription = websocketService.subscribe(
                "/user/queue/messages",
                () => {
                    fetchConversations();
                }
            );

        });

        return () => {

            active = false;

            if (messageSubscription) {
                messageSubscription.unsubscribe();
            }

            websocketService.disconnect();

        };

    }, []);

    const handleLogout = async () => {

        try {
            await logoutUser();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }

    };

    const formatMessageTime = (dateValue) => {

        if (!dateValue) return "";

        const messageDate = new Date(dateValue);

        if (Number.isNaN(messageDate.getTime())) return "";

        const today = new Date();

        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (messageDate.toDateString() === today.toDateString()) {
            return messageDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit"
            });
        }

        if (messageDate.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        }

        return messageDate.toLocaleDateString([], {
            weekday: "short"
        });

    };

    const openConversation = (conversation) => {

        setSelectedConversation(conversation.otherUserId);

        navigate(`/chat/${conversation.otherUserId}`);

    };

    return (

        <div className="app">

            <Navbar />

            <div className="layout">

                {/* Left Navigation Sidebar */}
                <aside className="sidebar">

                    <nav className="sidebar-nav">

                        <button
                            className="sidebar-item"
                            onClick={() => navigate("/home")}
                        >
                            <FiHome />
                            <span>Home</span>
                        </button>

                        <button
                            className="sidebar-item"
                            onClick={() => navigate("/post-room")}
                        >
                            <FiPlusSquare />
                            <span>Post a Room</span>
                        </button>

                        <button className="sidebar-item active">
                            <FiMessageSquare />
                            <span>Messages</span>
                        </button>

                        <button className="sidebar-item">
                            <FiUser />
                            <span>Profile</span>
                        </button>

                    </nav>

                    <button
                        className="sidebar-item logout"
                        onClick={handleLogout}
                    >
                        <FiLogOut />
                        <span>Logout</span>
                    </button>

                </aside>

                {/* Main Messages Panel */}
                <main className="main-content messages-page">

                    <div className="messages-container">

                        <div className="messages-header">

                            <div>
                                <h1>Messages</h1>
                                <p>Your conversations</p>
                            </div>

                            <button
                                className="new-message-button"
                                title="Start a new conversation"
                                onClick={() => navigate("/home")}
                            >
                                <FiEdit2 />
                            </button>

                        </div>

                        {loading && (
                            <p className="messages-status">
                                Loading conversations...
                            </p>
                        )}

                        {!loading && error && (
                            <p className="messages-error">
                                {error}
                            </p>
                        )}

                        {!loading && !error && conversations.length === 0 && (

                            <div className="empty-messages">

                                <FiMessageSquare size={45} />

                                <h2>No conversations yet</h2>

                                <p>
                                    When you message someone about a room,
                                    your conversations will appear here.
                                </p>

                                <button onClick={() => navigate("/home")}>
                                    Browse Rooms
                                </button>

                            </div>

                        )}

                        {!loading && !error && conversations.length > 0 && (

                            <div className="conversation-list">

                                {conversations.map((conversation, index) => (

                                    <div
                                        className={
                                            selectedConversation === conversation.otherUserId ||
                                            (selectedConversation === null && index === 0)
                                                ? "conversation-item selected"
                                                : "conversation-item"
                                        }
                                        key={conversation.otherUserId}
                                        onClick={() => openConversation(conversation)}
                                    >

                                        <div className="conversation-avatar">
                                            <FiUser size={23} />
                                        </div>

                                        <div className="conversation-details">

                                            <h3>
                                                {conversation.otherUserName}
                                            </h3>

                                            <p>
                                                {conversation.lastMessage}
                                            </p>

                                        </div>

                                        <div className="conversation-time">
                                            {formatMessageTime(
                                                conversation.lastMessageAt
                                            )}
                                        </div>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>

                </main>

            </div>

        </div>

    );

}

export default Messages;


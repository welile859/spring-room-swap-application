
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    FiUser,
    FiSend,
    FiArrowLeft,
    FiMessageSquare
} from "react-icons/fi";

import websocketService from "../services/webSocketServices";
import "./Chat.css";

function Chat() {
    const { recipientId } = useParams();
    const navigate = useNavigate();

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [recipientName, setRecipientName] = useState("RoomSwap User");
    const [error, setError] = useState("");

    const messagesEndRef = useRef(null);

    const numericRecipientId = Number(recipientId);

    // Scroll to the latest message whenever messages change.
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    // Load the current user, recipient name, and chat history.
    useEffect(() => {
        let active = true;

        setError("");
        setMessages([]);
        setCurrentUser(null);

        if (
            !Number.isInteger(numericRecipientId) ||
            numericRecipientId <= 0
        ) {
            setError("Invalid recipient ID.");
            return;
        }

        let messageSubscription = null;

        const loadChat = async () => {
            try {
                const userResponse = await fetch(
                    "http://localhost:8080/api/auth/me",
                    {
                        credentials: "include"
                    }
                );

                if (!userResponse.ok) {
                    throw new Error("Could not retrieve user details.");
                }

                const user = await userResponse.json();

                if (!active) return;

                setCurrentUser(user);

                if (user.userId === numericRecipientId) {
                    setError("You cannot start a conversation with yourself.");
                    return;
                }

                // Retrieve the recipient's name from existing conversations.
                try {
                    const conversationsResponse = await fetch(
                        "http://localhost:8080/api/chat/conversations",
                        {
                            credentials: "include"
                        }
                    );

                    if (conversationsResponse.ok) {
                        const conversations =
                            await conversationsResponse.json();

                        const conversation = conversations.find(
                            item =>
                                item.otherUserId === numericRecipientId
                        );

                        if (conversation && active) {
                            setRecipientName(conversation.otherUserName);
                        }
                    }
                } catch (nameError) {
                    console.error(
                        "Could not retrieve recipient name:",
                        nameError
                    );
                }

                // Connect to WebSocket.
                websocketService.connect(() => {
                    if (!active) return;

                    console.log("Connected to WebSocket!");

                    messageSubscription = websocketService.subscribe(
                        "/user/queue/messages",
                        receivedMessage => {
                            console.log(
                                "MESSAGE RECEIVED:",
                                receivedMessage
                            );

                            // Only display messages from this recipient.
                            if (
                                receivedMessage.senderId !==
                                numericRecipientId
                            ) {
                                return;
                            }

                            setMessages(previousMessages => {
                                const alreadyExists = previousMessages.some(
                                    msg =>
                                        msg.messageId ===
                                        receivedMessage.messageId
                                );

                                if (alreadyExists) {
                                    return previousMessages;
                                }

                                return [
                                    ...previousMessages,
                                    receivedMessage
                                ];
                            });
                        }
                    );

                    // Load previous messages.
                    fetch(
                        `http://localhost:8080/api/chat/messages/${numericRecipientId}`,
                        {
                            credentials: "include"
                        }
                    )
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(
                                    "Could not load chat history."
                                );
                            }

                            return response.json();
                        })
                        .then(previousMessages => {
                            if (!active) return;

                            setMessages(currentMessages => {
                                const combinedMessages = [
                                    ...previousMessages,
                                    ...currentMessages
                                ];

                                const uniqueMessages = Array.from(
                                    new Map(
                                        combinedMessages.map(msg => [
                                            msg.messageId,
                                            msg
                                        ])
                                    ).values()
                                );

                                return uniqueMessages;
                            });
                        })
                        .catch(historyError => {
                            if (active) {
                                console.error(
                                    "Error loading messages:",
                                    historyError
                                );

                                setError(historyError.message);
                            }
                        });
                });
            } catch (fetchError) {
                if (active) {
                    console.error(
                        "Error retrieving user:",
                        fetchError
                    );

                    setError(fetchError.message);
                }
            }
        };

        loadChat();

        return () => {
            active = false;

            if (messageSubscription) {
                messageSubscription.unsubscribe();
            }

            websocketService.disconnect();
        };
    }, [numericRecipientId]);

    // Send a message to the recipient.
    const sendMessage = event => {
        event.preventDefault();

        const trimmedMessage = message.trim();

        if (!trimmedMessage) return;

        if (!currentUser || currentUser.userId === numericRecipientId) {
            return;
        }

        websocketService.sendMessage("/app/private-message", {
            message: trimmedMessage,
            recipientId: numericRecipientId
        });

        setMessage("");
    };

    // Format message timestamps.
    const formatMessageTime = sentAt => {
        if (!sentAt) return "";

        return new Date(sentAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="chat-page">

            {/* Chat Header */}
            <header className="chat-header">

                <button
                    className="chat-back-button"
                    onClick={() => navigate("/messages")}
                    aria-label="Back to messages"
                >
                    <FiArrowLeft />
                </button>

                <div className="chat-avatar">
                    <FiUser />
                </div>

                <div className="chat-contact-details">
                    <h2>{recipientName}</h2>

                    <div className="chat-presence">
                        <span className="status-dot"></span>
                        <span>Chat</span>
                    </div>
                </div>

            </header>

            {/* Message Feed */}
            <main className="chat-messages">

                {error && (
                    <div className="chat-error">
                        {error}
                    </div>
                )}

                {!error && messages.length === 0 && (
                    <div className="chat-empty">
                        <FiMessageSquare size={35} />

                        <p>
                            No messages yet. Start the conversation!
                        </p>
                    </div>
                )}

                {messages.map(msg => {
                    const isSender =
                        currentUser &&
                        msg.senderId === currentUser.userId;

                    return (
                        <div
                            key={msg.messageId}
                            className={`message-row ${
                                isSender ? "outgoing" : "incoming"
                            }`}
                        >
                            <div className="message-content">

                                <div className="message-bubble">
                                    <p>{msg.message}</p>
                                </div>

                                <small className="message-time">
                                    {formatMessageTime(msg.sentAt)}
                                </small>

                            </div>
                        </div>
                    );
                })}

                <div ref={messagesEndRef}></div>

            </main>

            {/* Message Input */}
            <form
                className="chat-input-container"
                onSubmit={sendMessage}
            >
                <input
                    type="text"
                    value={message}
                    onChange={event => setMessage(event.target.value)}
                    placeholder="Type a message..."
                    autoComplete="off"
                />

                <button
                    type="submit"
                    className="chat-send-button"
                    disabled={!message.trim()}
                    aria-label="Send message"
                >
                    <FiSend />
                </button>
            </form>

        </div>
    );
}

export default Chat;

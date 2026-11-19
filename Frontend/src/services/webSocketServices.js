
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class WebSocketService {

    constructor() {
        this.stompClient = null;
    }

    // This will make a WebSocket connection
    connect(onConnected) {

        this.stompClient = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),

            onConnect: () => {
                console.log("WebSocket connected successfully!");

                if (onConnected) {
                    onConnected();
                }
            },

            onStompError: (frame) => {
                console.error("STOMP error:", frame.headers["message"]);
            },

            onWebSocketError: (error) => {
                console.error("WebSocket error:", error);
            }
        });

        this.stompClient.activate();
    }

    // Subscribe to a destination
    subscribe(destination, callback) {

        if (!this.stompClient || !this.stompClient.connected) {
            console.error("WebSocket is not connected.");
            return;
        }

        return this.stompClient.subscribe(destination, (message) => {
            callback(JSON.parse(message.body));
        });
    }

    // This will Send a message to the springboot backend
    sendMessage(destination, message) {

        if (!this.stompClient || !this.stompClient.connected) {
            console.error("WebSocket is not connected.");
            return;
        }

        this.stompClient.publish({
            destination: destination,
            body: JSON.stringify(message)
        });
    }

    // This disconnect to the WebSocket connection
    disconnect() {

        if (this.stompClient) {
            this.stompClient.deactivate();
            this.stompClient = null;

            console.log("WebSocket disconnected.");
        }
    }
}

const websocketService = new WebSocketService();

export default websocketService;

const statusDiv = document.getElementById("status");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const disconnectButton = document.getElementById("disconnect-button");
const notificationsDiv = document.getElementById("notifications");

const wsUrl = "wss://socketsbay.com/wss/v2/1/demo/"; // Dummy WebSocket Server
let socket;
let retryCount = 0;
const maxRetries = 5; // Maximum reconnect attempts

const displayNotification = (message) => {
    const notificationElement = document.createElement("p");
    notificationElement.innerText = message;
    notificationsDiv.appendChild(notificationElement);
};

// ✅ Function to Connect WebSocket
const connectWebSocket = () => {
    if (retryCount >= maxRetries) {
        displayNotification("Max retries reached. WebSocket stopped.");
        return;
    }

    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        console.log("WebSocket Connected ✅");
        statusDiv.innerText = "Connected ✅";
        displayNotification("Connected to WebSocket Server");
        messageInput.disabled = false;
        sendButton.disabled = false;
        disconnectButton.disabled = false;
        retryCount = 0; // Reset retry count
    };

    socket.onmessage = (event) => {
        console.log("Received:", event.data);
        displayNotification(`📩 New Message: ${event.data}`);
    };

    socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
        displayNotification("⚠ WebSocket Error: Check console for details.");
    };

    socket.onclose = (event) => {
        console.warn(`WebSocket Disconnected ❌ (Code: ${event.code})`);
        statusDiv.innerText = "Disconnected ❌";
        displayNotification("WebSocket Disconnected. Reconnecting...");
        messageInput.disabled = true;
        sendButton.disabled = true;
        disconnectButton.disabled = true;
        retryCount++;
        setTimeout(connectWebSocket, 3000); // Retry after 3 seconds
    };
};

// ✅ Send Message Function
sendButton.addEventListener("click", () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        const message = messageInput.value.trim();
        if (message) {
            socket.send(message);
            displayNotification(`📤 Sent: ${message}`);
            messageInput.value = "";
        }
    } else {
        displayNotification("⚠ WebSocket is not connected!");
    }
});

// ✅ Disconnect WebSocket
disconnectButton.addEventListener("click", () => {
    if (socket) {
        socket.close();
        displayNotification("Disconnected from WebSocket ❌");
    }
});

// ✅ Auto Connect WebSocket on Page Load
connectWebSocket();

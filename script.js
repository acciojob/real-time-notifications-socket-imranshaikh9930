const statusDiv = document.getElementById("status");
const messageInput = https://www.svgrepo.com/show/345221/three-dots.svgdocument.getElementById("message-input");
const sendButton = dhttps://www.svgrepo.com/show/345221/three-dots.svgocument.getElementById("send-button");
const disconnectButton = document.getElementById("disconnect-button");
const notificationsDiv = document.getElementById("notifications");
const wsUrl = "wss://socketsbay.com/wss/v2/1/demo/"
let socket;

// Notification display function
const displayNotification = (message) => {
    const notificationElement = document.createElement("p");
    notificationElement.innerText = message;
    notificationsDiv.appendChild(notificationElement);
};

// WebSocket Connection Function
const connectWebSocket = () => {
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        console.log("Socket Connected");
        statusDiv.innerText = "Connected ✅";
		  messageInput.disabled = false;
        sendButton.disabled = false;
        disconnectButton.disabled = false;
        displayNotification("Connected to WebSocket Server");
    };

    socket.onmessage = (event) => {
        console.log("Received:", event.data);
        displayNotification(event.data);
    };

    socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
        displayNotification("WebSocket Error: Check console for details.");
    };

    socket.onclose = () => {
        console.warn("WebSocket Disconnected");
        statusDiv.innerText = "Disconnected ";
        displayNotification("WebSocket Disconnected. Reconnecting...");
        setTimeout(connectWebSocket, 3000); // Auto-reconnect after 3 seconds
    };
};

// Send Button Click Event
sendButton.addEventListener("click", () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(messageInput.value);
        displayNotification("Sent: " + messageInput.value);
        messageInput.value = ""; // Clear input field after sending
    } else {
        displayNotification("WebSocket is not connected!");
    }
});

// Disconnect Button Click Event
disconnectButton.addEventListener("click", () => {
    if (socket) {
        socket.close();
        displayNotification("Disconnected from WebSocket");
    }
});

// Connect WebSocket on page load
connectWebSocket();

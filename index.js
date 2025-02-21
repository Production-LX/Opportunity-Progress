const express = require("express");
const cors = require("cors");
const compression = require("compression");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }, // Allow all origins (modify as needed for security)
});

app.use(cors({ origin: "*" })); // Modify for security
app.use(express.json()); // Parse JSON from webhook
app.use(compression()); // Enable gzip compression

const cachedOpportunities = new Map(); // More efficient than an array

// Webhook route - handles Current RMS webhook events
app.post("/webhook/opportunities", (req, res) => {
    try {
        const { action, data } = req.body;

        if (!data?.id) {
            console.warn(`[${new Date().toISOString()}] Invalid webhook payload received`);
            return res.status(400).send("Invalid data");
        }

        console.log(`[${new Date().toISOString()}] Received '${action}' event for opportunity ID ${data.id}`);

        if (["created", "updated"].includes(action)) {
            cachedOpportunities.set(data.id, {
                id: data.id,
                name: data.subject,
                client: data.member?.name || "Unknown",
            });
        } else if (action === "deleted") {
            cachedOpportunities.delete(data.id);
        }

        // Broadcast update to all connected clients
        io.emit("opportunities_update", Array.from(cachedOpportunities.values()));

        res.status(200).send("Webhook received");
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Webhook processing error:`, error);
        res.status(500).send("Internal Server Error");
    }
});

// Endpoint for frontend to get cached opportunities
app.get("/api/opportunities", (req, res) => {
    res.json(Array.from(cachedOpportunities.values()));
});

// Middleware to serve static files
app.use(express.static("public"));

// Route to send the HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// Handle WebSocket connections
io.on("connection", (socket) => {
    console.log(`[${new Date().toISOString()}] New WebSocket client connected`);

    // Send current opportunities when a client connects
    socket.emit("opportunities_update", Array.from(cachedOpportunities.values()));

    socket.on("disconnect", () => {
        console.log(`[${new Date().toISOString()}] WebSocket client disconnected`);
    });
});

// Start the server
const PORT = process.env.PORT || 8003;
server.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown handling
process.on("SIGINT", () => {
    console.log("\nShutting down server...");
    server.close(() => {
        console.log("Server stopped.");
        process.exit(0);
    });
});

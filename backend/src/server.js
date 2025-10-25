import express from "express";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";

// Load env variables before any other code
dotenv.config();

const app = express();
const _dirname = path.resolve();

const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies (for POST requests)
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Health check endpoint with MongoDB status
app.get('/health', async (_, res) => {
    try {
        const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        res.json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            mongodb: {
                status: mongoStatus,
                host: mongoose.connection.host,
                database: mongoose.connection.name
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// make ready for deployment
if (process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(_dirname, "../frontend/dist")))

    app.get("*", (_,res) => {
        res.sendFile(path.join(_dirname, "../frontend", "dist", "index.html"));
    });
}


// Connect to MongoDB first, then start the server
try {
    await connectDB();
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
} catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
}
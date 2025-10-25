import mongoose from "mongoose"

export const connectDB = async () => {
    try {
        // Add connection listeners
        mongoose.connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        // Connect to MongoDB
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB Connected:', {
            host: conn.connection.host,
            port: conn.connection.port,
            name: conn.connection.name
        });

        return conn;
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    }
}
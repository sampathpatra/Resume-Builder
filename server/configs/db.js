import mongoose from "mongoose";

const connectDB = async () => {
    const mongodbURI = process.env.MONGODB_URL;

    if (!mongodbURI) {
        throw new Error("MONGODB_URL environment variable not set");
    }

    mongoose.connection.on("connected", () => {
        console.log("Connected to MongoDB");
    });

    try {
        await mongoose.connect(mongodbURI, {
            dbName: "resume-builder",
            serverSelectionTimeoutMS: 10000,
        });
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        throw error;
    }
};

export default connectDB;
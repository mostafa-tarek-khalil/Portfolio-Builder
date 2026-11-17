import mongoose from "mongoose";
import dotenv from "dotenv";
import dns from "node:dns";

dotenv.config();

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Atlas Connected Successfully");
    } catch (error) {
        console.log("MongoDB Atlas Connection Failed:", error.message);
        throw error;
    }
};

export default connectDB;

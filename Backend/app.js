import dotenv from "dotenv";
dotenv.config()
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth_routes.js"

const app = express();
// Middlewares
app.use(cors());
app.use(express.json());

// Base Route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Portfolio API",
        status: "Success"
    });
});

app.use("/", authRouter)

export default app;

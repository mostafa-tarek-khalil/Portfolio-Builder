import express from "express";

const app = express();

// Middlewares
app.use(express.json());

// Base Route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to Portfolio API",
        status: "Success"
    });
});

export default app;

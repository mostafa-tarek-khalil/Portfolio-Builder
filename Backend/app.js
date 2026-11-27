import dotenv from "dotenv";
dotenv.config()
import express from "express";
import User from "./models/user_model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import cors from "cors";

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

app.post("/register", async (req, res) => {
    try {
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            return res.status(400).json({
                status: "Failed",
                message: "Invalid Request Body"
            })
        }
        const { name, email, password } = req.body

        if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ status: "Failed", message: "Invalid Input Type" })
        }

        if (!name.trim() || !email.trim() || !password.trim()) {
            return res.status(400).json({ status: "Failed", message: "All Fields are required" })
        }
        const normalizedEmail = email.trim().toLowerCase()
        const user = await User.findOne({ email: normalizedEmail })

        if (user) {
            return res.status(409).json({ status: "Failed", message: "An account with this email already exists" })
        }

        const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

        const hashedPass = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPass
        })

        return res.status(201).json({
            status: "Success",
            message: "Account Created Successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })

    } catch (error) {

        console.log(error)

        return res.status(500).json({ status: "Failed", message: "Internal Server Error" })
    }
})

app.post("/login", async (req, res) => {
    try {
        if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
            return res.status(400).json({
                status: "Failed",
                message: "Invalid Request Body"
            })
        }
        const { email, password } = req.body
        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ status: "Failed", message: "Invalid Input Type" })
        }

        if (!email.trim() || !password.trim()) {
            return res.status(400).json({ status: "Failed", message: "All Fields are required" })
        }

        const normalizedEmail = email.trim().toLowerCase()

        const user = await User.findOne({ email: normalizedEmail })

        if (!user) {
            return res.status(401).json({ status: "Failed", message: "Email or Password is Invalid" })
        }

        const comparePass = await bcrypt.compare(password, user.password)

        if (!comparePass) {
            return res.status(401).json({ status: "Failed", message: "Email or Password is Invalid" })
        }

        const secretKey = process.env.SECRET_KEY

        const accessToken = jwt.sign({ id: user._id, name: user.name }, secretKey, { expiresIn: "1d" })

        return res.status(200).json({
            status: "Success",
            message: "Logged in successfully",
            token: accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        })

    } catch (error) {
        console.log(error)

        return res.status(500).json({ status: "Failed", message: "Internal Server Error" })
    }


})

export default app;

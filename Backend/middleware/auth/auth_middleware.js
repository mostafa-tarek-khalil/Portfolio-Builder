import jwt from "jsonwebtoken"
import User from "../../models/user_model.js"
export async function authentication(req, res, next) {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
            return res.status(401).json({
                status: "Failed",
                message: "Token must exist"
            });
        }
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ status: "Failed", message: "Token must exist" })
        }
        const secretKey = process.env.SECRET_KEY
        const auth = jwt.verify(token, secretKey)
        const user = await User.findById(auth.id).select("-password");
        if (!user) {
            return res.status(401).json({ status: "Failed", message: "User Doesn't Exist" })
        }

        req.user = user

        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({ status: "Failed", message: "Invalid or expired token" })
    }

}
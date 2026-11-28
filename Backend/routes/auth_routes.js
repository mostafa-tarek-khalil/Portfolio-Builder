import express from "express"
import {register, login, getProfile} from "../controllers/auth_controller.js"
import {authentication} from "../middleware/auth/auth_middleware.js"
const router = express.Router()

router.post("/register", register)
router.post("/login", login)
router.get("/profile", authentication, getProfile);

export default router
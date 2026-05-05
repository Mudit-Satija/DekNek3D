import express from "express";
import { getMe, loginUser, registerUser } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validateRequired } from "../middleware/validator.js";

const router = express.Router();

router.post("/register", validateRequired(["name", "email", "password"]), registerUser);
router.post("/login", validateRequired(["email", "password"]), loginUser);
router.get("/me", protect, getMe);

export default router;


import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/constants.js";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ message: "Not authorized, no token provided" });
	}

	try {
		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, JWT_SECRET);
		req.user = await User.findById(decoded.id).select("-password");

		if (!req.user) {
			return res.status(401).json({ message: "Not authorized, user not found" });
		}

		return next();
	} catch (error) {
		return res.status(401).json({ message: "Not authorized, token failed" });
	}
};


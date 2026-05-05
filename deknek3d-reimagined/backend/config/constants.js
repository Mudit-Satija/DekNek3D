import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/deknek3d";
export const JWT_SECRET = process.env.JWT_SECRET || "change-me-in-env";
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
export const CLIENT_URLS = (process.env.CLIENT_URLS || CLIENT_URL)
	.split(",")
	.map((item) => item.trim())
	.filter(Boolean);
export const MAX_UPLOAD_FILE_MB = Number(process.env.MAX_UPLOAD_FILE_MB || 25);


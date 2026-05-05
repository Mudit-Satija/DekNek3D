import mongoose from "mongoose";
import { MONGODB_URI } from "./constants.js";

export const connectDB = async () => {
	await mongoose.connect(MONGODB_URI);
	console.log("MongoDB connected");
};


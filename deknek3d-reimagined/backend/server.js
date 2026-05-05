import cors from "cors";
import express from "express";
import { connectDB } from "./config/db.js";
import { CLIENT_URLS, PORT } from "./config/constants.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import modelRoutes from "./routes/models.js";
import uploadRoutes from "./routes/upload.js";
import userRoutes from "./routes/users.js";

const app = express();

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin || CLIENT_URLS.includes(origin)) {
				return callback(null, true);
			}
			return callback(new Error("CORS not allowed for this origin"));
		},
		credentials: true,
	})
);
app.use(express.json());

app.get("/api/health", (req, res) => {
	res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/models", modelRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error("Failed to connect database:", error.message);
		process.exit(1);
	});

import multer from "multer";
import { MAX_UPLOAD_FILE_MB } from "../config/constants.js";

export const notFound = (req, res, next) => {
	const error = new Error(`Not Found - ${req.originalUrl}`);
	res.status(404);
	next(error);
};

export const errorHandler = (err, req, res, next) => {
	if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
		return res.status(400).json({
			message: `File too large. Max allowed is ${MAX_UPLOAD_FILE_MB} MB`,
			stack: process.env.NODE_ENV === "production" ? null : err.stack,
		});
	}

	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode).json({
		message: err.message,
		stack: process.env.NODE_ENV === "production" ? null : err.stack,
	});
};


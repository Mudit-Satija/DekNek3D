import multer from "multer";
import { MAX_UPLOAD_FILE_MB } from "../config/constants.js";

const storage = multer.memoryStorage();

const allowedMimeTypes = new Set([
	"model/gltf-binary",
	"model/gltf+json",
	"application/octet-stream",
	"application/json",
]);

const fileFilter = (req, file, cb) => {
	if (allowedMimeTypes.has(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("Only GLB/GLTF files are allowed"));
	}
};

export const upload = multer({
	storage,
	fileFilter,
	limits: { fileSize: MAX_UPLOAD_FILE_MB * 1024 * 1024 },
});


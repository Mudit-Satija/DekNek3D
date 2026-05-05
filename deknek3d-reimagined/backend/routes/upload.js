import express from "express";
import { uploadModelFile } from "../controllers/uploadController.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/model", protect, upload.single("modelFile"), uploadModelFile);

export default router;


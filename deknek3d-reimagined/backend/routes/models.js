import express from "express";
import { createModel, getModelById, getModels } from "../controllers/modelController.js";
import { protect } from "../middleware/auth.js";
import { validateRequired } from "../middleware/validator.js";

const router = express.Router();

router.get("/", getModels);
router.get("/:id", getModelById);
router.post("/", protect, validateRequired(["title", "fileUrl"]), createModel);

export default router;


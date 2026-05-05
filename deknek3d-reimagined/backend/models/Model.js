import mongoose from "mongoose";

const modelSchema = new mongoose.Schema(
	{
		title: { type: String, required: true, trim: true },
		description: { type: String, default: "" },
		fileUrl: { type: String, required: true },
		thumbnailUrl: { type: String, default: "" },
		owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		tags: [{ type: String, trim: true }],
	},
	{ timestamps: true }
);

const Model = mongoose.model("Model", modelSchema);

export default Model;


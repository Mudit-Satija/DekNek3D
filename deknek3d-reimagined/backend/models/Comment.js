import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		model: { type: mongoose.Schema.Types.ObjectId, ref: "Model", required: true },
		text: { type: String, required: true, trim: true, maxlength: 500 },
	},
	{ timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;


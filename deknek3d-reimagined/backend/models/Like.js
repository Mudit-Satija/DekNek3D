import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		model: { type: mongoose.Schema.Types.ObjectId, ref: "Model", required: true },
	},
	{ timestamps: true }
);

likeSchema.index({ user: 1, model: 1 }, { unique: true });

const Like = mongoose.model("Like", likeSchema);

export default Like;


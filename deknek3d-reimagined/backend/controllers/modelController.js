import Model from "../models/Model.js";

export const getModels = async (req, res, next) => {
	try {
		const models = await Model.find().populate("owner", "name email").sort({ createdAt: -1 });
		return res.json(models);
	} catch (error) {
		return next(error);
	}
};

export const getModelById = async (req, res, next) => {
	try {
		const model = await Model.findById(req.params.id).populate("owner", "name email");

		if (!model) {
			res.status(404);
			throw new Error("Model not found");
		}

		return res.json(model);
	} catch (error) {
		return next(error);
	}
};

export const createModel = async (req, res, next) => {
	try {
		const { title, description, fileUrl, thumbnailUrl, tags } = req.body;

		const model = await Model.create({
			title,
			description,
			fileUrl,
			thumbnailUrl,
			owner: req.user._id,
			tags: Array.isArray(tags) ? tags : [],
		});

		return res.status(201).json(model);
	} catch (error) {
		return next(error);
	}
};


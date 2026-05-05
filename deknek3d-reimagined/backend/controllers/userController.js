import User from "../models/User.js";

export const getUserProfile = async (req, res, next) => {
	try {
		const user = await User.findById(req.user._id).select("-password");

		if (!user) {
			res.status(404);
			throw new Error("User not found");
		}

		return res.json(user);
	} catch (error) {
		return next(error);
	}
};


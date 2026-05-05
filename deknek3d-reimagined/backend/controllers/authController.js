import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const registerUser = async (req, res, next) => {
	try {
		const { name, email, password } = req.body;

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			res.status(400);
			throw new Error("User already exists");
		}

		const user = await User.create({ name, email, password });

		return res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			token: generateToken(user._id),
		});
	} catch (error) {
		return next(error);
	}
};

export const loginUser = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (!user || !(await user.matchPassword(password))) {
			res.status(401);
			throw new Error("Invalid email or password");
		}

		return res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			token: generateToken(user._id),
		});
	} catch (error) {
		return next(error);
	}
};

export const getMe = async (req, res) => {
	return res.json(req.user);
};


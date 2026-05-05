import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (fileBuffer, originalname) =>
	new Promise((resolve, reject) => {
		const uploadStream = cloudinary.uploader.upload_stream(
			{
				resource_type: "raw",
				folder: "deknek3d/models",
				public_id: originalname.replace(/\.[^/.]+$/, ""),
			},
			(error, result) => {
				if (error) return reject(error);
				return resolve(result);
			}
		);

		uploadStream.end(fileBuffer);
	});

export const uploadModelFile = async (req, res, next) => {
	try {
		if (!req.file) {
			res.status(400);
			throw new Error("No file uploaded");
		}

		const hasCloudinaryConfig =
			process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;

		if (!hasCloudinaryConfig) {
			return res.status(200).json({
				message: "Cloudinary not configured. Add credentials in .env to enable uploads.",
			});
		}

		const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);

		return res.status(201).json({
			message: "Upload successful",
			url: result.secure_url,
			publicId: result.public_id,
		});
	} catch (error) {
		return next(error);
	}
};


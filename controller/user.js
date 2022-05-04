const User = require("../model/user");
const cloudinary = require("../cloudinary");

exports.getUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.userId).select("-password");
		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};

exports.updateUser = async (req, res, next) => {
	try {
		const { id } = req.user;

		const profilePicture = req.file;

		const user = await User.findById(id);

		let imageResponses;

		if (profilePicture !== undefined) {
			if (user.image.public) {
				await cloudinary.uploader.destroy(user.image.public);
			}

			imageResponses = await cloudinary.uploader.upload(profilePicture.path);
		}

		console.log(imageResponses);
		const updatedUser = await User.findByIdAndUpdate(
			id,
			{
				name: req.body.name,
				image: {
					res:
						imageResponses === undefined ? user.image.res : imageResponses.url,
					public:
						imageResponses === undefined
							? user.image.public
							: imageResponses.public_id,
				},
			},
			{
				new: true,
			}
		);
		res.status(200).json({
			success: true,
			data: updatedUser,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};

exports.deleteUser = async (req, res, next) => {
	try {
		const { id } = req.user;

		const user = await User.findById(id);

		if (user.image.public) {
			await cloudinary.uploader.destroy(user.image.public);
		}

		await User.findByIdAndDelete(id);

		res.status(200).json({
			success: true,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json({
			error: err,
		});
	}
};

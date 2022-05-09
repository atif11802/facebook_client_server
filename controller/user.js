const User = require("../model/user");
const cloudinary = require("../cloudinary");
const bcrypt = require("bcrypt");

exports.getUser = async (req, res, next) => {
	try {
		const user = await User.findById(req.params.userId)
			.select("-password")
			.populate("friendReqReceived", "-password")
			.populate("friendReqSent", "-password")
			.populate("friends", "-password");

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

		let profilePicture;
		if (req.files.profilePicture) {
			profilePicture = req.files.profilePicture[0];
		}

		const user = await User.findById(id);

		let imageResponses;

		if (profilePicture !== undefined) {
			if (user.image.public) {
				await cloudinary.uploader.destroy(user.image.public);
			}

			imageResponses = await cloudinary.uploader.upload(profilePicture.path);
		}

		let coverPicture;

		if (req.files.coverPicture) {
			coverPicture = req.files.coverPicture[0];
		}

		let coverImageResponses;

		if (coverPicture !== undefined) {
			if (user.coverPhoto.public) {
				await cloudinary.uploader.destroy(user.coverPhoto.public);
			}
			coverImageResponses = await cloudinary.uploader.upload(coverPicture.path);
		}

		const updatedUser = await User.findByIdAndUpdate(
			id,
			{
				name: req.body.name,
				email: req.body.email,
				password:
					req.body.password && (await bcrypt.hash(req.body.password, 12)),
				image: {
					res:
						imageResponses === undefined ? user.image.res : imageResponses.url,
					public:
						imageResponses === undefined
							? user.image.public
							: imageResponses.public_id,
				},
				coverPhoto: {
					res:
						coverImageResponses === undefined
							? user.coverPhoto.res
							: coverImageResponses.url,
					public:
						coverImageResponses === undefined
							? user.coverPhoto.public
							: coverImageResponses.public_id,
				},
			},
			{
				new: true,
			}
		).select("-password");

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

exports.about = async (req, res, next) => {
	try {
		const { id } = req.user;

		const user = await User.findById(id);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		user.about = req.body.about;

		const data = await user.save();

		data.password = undefined;

		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
};

exports.FriendReqSent = async (req, res, next) => {
	const { id } = req.user;
	const { userId } = req.body;

	try {
		if (!userId) {
			return res.status(400).json({
				success: false,
			});
		}
		const user = await User.findByIdAndUpdate(
			id,
			{
				$push: {
					friendReqSent: userId,
				},
			},
			{
				new: true,
			}
		).populate("friendReqSent", "-password");
		const SentReq = await User.findByIdAndUpdate(
			userId,
			{
				$push: {
					friendReqReceived: id,
				},
			},
			{
				new: true,
			}
		).populate("friendReqReceived", "-password");
		user.password = undefined;
		res.status(200).json({
			success: true,
			data: user,
		});
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
};

exports.frndreq = async (req, res, next) => {
	const { id } = req.user;
	const { userId } = req.body;

	try {
		console.log(userId, id);

		if (!userId) {
			return res.status(400).json({
				success: false,
			});
		}
		const user = await User.findByIdAndUpdate(
			id,
			{
				$pull: {
					friendReqSent: userId,
				},
				$pull: {
					friendReqReceived: userId,
				},
				$push: {
					friends: userId,
				},
			},
			{ new: true }
		).populate("friends", "-password");

		const friend = await User.findByIdAndUpdate(
			userId,
			{
				$pull: {
					friendReqReceived: id,
				},
				$pull: {
					friendReqSent: id,
				},
				$push: {
					friends: id,
				},
			},
			{
				new: true,
			}
		).populate("friends", "-password");

		res.status(200).json({
			user,
			success: true,
		});
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
};

exports.searchUser = async (req, res, next) => {
	try {
		const { search } = req.query;
		const users = await User.find({
			name: { $regex: search, $options: "i" },
		}).select("-password");

		res.status(200).json({
			success: true,
			data: users,
		});
	} catch (err) {
		res.status(500).json({
			error: err,
		});
	}
};

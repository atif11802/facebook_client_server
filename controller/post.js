const Post = require("../model/post");
const cloudinary = require("../cloudinary");

exports.addPost = async (req, res) => {
	const { id } = req.user;
	const { body } = req.body;

	console.log(body);

	try {
		const postPictures = req.files;

		let multiplePicturePromise = postPictures.map((picture) =>
			cloudinary.uploader.upload(picture.path)
		);
		let imageResponses = await Promise.all(multiplePicturePromise);
		// res.status(200).json({ images: imageResponses });
		const images = imageResponses.map((image) => {
			let obj = {};
			obj.res = image.url;
			obj.public = image.public_id;
			return obj;
			// return ({ public_id, secure_url } = image);
		});

		const post = await Post.create({
			body,
			images,
			postedBy: id,
		});
		res.json({
			success: true,
			data: post,
		});
	} catch (err) {
		res.status(400).json({
			err,
		});
	}
};

exports.getOwnPost = async (req, res) => {
	const { userId } = req.params;
	try {
		const post = await Post.find({ postedBy: userId })
			.sort({ createdAt: -1 })
			.populate("postedBy", "_id name")
			.populate("comments.commentedBy", "_id name");

		res.json({
			success: true,
			data: post,
		});
	} catch (err) {
		res.status(400).json({
			err,
		});
	}
};

exports.updatepost = async (req, res) => {
	const { id } = req.user;
	const { postId } = req.params;
	const { body } = req.body;
	try {
		if (body.length === 0) {
			return res.status(400).json({
				success: false,
				message: "Post cannot be empty",
			});
		}

		const post = await Post.findById(postId);

		post.images.map(async (picture) => {
			await cloudinary.uploader.destroy(picture.public);
		});

		const postPictures = req.files;

		let multiplePicturePromise = postPictures.map(
			async (picture) => await cloudinary.uploader.upload(picture.path)
		);
		let imageResponses = await Promise.all(multiplePicturePromise);
		// res.status(200).json({ images: imageResponses });
		const images = imageResponses.map((image) => {
			let obj = {};
			obj.res = image.url;
			obj.public = image.public_id;
			return obj;
			// return ({ public_id, secure_url } = image);
		});

		const updatedPost = await Post.findByIdAndUpdate(
			postId,
			{
				body,
				images,
				postedBy: id,
			},
			{
				new: true,
			}
		);

		res.json({
			success: true,
			data: updatedPost,
		});
	} catch (err) {
		res.status(400).json({
			err,
		});
	}
};

exports.deletePost = async (req, res) => {
	const { id } = req.user;
	const { postId } = req.params;
	try {
		const post = await Post.findOneAndDelete({ _id: postId, postedBy: id });
		res.json({
			success: true,
			data: post,
		});
	} catch (err) {
		res.status(400).json({
			err,
		});
	}
};

exports.getAllPost = async (req, res) => {
	const { friendsId } = req.body;

	const { id } = req.user;

	try {
		const post = await Post.find({ postedBy: { $in: friendsId.concat(id) } })
			.sort({ createdAt: -1 })
			.populate("postedBy", "_id name")
			.populate("comments.commentedBy", "_id name");
		res.json({
			success: true,
			data: post,
		});
	} catch (err) {
		res.status(400).json({
			err,
		});
	}
};

exports.likePost = async (req, res) => {
	const { id } = req.user;
	const { postId } = req.params;

	try {
		const post = await Post.findById(postId);

		if (post.likes.filter((like) => like.toString() === id).length > 0) {
			Post.findByIdAndUpdate(
				postId,
				{ $pull: { likes: id } },
				{ new: true }
			).exec((err, result) => {
				if (err) {
					return res.status(400).json({
						err,
					});
				}
				return res.status(200).json(result);
			});
		} else {
			Post.findByIdAndUpdate(
				postId,
				{ $push: { likes: id } },
				{ new: true }
			).exec((err, result) => {
				if (err) {
					return res.status(400).json({
						err,
					});
				}
				return res.status(200).json(result);
			});
		}
	} catch (err) {
		return res.status(400).json({
			err,
		});
	}
};

exports.commentPost = async (req, res) => {
	const { id } = req.user;
	const { postId } = req.params;
	const { body } = req.body;

	try {
		if (body.length === 0) {
			return res.status(400).json({
				success: false,
				message: "Comment cannot be empty",
			});
		}

		const post = await Post.findById(postId);
		if (!post) {
			return res.status(400).json({
				success: false,
				message: "Post not found",
			});
		}

		const comment = {
			text: body,
			commentedBy: id,
		};

		post.comments.push(comment);

		await post.save();

		res.json({
			success: true,
			data: post,
		});
	} catch (err) {
		res.status(400).json({
			err,
		});
	}
};

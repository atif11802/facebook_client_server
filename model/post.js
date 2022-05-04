const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
	{
		body: {
			type: String,
		},
		postedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		images: [
			{
				res: {
					type: String,
				},
				public: {
					type: String,
				},
			},
		],
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		comments: [
			{
				text: String,
				createdAt: { type: Date, default: Date.now },
				commentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Post", postSchema);

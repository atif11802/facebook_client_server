const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		messages: [
			{
				message: String,
				// meta: [
				// 	{
				// 		user: {
				// 			type: mongoose.Schema.Types.ObjectId,
				// 			ref: "User",
				// 		},
				// 		delivered: Boolean,
				// 		read: Boolean,
				// 	},
				// ],
			},
		],
		is_group_message: { type: Boolean, default: false },
		participants: [
			{
				user: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
				delivered: Boolean,
				read: Boolean,
				last_seen: Date,
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);

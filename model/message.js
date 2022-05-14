const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
	{
		message: {
			type: String,
			trim: true,
		},
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		chat: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Chat",
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Message", messageSchema);

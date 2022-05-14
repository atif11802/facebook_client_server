const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
	{
		participants: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		messages: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Message",
			},
		],
		isGroupChat: {
			type: Boolean,
			default: false,
		},
		roomName: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Chat", chatSchema);

const Chat = require("../model/chat");
const Message = require("../model/message");
const mongoose = require("mongoose");

exports.makeChat = async (req, res) => {
	const { id } = req.user;
	try {
		const { participants, isGroupChat, roomName } = req.body;

		let chat = await Chat
			// findOne({ participants })
			// .findOne({ participants })
			// .find({
			// 	participants: { $in: [participants[0], participants[1]] },
			// })
			// .findOne({
			// 	participants: {
			// 		$in: [
			// 			mongoose.Types.ObjectId(participants[0]),
			// 			mongoose.Types.ObjectId(participants[1]),
			// 		],
			// 	},
			// })
			.findOne({
				participants: {
					$all: [
						mongoose.Types.ObjectId(participants[0]),
						mongoose.Types.ObjectId(participants[1]),
					],
				},
			})
			// .populate("participants")
			.populate("messages")
			.populate({
				path: "messages",
				// Get friends of friends - populate the 'friends' array for every friend
				populate: { path: "sender", select: "-password" },
			});
		// console.log(chat);

		if (!chat) {
			chat = await Chat.create({ participants, isGroupChat, roomName });
			// const message = await Message.create({
			// 	message: "Welcome to the chat room!",
			// 	sender: id,
			// 	chat: chat._id,
			// });
			// chat.messages.push(message._id);
			chat.save();
		}
		res.send(chat);
	} catch (err) {
		console.log(err);
		res.status(500).json({
			status: "error",
			message: err.message,
		});
	}
};

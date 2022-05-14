const Chat = require("../model/chat");
const Message = require("../model/message");

exports.makeChat = async (req, res) => {
	const { id } = req.user;
	try {
		const { participants, isGroupChat, roomName } = req.body;
		let chat = await Chat.findOne({ participants });
		if (!chat) {
			chat = await Chat.create({ participants, isGroupChat, roomName });
			const message = await Message.create({
				message: "Welcome to the chat room!",
				sender: id,
				chat: chat._id,
			});
			chat.messages.push(message._id);
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

const Message = require("../model/message");

// Create and Save a new Message
exports.create = async (req, res) => {
	const { id } = req.user;
	try {
		const { message, chat } = req.body;
		// console.log(chat, message);

		// const newMessage = new Message({
		// 	message,
		// 	sender: id,
		// 	chat,
		// });

		// const savedMessage = await newMessage.save();

		const savedMessage = await Message.create({
			message,
			sender: id,
			chat,
		});

		// console.log(savedMessage);

		res.status(200).json(savedMessage);
	} catch (err) {
		res.status(500).send(err);
	}
};

// Retrieve all Messages from the database.
exports.getAllMessages = async (req, res) => {
	try {
		const messages = await Message.find({
			chat: req.params.chatId,
		}).populate("sender", "-password");
		res.status(200).json(messages);
	} catch (err) {
		res.status(500).send(err);
	}
};

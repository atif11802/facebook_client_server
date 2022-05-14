const Message = require("../model/message");

// Create and Save a new Message
exports.create = async (req, res) => {
	const { id } = req.user;
	try {
		const { message, chat } = req.body;

		const newMessage = new Message({
			message,
			sender: id,
			chat,
		});

		const savedMessage = await newMessage.save();

		res.status(200).json(savedMessage);
	} catch (err) {
		res.status(500).send(err);
	}
};

const User = require("../model/user");
const { generateToken } = require("../config/token");

exports.signup = async (req, res) => {
	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		return res.status(400).json({
			msg: "Please enter all fields",
		});
	}

	try {
		const user = await User.findOne({ email });

		if (user) {
			return res.status(400).json({
				msg: "User already exists",
			});
		}

		const newUser = await User.create({
			name,
			email,
			password,
		});

		let token = await generateToken(newUser._id);

		newUser.password = undefined;

		res.status(201).json({
			user: newUser,
			token,
		});
	} catch (err) {
		res.status(400).json({
			error: err,
		});
	}
};

exports.signin = async (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json({
			msg: "Please enter all fields",
		});
	}

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				msg: "User does not exist",
			});
		}

		const isMatch = await user.matchPassword(password);
		if (!isMatch) {
			return res.status(400).json({
				msg: "Invalid credentials",
			});
		}

		let token = await generateToken(user._id);

		user.password = undefined;

		res.status(200).json({
			user,
			token,
		});
	} catch (err) {
		res.status(400).json({
			error: err,
		});
	}
};

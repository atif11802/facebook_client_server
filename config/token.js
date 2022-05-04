const jwt = require("jsonwebtoken");

exports.generateToken = async (id) => {
	const token = await jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});

	return token;
};

exports.requireSignin = async (req, res, next) => {
	let token = req.headers.authorization;

	if (!token) {
		return res.status(400).json({ err: "token required" });
	}
	token = token.replace("Bearer ", "").trim();

	try {
		var decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;

		next();
	} catch (err) {
		return res.status(401).json({ err: "token is not valid" });
	}
};

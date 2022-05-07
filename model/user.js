const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		about: {
			type: String,
		},
		image: {
			res: {
				type: String,
			},
			public: {
				type: String,
			},
		},
		coverPhoto: {
			res: {
				type: String,
			},
			public: {
				type: String,
			},
		},
		shared: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Post",
			},
		],
		friendReqSent: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		friendReqReceived: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		friends: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{
		timestamps: true,
	}
);

userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 12);
	}
	next();
});

userSchema.methods.matchPassword = async function (password) {
	const match = await bcrypt.compare(password, this.password);
	return match;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

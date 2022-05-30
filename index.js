require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const connectDB = require("./db/db");
const authRoutes = require("./router/auth");
const postRoutes = require("./router/post");
const userRoutes = require("./router/user");
const chatRoutes = require("./router/chat");
const messageRoutes = require("./router/message");
const cors = require("cors");
const bodyParser = require("body-parser");

const http = require("http");
const { addUser, removeUser } = require("./user");

const server = http.createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});

// Connect to MongoDB
connectDB();

app.use(express.json());

app.get("/okay", (req, res) => {
	res.send("okay");
});

app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

io.on("connection", (socket) => {
	socket.on("join", ({ room, userId }) => {
		const { user, error } = addUser({ id: socket.id, room, userId });
		if (error) {
			return callback(error);
		}

		socket.join(user.room);
		console.log(user, "user");
		// socket.broadcast.to(user.room).emit("message", {
		// 	_id: "admin",
		// 	message: `${user.userId} has joined!`,
		// });
		// socket.emit("message", {
		// 	_id: "admin",
		// 	message: `${user.userId}, welcome to ${user.room}`,
		// });
	});

	socket.on("disconnect", () => {
		const removedUser = removeUser(socket.id);
	});
});

server.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

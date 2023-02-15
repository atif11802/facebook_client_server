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
const { addUser, removeUser, getUser, getUsersInRoom } = require("./user");

const server = http.createServer(app);
const io = require("socket.io")(server, {
	cors: {
		origin: "*",
	},
});

// Connect to MongoDB
connectDB();

app.use(express.json());

app.get("/", (req, res) => {
	res.send("okay");
});

const corsOptions = {
	origin: "*",
	credentials: true, //access-control-allow-credentials:true
	optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
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

		// console.log(`${user.userId} has joined ${user.room}`);
		socket.join(user.room);

		socket.to(user.room).emit("roomData", {
			users: getUsersInRoom(user.room),
		});

		// socket.broadcast.to(user.room).emit("msg", {
		// 	_id: "admin",
		// 	message: `${user.userId} has joined!`,
		// });
		// socket.emit("msg", {
		// 	_id: "admin",
		// 	message: `${user.userId}, welcome to ${user.room}`,
		// });
	});

	socket.on("sendMessage", (message) => {
		const user = getUser(socket.id);
		// console.log(message);
		// console.log(user);
		// console.log(`${user.userId} dd ${user.room}`);
		// socket.in(user.room).emit("msg", {
		// 	_id: user.userId,
		// 	sender: message.sender,
		// 	message: message.message,
		// });

		io.in(user.room).emit("msg", {
			_id: user.userId,
			sender: message.sender,
			message: message.message,
		});
	});

	socket.on("disconnect", () => {
		const removedUser = removeUser(socket.id);
	});
});

server.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

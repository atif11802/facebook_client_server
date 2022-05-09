require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const connectDB = require("./db/db");
const authRoutes = require("./router/auth");
const postRoutes = require("./router/post");
const userRoutes = require("./router/user");
const cors = require("cors");
const bodyParser = require("body-parser");

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

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

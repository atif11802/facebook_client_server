const express = require("express");
const { makeChat } = require("../controller/chat");
const router = express.Router();
const { requireSignin } = require("../config/token");

router.post("/sendchat", requireSignin, makeChat);

module.exports = router;

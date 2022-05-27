const express = require("express");
const router = express.Router();
const { requireSignin } = require("../config/token");
const { create, getAllMessages } = require("../controller/message");

router.post("/sendMessage", requireSignin, create);
router.get("/getMessage/:chatId", requireSignin, getAllMessages);

module.exports = router;

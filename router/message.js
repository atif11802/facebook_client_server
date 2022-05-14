const express = require("express");
const router = express.Router();
const { requireSignin } = require("../config/token");
const { create } = require("../controller/message");

router.post("/sendMessage", requireSignin, create);

module.exports = router;

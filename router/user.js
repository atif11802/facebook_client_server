const router = require("express").Router();
const { getUser, updateUser, deleteUser } = require("../controller/user");
const { requireSignin } = require("../config/token");
const upload = require("../multer");

//getuser
router.get("/:userId", getUser);
router.patch(
	"/updateUser",
	requireSignin,
	upload.single("profilePicture"),
	updateUser
);
router.delete("/deleteUser", requireSignin, deleteUser);

module.exports = router;

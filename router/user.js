const router = require("express").Router();
const {
	getUser,
	updateUser,
	deleteUser,
	about,
	FriendReqSent,

	frndreq,
} = require("../controller/user");
const { requireSignin } = require("../config/token");
const upload = require("../multer");

//getuser
router.get("/:userId", getUser);
router.patch(
	"/updateUser",
	requireSignin,
	// upload.("profilePicture"),
	upload.fields([
		{ name: "profilePicture", maxCount: 1 },
		{ name: "coverPicture", maxCount: 1 },
	]),
	updateUser
);
router.delete("/deleteUser", requireSignin, deleteUser);
router.patch("/about", requireSignin, about);
router.patch("/freindRequestSent", requireSignin, FriendReqSent);
router.patch("/acceptreq", requireSignin, frndreq);

module.exports = router;

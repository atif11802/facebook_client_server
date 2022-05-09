const { requireSignin } = require("../config/token");
const {
	addPost,
	getOwnPost,
	updatepost,
	deletePost,
	getAllPost,
	likePost,
	commentPost,
} = require("../controller/post");
const router = require("express").Router();
const upload = require("../multer");

router.post(
	"/addPost",
	requireSignin,
	upload.array("postPictures", 12),
	addPost
);
router.get("/getOwnPost/:userId", requireSignin, getOwnPost);
router.patch(
	"/updatePost/:postId",
	requireSignin,
	upload.array("postPictures", 12),
	updatepost
);
router.delete("/deletePost/:postId", requireSignin, deletePost);
router.post("/getAllPost/", requireSignin, getAllPost);
router.patch("/likePost/:postId", requireSignin, likePost);
router.patch("/commentPost/:postId", requireSignin, commentPost);

module.exports = router;

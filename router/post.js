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
router.get("/getOwnPost", requireSignin, getOwnPost);
router.patch(
	"/updatePost/:postId",
	requireSignin,
	upload.array("postPictures", 12),
	updatepost
);
router.delete("/deletePost/:postId", requireSignin, deletePost);
router.get("/getAllPost", requireSignin, getAllPost);
router.patch("/likePost/:postId", requireSignin, likePost);
router.patch("/commentPost/:postId", requireSignin, commentPost);

module.exports = router;

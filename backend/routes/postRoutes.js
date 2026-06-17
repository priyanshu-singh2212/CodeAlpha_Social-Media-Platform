const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const { createPost, getAllPosts,likePost,addComment} = require("../controllers/postController");


// Create Post Route
router.post(
  "/",
  auth,
  upload.single("image"),
  createPost
);
// Get All Posts
router.get("/", getAllPosts);
// Like Post
router.put("/:id/like", auth, likePost);
// Add Comment
router.post("/:id/comment", auth, addComment);
module.exports = router;

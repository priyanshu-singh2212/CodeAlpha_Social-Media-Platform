const Post = require("../models/Post");

// Create Post
const createPost = async (req, res) => {
  try {

    const post = new Post({
      user: req.user.id,
      content: req.body.content,

      image: req.file
        ? `/uploads/${req.file.filename}`
        : ""
    });

    await post.save();

    res.status(201).json({
      message: "Post created successfully",
      post
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};
// Get all posts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);

  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};
// Like Post
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Post nahi mili
    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // User ne pehle se like kiya hai ya nahi
    if (post.likes.includes(req.user.id)) {
      return res.status(400).json({
        message: "Post already liked"
      });
    }

    // Like add karna
    post.likes.push(req.user.id);

    await post.save();

    res.status(200).json({
      message: "Post liked successfully",
      likes: post.likes
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
}
};
 // Add Comment Controller
const addComment = async (req, res) => {
  try {
    // URL se post ID lekar post find karna
    const post = await Post.findById(req.params.id);

    // Agar post nahi mili
    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    // Naya comment object banana
    const comment = {
      user: req.user.id,
      text: req.body.text
    };

    // Comment ko post ke comments array me add karna
    post.comments.push(comment);

    // Updated post ko database me save karna
    await post.save();

    // Success response
    res.status(200).json({
      message: "Comment added successfully",
      post
    });

  } catch (error) {
    // Agar koi error aaye
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  likePost,
  addComment
};
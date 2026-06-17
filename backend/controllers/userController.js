const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
// Register User
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    // Password hash karna
    const hashedPassword = await bcrypt.hash(password, 10);

    // New user create karna
    const user = new User({
      username,
      email,
      password: hashedPassword
    });

    // Database me save karna
    await user.save();

    res.status(201).json({
      message: "User registered successfully"
    });

  } catch (error) {
  console.error("ERROR:", error);

  res.status(500).json({
    message: error.message
  });
}
};


// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // User email se find karo
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // Password check karo
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password"
      });
    }

    // JWT Token generate karna
const token = jwt.sign(
  { id: user._id },
  "mySecretKey",
  { expiresIn: "7d" }
);

// Login successful response
res.status(200).json({
  message: "Login successful",
  token
});

  } catch (error) {
  console.error("ERROR:", error);

  res.status(500).json({
    message: error.message
  });
}
};
// Get User Profile
const Post = require("../models/Post");

const getProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    const user = await User.findById(userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // User ke posts count
    const postCount = await Post.countDocuments({
      user: userId
    });

    res.status(200).json({
      ...user._doc,
      postCount
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};
// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password");

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};
// Follow User
const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);

    if (!userToFollow) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const currentUser = await User.findById(req.user.id);

    // Khud ko follow nahi kar sakte
    if (currentUser._id.toString() === userToFollow._id.toString()) {
      return res.status(400).json({
        message: "You cannot follow yourself"
      });
    }

    // Already follow check
    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({
        message: "Already following this user"
      });
    }

    // Following and followers update
    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({
      message: "User followed successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};
// Unfollow User
const unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);

    if (!userToUnfollow) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const currentUser = await User.findById(req.user.id);

    // Check if user is following
    if (!currentUser.following.includes(userToUnfollow._id)) {
      return res.status(400).json({
        message: "You are not following this user"
      });
    }

    // Remove from following
    currentUser.following = currentUser.following.filter(
      (id) => id.toString() !== userToUnfollow._id.toString()
    );

    // Remove from followers
    userToUnfollow.followers = userToUnfollow.followers.filter(
      (id) => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({
      message: "User unfollowed successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
};
const uploadProfileImage = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.profileImage = `/uploads/${req.file.filename}`;

    await user.save();

    res.status(200).json({
      message: "Profile image uploaded successfully",
      profileImage: user.profileImage
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// Export functions
module.exports = {
  registerUser,
  loginUser,
  getProfile,
  getAllUsers,
  followUser,
  unfollowUser,
  uploadProfileImage
};
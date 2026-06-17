const upload = require("../middleware/upload");
const express = require("express");
const router = express.Router();


const { registerUser, loginUser,getProfile,getAllUsers,followUser,unfollowUser,uploadProfileImage} = require("../controllers/userController");
const auth = require("../middleware/auth");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", auth, getProfile);
router.get("/", auth, getAllUsers);
router.put("/follow/:id", auth, followUser);
router.put("/unfollow/:id", auth, unfollowUser);
router.put(
  "/profile-image",
  auth,
  upload.single("profileImage"),
  uploadProfileImage
);
module.exports = router;

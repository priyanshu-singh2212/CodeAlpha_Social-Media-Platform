require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const app = express();
connectDB();
app.use(cors());
app.use(express.json());
const path = require("path");
// Uploads folder serve karne ke liye
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
const PORT = 5000;

// Test Route
app.get("/", (req, res) => {
  res.send("Social Media API is Running...");
});

// Server Start
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
const express = require('express');
const router = express.Router();
const Post = require("../models/Post"); // Post 모델 import

// POST /api/posts → 블로그 글 생성
router.post("/", async (req, res) => {
  try {
    console.log("✅ POST request received:", req.body);

    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
    });

    const savedPost = await newPost.save();

    res.status(201).json({
      message: "Post created successfully!",
      post: savedPost,
    });
  } catch (error) {
    console.error("❌ Error saving post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// routes/posts.js
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});
module.exports = router;

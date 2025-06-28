const express = require('express');
const router = express.Router();
const Post = require("../models/Post"); // Post 모델 import

// POST /api/posts
router.post("/", async (req, res) => {
  const { title, content } = req.body;

  // ✅ 유효성 검사
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required." });
  }

  if (!content || content.trim().length < 20) {
    return res.status(400).json({ error: "Content must be at least 20 characters long." });
  }

  try {
    const newPost = new Post({ title, content });
    const savedPost = await newPost.save();
    res.status(201).json({ message: "Post created successfully!", post: savedPost });
  } catch (error) {
    console.error("❌ Error creating post:", error);
    res.status(500).json({ error: "Failed to create post." });
  }
});


// DELETE /api/posts/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json({ message: "Post deleted successfully", deletedPost });
  } catch (error) {
    console.error("❌ Error deleting post:", error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// PUT /api/posts/:id
router.put("/:id", async (req, res) => {
  const { title, content } = req.body;

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content },
      { new: true } // 업데이트된 문서를 반환
    );

    if (!updatedPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ message: "Post updated successfully", updatedPost });
  } catch (error) {
    console.error("❌ Error updating post:", error);
    res.status(500).json({ error: "Failed to update post" });
  }
});

// GET /api/posts/:id
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    console.error("❌ Error fetching post by ID:", error);
    res.status(500).json({ error: "Failed to fetch post" });
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

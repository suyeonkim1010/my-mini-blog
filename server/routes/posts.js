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

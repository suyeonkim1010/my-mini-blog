const express = require('express');
const router = express.Router();
const Post = require("../models/Post"); // Post 모델 import
const mongoose = require("mongoose");


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
  const { id } = req.params;

  // ✅ Step 1: 유효한 ObjectId인지 확인
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid post ID." });
  }

  try {
    // ✅ Step 2: 삭제 시도
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found." });
    }

    // ✅ Step 3: 삭제 성공
    res.json({ message: "Post deleted successfully", deletedPost });
  } catch (err) {
    res.status(500).json({ error: "Server error while deleting post" });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;

  // ✅ ID 형식 유효성 검사 추가
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid post ID.' });
  }

  const { title, content } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required.' });
  }

  if (!content || content.length < 20) {
    return res.status(400).json({ error: 'Content must be at least 20 characters long.' });
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    res.status(200).json({ message: 'Post updated successfully', updatedPost });
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

router.get('/search', async (req, res) => {
  const { keyword } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: 'Keyword query is required.' });
  }

  try {
    const posts = await Post.find({
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { content: { $regex: keyword, $options: 'i' } }
      ]
    });
    res.json(posts);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Failed to search posts.' });
  }
});

// ✅ GET: 특정 post 가져오기 (ID 유효성 검사 포함)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // 🔒 유효하지 않은 ObjectId 형식 검사
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid post ID format." });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.json(post);
  } catch (error) {
    console.error("❌ Error fetching post:", error);
    res.status(500).json({ error: "Failed to fetch post." });
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

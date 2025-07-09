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
    console.error("❌ POST /api/posts - Failed to create post", {
        body: req.body,
        error: error.message,
    });
    res.status(500).json({ error: "Failed to create post." });
    }

});


// ✅ DELETE: 게시물 삭제 (ID 유효성 검사 포함)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  // 🔒 유효하지 않은 ObjectId 형식
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid post ID." });
  }

  try {
    const deletedPost = await Post.findByIdAndDelete(id);

    if (!deletedPost) {
      return res.status(404).json({ error: "Post not found." });
    }

    res.status(200).json({ message: "Post deleted successfully", deletedPost });
    } catch (error) {
    console.error(`❌ DELETE /api/posts/${id} - Failed to delete post`, {
        id,
        error: error.message,
    });
    res.status(500).json({ error: "Failed to delete post." });
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
    console.error("❌ PUT /api/posts/${id} - Failed to update post", {
        id,
        body: req.body,
        error: error.message,
    });
    res.status(500).json({ error: "Failed to update post" });
    }

});

router.get("/search", async (req, res) => {
  const { keyword, sort } = req.query;

  if (!keyword) {
    return res.status(400).json({ error: "Keyword query parameter is required" });
  }

  const sortOption = sort === "asc" ? 1 : -1; // 기본은 최신 순

  try {
    const posts = await Post.find({
      $or: [
        { title: new RegExp(keyword, "i") },
        { content: new RegExp(keyword, "i") },
      ]
    }).sort({ createdAt: sortOption });

    res.json(posts);
    } catch (error) {
    console.error("❌ GET /api/posts/search - Failed to search posts", {
        keyword,
        sort,
        error: error.message,
    });
    res.status(500).json({ error: "Failed to search posts" });
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
    console.error(`❌ GET /api/posts/${id} - Failed to fetch post`, {
        id,
        error: error.message,
    });
    res.status(500).json({ error: "Failed to fetch post." });
    }

});

// GET /api/posts?page=1&limit=5
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 }) // 최신순 정렬
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    res.json({
      page,
      limit,
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      posts,
    });
    } catch (error) {
    console.error("❌ GET /api/posts - Failed to fetch paginated posts", {
        page: req.query.page,
        limit: req.query.limit,
        error: error.message,
    });
    res.status(500).json({ error: "Failed to fetch posts" });
    }

});



module.exports = router;

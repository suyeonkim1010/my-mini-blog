const express = require('express');
const router = express.Router();
const Post = require("../models/Post");
const mongoose = require('mongoose');
const { requireAuth } = require('../middleware/auth'); // ✔ 사용

// -------------------------
// [POST] 글 생성 (보호)
// -------------------------
router.post("/", requireAuth, async (req, res) => {
  const { title, content, author } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required." });
  }
  if (!content || content.trim().length < 20) {
    return res.status(400).json({ error: "Content must be at least 20 characters long." });
  }

  try {
    const newPost = new Post({
      title,
      content,
      // 프론트가 author를 안 보내도 서버가 로그인 사용자명으로 채움
      author: author || (req.user && req.user.name) || "unknown",
    });
    const savedPost = await newPost.save();
    res.status(201).json({ message: "Post created successfully!", post: savedPost });
  } catch (error) {
    console.error("❌ Error creating post:", error);
    res.status(500).json({ error: "Failed to create post." });
  }
});

// -------------------------
// [POST] 댓글 추가 (원하면 보호로 바꿔도 됨)
// -------------------------
router.post("/:id/comments", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Comment text is required." });
  }

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found." });

    post.comments.push({ text, createdAt: new Date() });
    await post.save();

    res.status(201).json({ message: "Comment added.", comments: post.comments });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({ error: "Failed to add comment." });
  }
});

// -------------------------
// [DELETE] 삭제 (보호)
// -------------------------
router.delete("/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid post ID." });
  }

  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) return res.status(404).json({ error: "Post not found." });

    res.status(200).json({ message: "Post deleted successfully", deletedPost });
  } catch (error) {
    console.error(`❌ DELETE /api/posts/${id} - Failed to delete post`, {
      id,
      error: error.message,
    });
    res.status(500).json({ error: "Failed to delete post." });
  }
});

// -------------------------
// [PUT] 수정 (보호)
// -------------------------
router.put('/:id', requireAuth, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid post ID.' });
  }

  const { title, content, author } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required.' });
  }
  if (!content || content.trim().length < 20) {
    return res.status(400).json({ error: 'Content must be at least 20 characters long.' });
  }

  try {
    const payload = { title, content, updatedAt: new Date() };

    // author를 바꾸고 싶다면 허용 (아니면 이 블록을 지우세요)
    if (author && author.trim()) {
      payload.author = author;
    } else if (!author) {
      // 보통은 작성자 고정. 바꾸지 않으려면 아무 것도 안 넣으면 됨.
    }

    const updatedPost = await Post.findByIdAndUpdate(id, payload, { new: true });
    if (!updatedPost) return res.status(404).json({ error: 'Post not found.' });

    res.status(200).json({ message: 'Post updated successfully', updatedPost });
  } catch (error) {
    console.error(`❌ PUT /api/posts/${id} - Failed to update post`, {
      id,
      body: req.body,
      error: error.message,
    });
    res.status(500).json({ error: "Failed to update post" });
  }
});

// -------------------------
// [GET] 검색 (비보호)
// -------------------------
router.get("/search", async (req, res) => {
  const { keyword, sort } = req.query;
  if (!keyword) {
    return res.status(400).json({ error: "Keyword query parameter is required" });
  }
  const sortOption = sort === "asc" ? 1 : -1;

  try {
    const posts = await Post.find({
      $or: [
        { title: new RegExp(keyword, "i") },
        { content: new RegExp(keyword, "i") },
        { author: new RegExp(keyword, "i") },
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

// -------------------------
// [GET] 상세 (비보호)
// -------------------------
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid post ID format." });
  }

  try {
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found." });
    res.json(post);
  } catch (error) {
    console.error(`❌ GET /api/posts/${id} - Failed to fetch post`, {
      id,
      error: error.message,
    });
    res.status(500).json({ error: "Failed to fetch post." });
  }
});

// -------------------------
// [GET] 목록 + 페이지네이션 (비보호)
// -------------------------
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
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
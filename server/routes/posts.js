const express = require('express');
const router = express.Router();
const Post = require("../models/Post"); 
const mongoose = require("mongoose");


router.post("/", async (req, res) => {
  const { title, content, author } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required." });
  }

  if (!content || content.trim().length < 20) {
    return res.status(400).json({ error: "Content must be at least 20 characters long." });
  }
  if (!author || author.trim() === "") {
    return res.status(400).json({ error: "Author is required." });
  }

  try {
    const newPost = new Post({ title, content, author });
    const savedPost = await newPost.save();
    res.status(201).json({ message: "Post created successfully!", post: savedPost });
  } catch (error) {
    console.error("❌ Error creating post:", error);
    res.status(500).json({ error: "Failed to create post." });
  }
});



router.delete("/:id", async (req, res) => {
  const { id } = req.params;

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

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid post ID.' });
  }

  const { title, content, author } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required.' });
  }

  if (!content || content.length < 20) {
    return res.status(400).json({ error: 'Content must be at least 20 characters long.' });
  }

  if (!author || author.trim() === "") {
  return res.status(400).json({ error: "Author is required." });
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, content, author, updatedAt: new Date() },
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


router.get("/:id", async (req, res) => {
  const { id } = req.params;

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

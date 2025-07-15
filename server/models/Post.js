// server/models/Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true }, // ✅ 작성자 필드 추가
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
}, {
  timestamps: true // ✅ createdAt, updatedAt 자동 추가
});


module.exports = mongoose.model('Post', postSchema);

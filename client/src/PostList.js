// src/PostList.js
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const highlightText = (text, keyword) => {
  if (!keyword) return text;

  const regex = new RegExp(`(${keyword})`, "gi");
  return text.split(regex).map((part, i) =>
    regex.test(part) ? <mark key={i}>{part}</mark> : part
  );
};

function PostList({ posts, onDelete, onEdit, currentPage, setCurrentPage, totalPages }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete it?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/posts/${id}`);
      if (onDelete) onDelete();
    } catch (error) {
      console.error("❌ Error deleting post:", error);
    }
  };

  const filteredPosts = posts.filter((post) => {
    const keyword = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(keyword) ||
      post.content.toLowerCase().includes(keyword) ||
      (post.author && post.author.toLowerCase().includes(keyword))
    );
  });

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div>
      <h2 className="section-title">📚 Posts</h2>

      <input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {filteredPosts.length === 0 ? (
        <p className="no-posts">😢 No posts yet. Be the first to write one!</p>
      ) : (
        filteredPosts.map((post) => (
          <div key={post._id} className="post-card">
            <Link to={`/posts/${post._id}`}>
              <h3>{highlightText(post.title, searchTerm)}</h3>
            </Link>

            <p><strong>By:</strong> {highlightText(post.author || "Unknown", searchTerm)}</p>
            <p className="post-meta">Posted on: {format(new Date(post.createdAt), "PPP p")}</p>

            <p className="post-content">{highlightText(post.content, searchTerm)}</p>
            <p className="post-comments">💬 {post.comments?.length || 0} comment{post.comments?.length === 1 ? "" : "s"}</p>

            {/* 🔹 액션 버튼 영역 */}
            <div className="post-actions">
              <button
                type="button"
                className="btn btn-edit"
                onClick={() => onEdit(post)}
              >
                ✏️ Edit
              </button>
              <button
                type="button"
                className="btn btn-delete"
                onClick={() => handleDelete(post._id)}
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default PostList;

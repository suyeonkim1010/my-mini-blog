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
        <div className="no-posts">
          <p style={{ fontSize: "2rem" }}>😢</p>
          <p>No posts yet. Be the first to write one!</p>
        </div>
      ) : (
        filteredPosts.map((post) => (
          <div key={post._id} className="post-card">
            <Link to={`/posts/${post._id}`}>
              <h3>{highlightText(post.title, searchTerm)}</h3>
            </Link>

            <p>
              <strong>By:</strong>{" "}
              {highlightText(post.author || "Unknown", searchTerm)}
            </p>

            <p style={{ color: "#888", fontSize: "0.8rem" }}>
              Posted on: {format(new Date(post.createdAt), "PPP p")}
            </p>

            <p>{highlightText(post.content, searchTerm)}</p>

            <p style={{ fontSize: "0.9rem", color: "#666" }}>
              💬 {post.comments?.length || 0} comment
              {post.comments?.length === 1 ? "" : "s"}
            </p>

            <button onClick={() => onEdit(post)}>✏️ EDIT</button>
            <button onClick={() => handleDelete(post._id)}>🗑 DELETE</button>
          </div>
        ))
      )}

      {/* ✅ 페이지네이션 버튼 */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            ← Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

export default PostList;

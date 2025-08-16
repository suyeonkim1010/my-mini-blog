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

function PostList({
  posts,
  onDelete,
  onEdit,
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete it?")) return;

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    try {
      setDeletingId(id);
      await axios.delete(`/api/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-api-key": token,
          "x-username": username || "unknown",
        },
      });
      setDeletingId(null);
      if (onDelete) onDelete();
    } catch (error) {
      console.error("❌ Error deleting post:", error);
      setDeletingId(null);
      alert(
        error?.response?.data?.error ||
          "Failed to delete post (check your admin key)."
      );
    }
  };

  const filtered = posts.filter((post) => {
    const k = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(k) ||
      post.content.toLowerCase().includes(k) ||
      (post.author && post.author.toLowerCase().includes(k))
    );
  });

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

      {filtered.length === 0 ? (
        <div className="no-posts">
          <div style={{ fontSize: "2rem" }}>😢</div>
          <p>No posts found.</p>
        </div>
      ) : (
        filtered.map((post) => (
          <div key={post._id} className="post-card">
            <Link to={`/posts/${post._id}`}>
              <h3>{highlightText(post.title, searchTerm)}</h3>
            </Link>

            <p style={{ margin: "4px 0", color: "#6b7280" }}>
              <strong>By:</strong>{" "}
              {highlightText(post.author || "Unknown", searchTerm)}
              {" · "}
              <span style={{ fontSize: "0.9rem" }}>
                {format(new Date(post.createdAt), "PPP p")}
              </span>
            </p>

            <p style={{ whiteSpace: "pre-line" }}>
              {highlightText(post.content, searchTerm)}
            </p>

            <p style={{ fontSize: "0.9rem", color: "#666" }}>
              💬 {post.comments?.length || 0} comment
              {post.comments?.length === 1 ? "" : "s"}
            </p>

            <div>
              <button onClick={() => onEdit(post)} className="btn btn-edit">
                ✏️ EDIT
              </button>
              <button
                onClick={() => handleDelete(post._id)}
                className="btn btn-delete"
                disabled={deletingId === post._id}
              >
                {deletingId === post._id ? "Deleting..." : "🗑 DELETE"}
              </button>
            </div>
          </div>
        ))
      )}

      {/* Pagination (optional UI if you’re showing it here) */}
      {totalPages >= 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
          >
            ◀ Prev
          </button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((p) => Math.min(totalPages, p + 1))
            }
            disabled={currentPage >= totalPages}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}

export default PostList;
// src/PostList.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const highlightText = (text, keyword) => {
  if (!keyword) return text;
  const regex = new RegExp(`(${keyword})`, "gi");
  return text.split(regex).map((part, i) =>
    regex.test(part) ? <mark key={i}>{part}</mark> : part
  );
};

function PostList({ posts, onDelete, onEdit }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleDelete = async (e, id) => {
    e.stopPropagation();              // ✅ 카드 클릭으로 전파 방지
    if (!window.confirm("Are you sure you want to delete it?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/posts/${id}`);
      if (onDelete) onDelete();
    } catch (error) {
      console.error("❌ Error deleting post:", error);
    }
  };

  const handleEditClick = (e, post) => {
    e.stopPropagation();              // ✅ 전파 방지
    onEdit && onEdit(post);
  };

  const filteredPosts = posts.filter((post) => {
    const keyword = searchTerm.toLowerCase();
    return (
      post.title.toLowerCase().includes(keyword) ||
      post.content.toLowerCase().includes(keyword) ||
      (post.author && post.author.toLowerCase().includes(keyword))
    );
  });

  const handleCardOpen = (id) => navigate(`/posts/${id}`);
  const handleCardKey = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardOpen(id);
    }
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
          <div
            key={post._id}
            className="post-card clickable"     // ✅ 시각적 힌트
            role="button"                       // ✅ 접근성
            tabIndex={0}
            onClick={() => handleCardOpen(post._id)}
            onKeyDown={(e) => handleCardKey(e, post._id)}
          >
            {/* 제목은 일반 텍스트로 둬도 되고, 굳이 Link 필요 없음 */}
            <h3>{highlightText(post.title, searchTerm)}</h3>

            <p><strong>By:</strong> {highlightText(post.author || "Unknown", searchTerm)}</p>

            <p style={{ color: "#888", fontSize: "0.9rem" }}>
              Posted on: {format(new Date(post.createdAt), "PPP p")}
            </p>

            <p style={{ whiteSpace: "pre-line" }}>
              {highlightText(post.content, searchTerm)}
            </p>

            <p style={{ fontSize: "0.9rem", color: "#666" }}>
              💬 {post.comments?.length || 0} comment{post.comments?.length === 1 ? "" : "s"}
            </p>

            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn-secondary"
                onClick={(e) => handleEditClick(e, post)}
              >
                ✏️ EDIT
              </button>
              <button
                className="btn-danger"
                onClick={(e) => handleDelete(e, post._id)}
              >
                🗑 DELETE
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default PostList;

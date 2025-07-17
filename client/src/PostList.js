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

function PostList({ posts, onDelete, onEdit }) {
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


  return (
    <div>
      <h2>📚 Posts</h2>

      {/* 🔍 검색창 */}
      <input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px", width: "300px" }}
      />

      {filteredPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        filteredPosts.map((post) => (
          <div
            key={post._id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "10px",
            }}
          >
            <Link to={`/posts/${post._id}`}>
              <h3>{highlightText(post.title, searchTerm)}</h3>
            </Link>
            <p>
              <p><strong>By:</strong> {highlightText(post.author || "Unknown", searchTerm)}</p>
            </p>

            <p style={{ color: "#888", fontSize: "0.8rem" }}>
              Posted on: {format(new Date(post.createdAt), "PPP p")}
            </p>

            <p>{highlightText(post.content, searchTerm)}</p>
            <button onClick={() => onEdit(post)}>✏️ EDIT</button>
            <button onClick={() => handleDelete(post._id)}>🗑 DELETE</button>
          </div>
        ))
      )}
    </div>
  );
}

export default PostList;

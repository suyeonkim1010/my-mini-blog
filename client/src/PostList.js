// src/components/PostList.js
import React from "react";
import axios from "axios";

function PostList({ posts, onDelete, onEdit }) {

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete it?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/posts/${id}`);
      if (onDelete) onDelete(); 
    } catch (error) {
      console.error("❌ Error deleting post:", error);
    }
  };

  return (
    <div>
      <h2>📝 Posts</h2>
      {posts.map((post) => (
        <div key={post._id} style={{ border: "1px solid #ccc", margin: "10px", padding: "15px" }}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <button onClick={() => onEdit(post)}>✏️ EDIT</button>
          <button onClick={() => handleDelete(post._id)}>🗑 DELETE</button>
        </div>
      ))}
    </div>
  );
}

export default PostList;

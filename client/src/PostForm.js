import React, { useState, useEffect } from "react";
import axios from "axios";

function PostForm({ onSuccess, postToEdit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [author, setAuthor] = useState("");


  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setContent(postToEdit.content);
      setAuthor(postToEdit.author || "");
    } else {
      setTitle("");
      setContent("");
      setAuthor(""); 
    }
  }, [postToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Please enter both title and content.");
      return;
    }

    try {
      if (postToEdit) {
        await axios.put(`http://localhost:8080/api/posts/${postToEdit._id}`, {
          title,
          content,
          author,
        });
      } else {
        await axios.post("http://localhost:8080/api/posts", {
          title,
          content,
          author,
        });
      }

      setTitle("");
      setContent("");
      setAuthor("");
      setError("");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("❌ Error submitting post:", err);
      setError("Post submission failed");
    }
  };

  return (
    <div>
      <h2>✍️ {postToEdit ? "Edit Post" : "Create a Post"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <br />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
        <br />
        <button type="submit">{postToEdit ? "UPDATE" : "SUBMIT"}</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default PostForm;

import React, { useState, useEffect } from "react";
import axios from "axios";

function PostForm({ onSuccess, postToEdit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({}); 

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
    setFieldErrors({});
    setError("");
  }, [postToEdit]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔍 유효성 검사
    const errors = {};
    if (!title.trim()) errors.title = "Title is required.";
    else if (title.length < 3) errors.title = "Title must be at least 3 characters.";
    if (!author.trim()) errors.author = "Author is required.";
    if (!content.trim()) errors.content = "Content is required.";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const data = { title, content, author };
      if (postToEdit) {
        await axios.put(`http://localhost:8080/api/posts/${postToEdit._id}`, data);
      } else {
        await axios.post("http://localhost:8080/api/posts", data);
      }
      setTitle("");
      setContent("");
      setAuthor("");
      setError("");
      setFieldErrors({});
      if (onSuccess) onSuccess(!!postToEdit);
    } catch (err) {
      console.error("❌ Error submitting post:", err);
      setError("Post submission failed");
    }
  };

  return (
    <div>
      <h2 className="section-title">✍️ {postToEdit ? "Edit Your Post" : "Create a Post!!"}</h2>
      <form onSubmit={handleSubmit} className="post-form">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {fieldErrors.title && <p style={{ color: "red", margin: 0 }}>{fieldErrors.title}</p>}
        <br />

        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        {fieldErrors.author && <p style={{ color: "red", margin: 0 }}>{fieldErrors.author}</p>}
        <br />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
        {fieldErrors.content && <p style={{ color: "red", margin: 0 }}>{fieldErrors.content}</p>}
        <br />

        <button type="submit">{postToEdit ? "UPDATE" : "SUBMIT"}</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default PostForm;

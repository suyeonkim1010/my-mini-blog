import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

function PostForm({ onSuccess, postToEdit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // 🔹 textarea ref
  const contentRef = useRef(null);

  // 🔹 자동 리사이즈 함수
  const autosize = (el) => {
    if (!el) return;
    el.style.height = "auto";                 // 리셋
    el.style.height = `${el.scrollHeight}px`; // 내용 높이만큼 설정
  };

  // 🔹 편집/리셋 시 값 채우기 + 즉시 리사이즈
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

    // 값 셋 이후 다음 tick에 리사이즈
    setTimeout(() => autosize(contentRef.current), 0);
  }, [postToEdit]);

  // 🔹 content 값이 바뀔 때마다 리사이즈
  useEffect(() => {
    autosize(contentRef.current);
  }, [content]);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      <h2 className="section-title">✍️ {postToEdit ? "Edit Post" : "Create a Post"}</h2>
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
          ref={contentRef}
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={1}                              // 시작은 1줄
          style={{ resize: "none", overflow: "hidden", whiteSpace: "pre-wrap" }}
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

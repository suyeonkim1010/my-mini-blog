import React, { useState, useEffect } from "react";
import axios from "axios";

function PostForm({ onSuccess, postToEdit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title || "");
      setContent(postToEdit.content || "");
    } else {
      setTitle("");
      setContent("");
    }
  }, [postToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    // 디버깅용 로그 (필요 없으면 삭제해도 됩니다)
    console.log("[PostForm] token:", token, "username:", username);

    if (!token || !username) {
      alert("로그인 후 작성할 수 있습니다.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("Title과 Content를 입력해주세요.");
      return;
    }

    try {
      const body = {
        title,
        content,
        author: username, // ✅ 서버가 author를 바디에서 요구하므로 넣어줌
      };

      const headers = {
        Authorization: `Bearer ${token}`,
        "x-api-key": token,
        "x-username": username,
      };

      if (postToEdit?._id) {
        await axios.put(`/api/posts/${postToEdit._id}`, body, { headers });
      } else {
        await axios.post("/api/posts", body, { headers });
      }

      setTitle("");
      setContent("");
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("❌ Error submitting post:", err.response?.data || err);
      alert(err.response?.data?.error || "Failed to submit post.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <input
        type="text"
        placeholder="Post title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Post content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={6}
      />
      <button type="submit">
        {postToEdit?._id ? "Update Post" : "Create Post"}
      </button>
    </form>
  );
}

export default PostForm;
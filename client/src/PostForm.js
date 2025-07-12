import React, { useState, useEffect} from "react";
import axios from "axios";

function PostForm({ onSuccess, postToEdit, setPostToEdit  }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setContent(postToEdit.content);
    } else {
      setTitle("");
      setContent("");
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
        });
      } else {
        await axios.post("http://localhost:8080/api/posts", {
          title,
          content,
        });
      }

      // 성공 시 초기화
      setTitle("");
      setContent("");
      setError("");
      setPostToEdit(null);

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("❌ Error creating post:", err);
      setError("Post creating failed");
    }
  };


  return (
    <div>
      <h2>{postToEdit ? "✏️ Edit Post" : "✍️ Create a Post"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
          />
        </div>
        <button type="submit">{postToEdit ? "Update" : "Submit"}</button>
        {postToEdit && (
          <button
            type="button"
            onClick={() => {
              setPostToEdit(null);
              setTitle("");
              setContent("");
            }}
            style={{ marginLeft: "10px" }}
          >
            Cancel
          </button>
        )}
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default PostForm;

// ✅ PostDetail.js - 스타일 개선 버전
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { format, isValid } from "date-fns";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("❌ Error fetching post:", err);
        setError("Failed to load post.");
      }
    };
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post(`http://localhost:8080/api/posts/${id}/comments`, {
        text: newComment,
      });
      setNewComment("");
      const res = await axios.get(`http://localhost:8080/api/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error("❌ Error adding comment:", err);
      setError("Failed to add comment.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === "Enter") {
      handleCommentSubmit(e);
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post) return <p>Loading...</p>;

  const createdDate = new Date(post.createdAt);

  return (
    <div className="post-detail-card">
      <h2 className="detail-title">📝 {post.title}</h2>
      <div className="detail-meta">
        <p><span>👤</span> {post.author || "Unknown"}</p>
        <p><span>⏰</span> {isValid(createdDate) ? format(createdDate, "PPP p") : "Unknown"}</p>
      </div>

      <div className="detail-content">{post.content}</div>

      <hr />
      <div className="comment-section">
        <h3>🗨️ Comments</h3>
        {post.comments?.length > 0 ? (
          <ul className="comment-list">
            {post.comments.map((comment, index) => (
              <li key={index}>
                {comment.text} <small>({new Date(comment.createdAt).toLocaleString()})</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}

        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            className="comment-textarea"
            rows={3}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="comment-submit-btn" type="submit">
            ➕ Add Comment
          </button>
        </form>
      </div>

      <Link to="/" className="back-link">← Back to List</Link>
    </div>
  );
}

export default PostDetail;

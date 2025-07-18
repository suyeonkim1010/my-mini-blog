// src/PostDetail.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { format, isValid } from "date-fns";

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [newComment, setNewComment] = useState(""); // ✅ 댓글 상태

  // 포스트 불러오기
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

  // 댓글 제출
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await axios.post(`http://localhost:8080/api/posts/${id}/comments`, {
        text: newComment,
      });
      setNewComment("");

      // 댓글 작성 후 포스트 다시 가져오기
      const res = await axios.get(`http://localhost:8080/api/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error("❌ Error adding comment:", err);
      setError("Failed to add comment.");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post) return <p>Loading...</p>;

  const createdDate = new Date(post.createdAt);

  return (
    <div>
      <h2>📝 {post.title}</h2>
      <p><strong>Author:</strong> {post.author || "Unknown"}</p>
      <p>{post.content}</p>
      {isValid(createdDate) ? (
        <p>Created at: {format(createdDate, "PPP p")}</p>
      ) : (
        <p>Created at: Unknown</p>
      )}

      <hr />
      <div>
        <h3>🗨️ Comments</h3>
        {post.comments?.length > 0 ? (
          <ul>
            {post.comments.map((comment, index) => (
              <li key={index}>
                {comment.text}{" "}
                <small style={{ color: "#777" }}>
                  ({new Date(comment.createdAt).toLocaleString()})
                </small>
              </li>
            ))}
          </ul>
        ) : (
          <p>No comments yet.</p>
        )}

        <form onSubmit={handleCommentSubmit} style={{ marginTop: "1rem" }}>
          <textarea
            rows={3}
            style={{ width: "100%", padding: "0.5rem" }}
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" style={{ marginTop: "0.5rem" }}>
            ➕ Add Comment
          </button>
        </form>
      </div>

      <br />
      <Link to="/">← Back to List</Link>
    </div>
  );
}

export default PostDetail;

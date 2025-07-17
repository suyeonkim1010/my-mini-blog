// src/PostDetail.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { format, isValid } from "date-fns";



function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");


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
      <br />
      <Link to="/">← Back to List</Link>
    </div>
  );
}

export default PostDetail;

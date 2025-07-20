// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import PostForm from "./PostForm";
import PostList from "./PostList";
import PostDetail from "./PostDetail";
import "./App.css"; // ✨ 다크모드 스타일 정의할 곳

function App() {
  const [posts, setPosts] = useState([]);
  const [postToEdit, setPostToEdit] = useState(null);
  const [darkMode, setDarkMode] = useState(false); // 🌗 다크모드 상태 추가

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/posts");
      setPosts(res.data.posts);
    } catch (err) {
      console.error("❌ Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSuccess = () => {
    fetchPosts();
    setPostToEdit(null);
  };

  const handleDelete = () => {
    fetchPosts();
  };

  const handleEdit = (post) => {
    setPostToEdit(post);
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev); // ✨ 토글 함수

  return (
    <Router>
      <div className={darkMode ? "App dark" : "App"}>
        {/* 🌙 다크모드 토글 버튼 */}
        <button onClick={toggleDarkMode} style={{ marginBottom: "20px" }}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <Routes>
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route
            path="/"
            element={
              <>
                <PostForm onSuccess={handleSuccess} postToEdit={postToEdit} />
                <PostList posts={posts} onDelete={handleDelete} onEdit={handleEdit} />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

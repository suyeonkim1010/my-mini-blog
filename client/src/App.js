// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";

import PostForm from "./PostForm";
import PostList from "./PostList";
import PostDetail from "./PostDetail";
import "./App.css";

function App() {
  // ----- 상태 -----
  const [posts, setPosts] = useState([]);
  const [postToEdit, setPostToEdit] = useState(null);

  const [darkMode, setDarkMode] = useState(false);
  const [sortOption, setSortOption] = useState("newest");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const POSTS_PER_PAGE = 5;

  const [showForm, setShowForm] = useState(true);
  const [toastMessage, setToastMessage] = useState("");

  // 로그인 사용자 (localStorage 사용)
  const [user, setUser] = useState(localStorage.getItem("username") || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const isLoggedIn = !!user && !!token;

  // ----- API -----
  const fetchPosts = async (page = 1) => {
    try {
      const res = await axios.get(`/api/posts?page=${page}&limit=${POSTS_PER_PAGE}`);
      setPosts(res.data.posts || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("❌ Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  // ----- 헬퍼 -----
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 2500);
  };

  // ----- 콜백 -----
  const handleSuccess = (isEdit = false) => {
    fetchPosts(currentPage);
    setPostToEdit(null);
    showToast(isEdit ? "✏️ Post updated successfully!" : "✅ Post created successfully!");
  };

  const handleDelete = () => {
    fetchPosts(currentPage);
    showToast("🗑️ Post deleted.");
  };

  const handleEdit = (post) => {
    setPostToEdit(post);
    setShowForm(true);
  };

  // 정렬 (페이지 단위 결과 정렬)
  const getSortedPosts = () => {
    const sorted = [...posts];
    if (sortOption === "newest") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOption === "oldest") {
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortOption === "title") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  };

  // ----- 다크 모드 -----
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // ----- 로그인/로그아웃 (데모용) -----
  const handleLogin = () => {
    const name = window.prompt("Enter your name to login:");
    if (!name) return;
    const adminKey = window.prompt("Enter admin key/token:");
    if (!adminKey) return;

    localStorage.setItem("username", name);
    localStorage.setItem("token", adminKey);

    setUser(name);
    setToken(adminKey);
    showToast(`👋 Welcome, ${name}!`);
    setShowForm(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
    setPostToEdit(null);
    setShowForm(false);
    showToast("👋 Logged out.");
  };

  return (
    <Router>
      <div className={darkMode ? "App dark" : "App"}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route
            path="/"
            element={
              <>
                {/* 상단 컨트롤 패널 */}
                <div className="control-panel">
                  <button className="control-button" onClick={toggleDarkMode}>
                    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                  </button>

                  <button
                    className="control-button"
                    onClick={() => setShowForm((prev) => !prev)}
                  >
                    {showForm ? "➖ Hide Form" : "➕ Write a Post"}
                  </button>

                  <select
                    className="control-button"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value="newest">🆕 Newest</option>
                    <option value="oldest">📜 Oldest</option>
                    <option value="title">🔤 Title</option>
                  </select>

                  {isLoggedIn ? (
                    <button className="control-button" onClick={handleLogout}>
                      🔓 Logout ({user})
                    </button>
                  ) : (
                    <button className="control-button" onClick={handleLogin}>
                      🔑 Login
                    </button>
                  )}
                </div>

                {/* 글쓰기 폼: 로그인 + 토글 둘 다 만족할 때만 표시 */}
                {isLoggedIn && showForm ? (
                  <PostForm
                    onSuccess={handleSuccess}
                    postToEdit={postToEdit}
                    isLoggedIn={isLoggedIn}
                  />
                ) : (
                  showForm && (
                    <p className="section-title" style={{ marginTop: 0 }}>
                      🔒 Please login to write a post.
                    </p>
                  )
                )}

                {/* 포스트 리스트 */}
                <PostList
                  posts={getSortedPosts()}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                  fetchPosts={fetchPosts}
                />

                {/* 토스트 메시지 */}
                {toastMessage && <div className="toast">{toastMessage}</div>}
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
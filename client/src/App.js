// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import PostForm from "./PostForm";
import PostList from "./PostList";
import PostDetail from "./PostDetail";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [postToEdit, setPostToEdit] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [sortOption, setSortOption] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toastMessage, setToastMessage] = useState("");
  const [showForm, setShowForm] = useState(true); 

  const POSTS_PER_PAGE = 5;

  const fetchPosts = async (page = 1) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/posts?page=${page}&limit=${POSTS_PER_PAGE}`
      );
      setPosts(res.data.posts);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("❌ Error fetching posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  const handleSuccess = (isEdit = false) => {
    fetchPosts();
    setPostToEdit(null);
    showToast(isEdit ? "✏️ Post updated successfully!" : "✅ Post created successfully!");
  };

  const handleDelete = () => {
    fetchPosts(currentPage);
    showToast("🗑️ Post deleted successfully!");
  };

  const handleEdit = (post) => {
    setPostToEdit(post);
    if (!showForm) setShowForm(true); 
  };

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

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

  return (
    <Router>
      <div className={darkMode ? "App dark" : "App"}>
        <Routes>
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route
            path="/"
            element={
              <>
                <div className="control-panel">
                  <button onClick={toggleDarkMode} className="control-button">
                    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                  </button>

                  <button
                    onClick={() => setShowForm((prev) => !prev)}
                    className="control-button"
                  >
                    {showForm ? "➖ Hide Form" : "➕ Write a Post"}
                  </button>

                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="control-button"
                  >
                    <option value="newest">🆕 Newest</option>
                    <option value="oldest">📜 Oldest</option>
                    <option value="title">🔤 Title</option>
                  </select>

                </div>
                
                {showForm && (
                  <PostForm onSuccess={handleSuccess} postToEdit={postToEdit} />
                )}

                <PostList
                  posts={getSortedPosts()}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                  fetchPosts={fetchPosts}
                />

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

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
  const POSTS_PER_PAGE = 5;

  // 📌 페이지 단위로 포스트 가져오기
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

  const handleSuccess = () => {
    fetchPosts(currentPage);
    setPostToEdit(null);
  };

  const handleDelete = () => {
    fetchPosts(currentPage);
  };

  const handleEdit = (post) => {
    setPostToEdit(post);
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // 🔽 정렬은 페이지에 가져온 posts 내에서만 적용
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
                <div className="post-controls">
                  <button onClick={toggleDarkMode} className="dark-mode-btn">
                    {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
                  </button>

                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                    className="sort-select"
                  >
                    <option value="newest">🆕 Newest</option>
                    <option value="oldest">📜 Oldest</option>
                    <option value="title">🔤 Title</option>
                  </select>
                </div>

                <PostForm onSuccess={handleSuccess} postToEdit={postToEdit} />

                <PostList
                  posts={getSortedPosts()}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  totalPages={totalPages}
                  fetchPosts={fetchPosts}
                />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

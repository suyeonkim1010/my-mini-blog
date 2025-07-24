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

  // 📌 전체 포스트 가져오기
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

  // ✅ 새 포스트 작성 성공 시
  const handleSuccess = () => {
    fetchPosts();
    setPostToEdit(null);
  };

  // ✅ 삭제 시 목록 새로고침
  const handleDelete = () => {
    fetchPosts();
  };

  // ✅ 수정할 포스트 선택 시
  const handleEdit = (post) => {
    setPostToEdit(post);
  };

  // ✅ 다크모드 토글
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // ✅ 정렬된 게시글 반환
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
          {/* 상세 페이지 */}
          <Route path="/posts/:id" element={<PostDetail />} />

          {/* 홈 (작성 + 리스트) */}
          <Route
            path="/"
            element={
              <>
                {/* ✅ 컨트롤 영역 */}
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

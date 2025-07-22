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

        <button onClick={toggleDarkMode} style={{ marginBottom: "20px" }}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <Routes>
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route
            path="/"
            element={
              <>
              <div style={{ margin: "10px 0" }}>
                <label htmlFor="sort-select">Sort by: </label>
                <select
                  id="sort-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
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

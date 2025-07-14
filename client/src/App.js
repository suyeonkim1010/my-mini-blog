// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import PostForm from "./PostForm";
import PostList from "./PostList";
import PostDetail from "./PostDetail";

function App() {
  const [posts, setPosts] = useState([]);
  const [postToEdit, setPostToEdit] = useState(null);

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

  // ✅ 새 포스트 작성 성공 후 호출
  const handleSuccess = () => {
    fetchPosts();
    setPostToEdit(null); 
  };

  // ✅ 삭제 후 목록 갱신
  const handleDelete = () => {
    fetchPosts();
  };

  // ✅ 수정 후 목록 갱신
  const handleEdit = (post) => {
    setPostToEdit(post);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 🔹 상세 페이지 */}
          <Route path="/posts/:id" element={<PostDetail />} />
          {/* 🔹 홈: 작성 폼 + 리스트 */}
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

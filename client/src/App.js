import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import PostForm from "./PostForm";
import PostList from "./PostList";
import PostDetail from "./PostDetail"; // 🔥 상세 페이지 컴포넌트 (다음에 만들 예정)

function App() {
  const [posts, setPosts] = useState([]);
  const [postToEdit, setPostToEdit] = useState(null); 

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/posts');
      setPosts(res.data.posts); 
    } catch (err) {
      console.error('❌ Failed to fetch posts', err);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = (post) => {
    setPostToEdit(post);
  };

  return (
    <Router>
      <div className="App">
        <h1>📝 My Mini Blog</h1>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <PostForm onSuccess={fetchPosts} />
                <PostList posts={posts} onDelete={fetchPosts} />
              </>
            }
          />
          <Route path="/posts/:id" element={<PostDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;




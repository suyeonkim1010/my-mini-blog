import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostForm from './PostForm'; 
import PostList from './PostList';

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

  // ✅ 처음 한 번 글 목록 로딩
  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = (post) => {
    setPostToEdit(post); // 수정 대상 지정
  };

  return (
    <div>
      <h1>📝 My Mini Blog ❤️ </h1>
      <PostForm
        onSuccess={() => {
          fetchPosts();
          setPostToEdit(null); // 폼 제출 후 초기화
        }}
        postToEdit={postToEdit}
        setPostToEdit={setPostToEdit}
      />
      <PostList posts={posts} onDelete={fetchPosts} onEdit={handleEdit} />
    </div>
  );
}

export default App;




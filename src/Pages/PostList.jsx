// src/pages/PostList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../utils/axios";

const PostList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/docs');
      console.log(response.data.data);
      setPosts(response.data.data.posts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
};

const PostCard = ({ post }) => {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition duration-300 hover:scale-105"
      onClick={() => navigate(`/docs/${post._id}`)}
    >
      <img 
        src={post.cover} 
        alt={post.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">{post.title}</h2>
        <p className="text-gray-600 mb-4 line-clamp-3">{post.summary}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            By {post.author.username}
          </span>
          <span className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostList;
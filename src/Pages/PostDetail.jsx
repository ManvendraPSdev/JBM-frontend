// src/pages/PostDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import axios from "../utils/axios";
import { useRecoilState } from "recoil";
import { userState } from "../store/atom/userAtom";
import RichTextEditor from '../Components/RichTextEditor';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState() ; 
  console.log(user);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreator, setIsCreator] = useState();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-500 hover:text-blue-700 underline',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Color,
      TextStyle,
      Underline,
    ],
    content: '',
    // onUpdate: ({ editor }) => {
    //   onChange(editor.getHTML());
    // },
  });


  const editor2 = useEditor({
    extensions: [
      StarterKit,
      Image
    ],
    editable: true
  });


  const fetchPost = async () => {
    try {
      const response = await axios.get(`/docs/${id}`);
      console.log(response.data.data);
      setPost(response.data.data);
      editor?.commands.setContent(response.data.data.content);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching post:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const getUser = async () => {
    try {
      const response = await axios.get("/user/current-user", {
        withCredentials: true,
      });
      console.log(response.data.data) ;
      setUser(response.data.data)
      setIsCreator(response.data.data.user.isCreator)
    }
    catch (error) {
    }
  }

  useEffect(()=>{
    getUser()
  } , [])

  const handleEdit = () => {
    setIsEditing(true);
    editor?.setEditable(true);
  };

  const handleSave = async () => {
    try {
      const updatedPost = {
        ...post,
        content: editor.getHTML()
      };

      await axios.put(`/docs/${id}`, updatedPost);
      setIsEditing(false);
      editor?.setEditable(false);
      fetchPost(); // Refresh the post data
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  if (!user || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {post && (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <img
            src={post.cover}
            alt={post.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center mb-6">
              <span className="text-gray-600">By {post.author.username}</span>
              <span className="mx-2">•</span>
              <span className="text-gray-600">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="prose max-w-none">
              {isEditing ? (
                <RichTextEditor editor={editor} />
              ) : (
                <EditorContent editor={editor} />
              )}
            </div>
            {user.isCreator && (
              <div className="mt-6 flex justify-end">
                {isEditing ? (
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit Post
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
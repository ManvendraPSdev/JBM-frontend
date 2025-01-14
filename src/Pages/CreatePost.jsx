import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { IoIosClose } from "react-icons/io";
import axios from "../utils/axios";
import { upload } from "../utils/upload"; // Assuming you have this utility
import RichTextEditor from '../Components/RichTextEditor';
// import StarterKit from '@tiptap/starter-kit';
// import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [cover, setCover] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  // const editor = useEditor({
  //   extensions: [
  //     StarterKit,
  //     Image
  //   ],
  //   editable: true
  // });
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
    content : '',
    // onUpdate: ({ editor }) => {
    //   onChange(editor.getHTML());
    // },
  });

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    // Validate total number of files
    if (images.length + files.length > 5) {
      alert("Max 5 files allowed");
      return;
    }

    // Check file sizes
    let oversizedFile = false;
    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        oversizedFile = true;
      }
    });

    if (oversizedFile) {
      alert("Max file size is 5MB");
      return;
    }

    // Handle cover image if not set
    if (!cover && files[0]) {
      setCover(files[0]);
    }

    // Add remaining files to images array
    const remainingFiles = cover ? files : files.slice(1);
    setImages(prev => [...prev, ...remainingFiles]);
  };

  const removeImage = (fileName) => {
    setImages(prev => prev.filter(image => image.name !== fileName));
  };

  const removeCover = () => {
    setCover(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const editorContent = editor.getHTML();
    console.log('Editor content before submission:', editorContent); // Debug log


    try {
      // Upload cover image
      let coverUrl = null;
      if (cover) {
        const coverUrls = await upload([cover]);
        coverUrl = coverUrls[0];
      }

      // Upload additional images
      const imageUrls = await upload(images);

      const postData = {
        title,
        summary,
        content: editor.getHTML(),
        cover: coverUrl,
        images: imageUrls
      };
      console.log(postData);

      const response = await axios.post('/docs/create', postData);
      navigate(`/docs/${response.data.data._id}`);


    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Images (Cover & Additional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            ref={fileRef}
            className="hidden"
            multiple
          />
          <button
            type="button"
            onClick={() => fileRef.current.click()}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Upload Images
          </button>

          {/* Cover Image Preview */}
          {cover && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">Cover Image:</h3>
              <div className="relative inline-block">
                <img
                  src={URL.createObjectURL(cover)}
                  alt="Cover preview"
                  className="h-48 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={removeCover}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <IoIosClose size={20} />
                </button>
              </div>
            </div>
          )}

          {/* Additional Images Preview */}
          {images.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">Additional Images:</h3>
              <div className="grid grid-cols-2 gap-4">
                {images.map((img) => (
                  <div key={img.name} className="relative">
                    <img
                      src={URL.createObjectURL(img)}
                      alt={img.name}
                      className="h-32 w-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(img.name)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <IoIosClose size={20} />
                    </button>
                    <p className="text-sm text-gray-500 truncate mt-1">{img.name}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Summary
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Content
          </label>
          <div className="prose max-w-none border rounded-lg p-4">
          <RichTextEditor editor={editor}/>
          </div>
        </div>

       

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Creating...' : 'Create Post'}
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
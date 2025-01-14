import React from 'react';
import {EditorContent, BubbleMenu } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Code,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
//   HighlighterCircle,
  Palette,
  Undo,
  Redo
} from 'lucide-react';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().toggleLink({ href: url }).run();
    }
  };

  const setColor = () => {
    const color = window.prompt('Enter color (hex, rgb, or color name)');
    if (color) {
      editor.chain().focus().setColor(color).run();
    }
  };

  return (
    <div className="border-b border-gray-200 p-2 mb-4 flex flex-wrap gap-1">
      {/* Text Style Controls */}
      <button
      type='button'
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        title="Bold"
      >
        <Bold size={16} />
      </button>
      <button
      type='button'
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        title="Italic"
      >
        <Italic size={16} />
      </button>
      <button
      type='button'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
        title="Underline"
      >
        <UnderlineIcon size={16} />
      </button>
      <button
      type='button'
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}
        title="Strikethrough"
      >
        <Strikethrough size={16} />
      </button>
      <button
      type='button'
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('code') ? 'bg-gray-200' : ''}`}
        title="Code"
      >
        <Code size={16} />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1 self-center" />

      {/* Alignment Controls */}
      <button
      type='button'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}`}
        title="Align Left"
      >
        <AlignLeft size={16} />
      </button>
      <button
      type='button'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}`}
        title="Align Center"
      >
        <AlignCenter size={16} />
      </button>
      <button
      type='button'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}`}
        title="Align Right"
      >
        <AlignRight size={16} />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1 self-center" />

      {/* List Controls */}
      <button
      type='button'
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        title="Bullet List"
      >
        <List size={16} />
      </button>
      <button
      type='button'
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
        title="Numbered List"
      >
        <ListOrdered size={16} />
      </button>
      <button
      type='button'
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
        title="Quote"
      >
        <Quote size={16} />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1 self-center" />

      {/* Heading Controls */}
      <button
      type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
        title="Heading 1"
      >
        <Heading1 size={16} />
      </button>
      <button
      type='button'
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
        title="Heading 2"
      >
        <Heading2 size={16} />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1 self-center" />

      {/* Special Features */}
      <button
      type='button'
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('highlight') ? 'bg-gray-200' : ''}`}
        title="Highlight"
      >
        {/* <HighlighterCircle size={16} /> */}
      </button>
      <button
      type='button'
        onClick={setColor}
        className="p-2 rounded hover:bg-gray-100"
        title="Text Color"
      >
        <Palette size={16} />
      </button>
      <button
      type='button'
        onClick={addLink}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
        title="Add Link"
      >
        <LinkIcon size={16} />
      </button>
      <button
      type='button'
        onClick={addImage}
        className="p-2 rounded hover:bg-gray-100"
        title="Add Image"
      >
        <ImageIcon size={16} />
      </button>

      <div className="w-px h-6 bg-gray-200 mx-1 self-center" />

      {/* Undo/Redo */}
      <button
      type='button'
        onClick={() => editor.chain().focus().undo().run()}
        className="p-2 rounded hover:bg-gray-100"
        title="Undo"
      >
        <Undo size={16} />
      </button>
      <button
      type='button'
        onClick={() => editor.chain().focus().redo().run()}
        className="p-2 rounded hover:bg-gray-100"
        title="Redo"
      >
        <Redo size={16} />
      </button>
    </div>
  );
};

const RichTextEditor = ({editor}) => {
  
  return (
    <div className="w-full border rounded-lg overflow-hidden">
      <MenuBar editor={editor} />
      <div className="p-4 min-h-[300px]">
        <EditorContent editor={editor} />
      </div>
      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
          <div className="bg-white shadow-lg rounded-lg border flex gap-1 p-1">
            <button
            type='button'
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
            >
              <Bold size={14} />
            </button>
            <button
            type='button'
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
            >
              <Italic size={14} />
            </button>
            <button
            type='button'
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('highlight') ? 'bg-gray-200' : ''}`}
            >
              {/* <HighlighterCircle size={14} /> */}
            </button>
          </div>
        </BubbleMenu>
      )}
    </div>
  );
};

export default RichTextEditor;
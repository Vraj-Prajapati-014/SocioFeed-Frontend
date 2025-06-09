import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import Card from '../../../components/common/Card/Card';
import Input from '../../../components/common/Input/Input';
import Button from '../../../components/common/Button/Button';
import Spinner from '../../../components/common/Spinner/Spinner';
import { useCreatePost } from '../hooks/useCreatePost';
import { POST_CONSTANTS } from '../constants/postConstants';
import TiptapEditor from '../../../components/TipTap/TiptapEditor';
import { useContext } from 'react';
import ThemeContext from '../../../utils/context/ThemeContext';

const CreatePost = ({ onSuccess }) => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';
  const [content, setContent] = useState('');
  const [media, setMedia] = useState([]);
  const [editor, setEditor] = useState(null);
  const { handleCreatePost, loading, error } = useCreatePost();

  // Handle image uploads
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    console.log('Selected files:', files); // Debug: Log the selected files
    if (files.length + media.length > POST_CONSTANTS.MAX_IMAGES_PER_POST) {
      alert(`Maximum ${POST_CONSTANTS.MAX_IMAGES_PER_POST} images allowed`);
      return;
    }
    setMedia([...media, ...files]);
  };

  // Remove an image from the media array
  const handleRemoveImage = (index) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  // Handle form submission
  const handleSubmit = () => {
    handleCreatePost(content, media, () => {
      setContent('');
      setMedia([]);
      onSuccess();
    });
  };

  // Calculate content length (strip HTML tags for accurate character count)
  const getTextContentLength = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent.length;
  };

  const contentLength = getTextContentLength(content);

  // Update content when editor changes, respecting max length
  const handleEditorUpdate = (html) => {
    const textLength = getTextContentLength(html);
    if (textLength <= POST_CONSTANTS.MAX_CONTENT_LENGTH) {
      setContent(html);
    } else {
      const div = document.createElement('div');
      div.innerHTML = html;
      const text = div.textContent.slice(0, POST_CONSTANTS.MAX_CONTENT_LENGTH);
      const truncatedHtml = `<p>${text}</p>`;
      setContent(truncatedHtml);
      if (editor) {
        editor.commands.setContent(truncatedHtml);
      }
    }
  };

  return (
    <div className={`min-h-screen w-full py-6 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Card
        elevation={2}
        className={`w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 rounded-xl shadow-lg ${
          isDark ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <Box className="space-y-6">
          {/* Tiptap Editor for Post Content */}
          <Box>
            <Typography
              className={`text-sm mb-2 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            >
              What's on your mind?
            </Typography>
            <TiptapEditor
              content={content}
              onUpdate={handleEditorUpdate}
              setEditor={setEditor}
              isDark={isDark}
            />
            <Typography
              variant="caption"
              className={`mt-1 block text-sm ${
                contentLength > POST_CONSTANTS.MAX_CONTENT_LENGTH
                  ? 'text-red-400'
                  : isDark
                  ? 'text-gray-400'
                  : 'text-gray-500'
              }`}
            >
              {contentLength}/{POST_CONSTANTS.MAX_CONTENT_LENGTH}
            </Typography>
          </Box>

          {/* Image Upload Section */}
          <Box className="flex flex-col space-y-2">
            <Typography
              className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Add Images (up to {POST_CONSTANTS.MAX_IMAGES_PER_POST})
            </Typography>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className={`block w-full text-sm bg-transparent transition-all duration-200 ${
                isDark
                  ? 'text-gray-200 file:bg-blue-600 file:text-white file:hover:bg-blue-700'
                  : 'text-gray-600 file:bg-blue-500 file:text-white file:hover:bg-blue-600'
              } file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {/* <Typography
              variant="caption"
              className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
            >
              Hold Ctrl (Windows) or Command (Mac) to select multiple files
            </Typography> */}
          </Box>

          {/* Image Previews */}
          {media.length > 0 && (
            <Box className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {media.map((file, index) => (
                <Box key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg shadow-sm"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors duration-200"
                    aria-label="Remove image"
                  >
                    ✕
                  </button>
                </Box>
              ))}
            </Box>
          )}

          {/* Error Message */}
          {error && contentLength <= POST_CONSTANTS.MAX_CONTENT_LENGTH && (
            <Typography
              variant="body2"
              className={isDark ? 'text-red-400' : 'text-red-500'}
            >
              {error}
            </Typography>
          )}

          {/* Submit Button (Centered) */}
          <Box className="flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={
                loading ||
                !content.trim() ||
                contentLength > POST_CONSTANTS.MAX_CONTENT_LENGTH
              }
              className={`px-8 py-2 rounded-lg text-white font-medium transition-all duration-200 shadow-sm ${
                isDark
                  ? 'bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600'
                  : 'bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? <Spinner size="small" /> : 'Post'}
            </Button>
          </Box>
        </Box>
      </Card>
    </div>
  );
};

export default CreatePost;
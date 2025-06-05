import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import Card from '../../../components/common/Card/Card';
import Input from '../../../components/common/Input/Input'
import Button from '../../../components/common/Button/Button';
import Spinner from '../../../components/common/Spinner/Spinner';
import { useCreatePost } from '../hooks/useCreatePost';
import { POST_CONSTANTS } from '../constants/postConstants';


const CreatePost = ({ onSuccess }) => {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState([]);
  const { handleCreatePost, loading, error } = useCreatePost();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + media.length > POST_CONSTANTS.MAX_IMAGES_PER_POST) {
      alert(`Maximum ${POST_CONSTANTS.MAX_IMAGES_PER_POST} images allowed`);
      return;
    }
    setMedia([...media, ...files]);
  };

  const handleRemoveImage = (index) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    handleCreatePost(content, media, () => {
      setContent('');
      setMedia([]);
      onSuccess();
    });
  };

  return (
    <Card elevation={2} className="w-full max-w-2xl mx-auto p-4 sm:p-6">
      <Typography
        variant="h6"
        className="mb-4 text-gray-800 font-semibold text-lg sm:text-xl"
      >
        Create a Post
      </Typography>

      <Box className="space-y-4">
        {/* Text Input for Post Content */}
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's on your mind?"
          multiline
          rows={4}
          className="w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          error={!!error || content.length > POST_CONSTANTS.MAX_CONTENT_LENGTH}
          helperText={
            content.length > POST_CONSTANTS.MAX_CONTENT_LENGTH
              ? `Content exceeds maximum length of ${POST_CONSTANTS.MAX_CONTENT_LENGTH} characters`
              : `${content.length}/${POST_CONSTANTS.MAX_CONTENT_LENGTH}`
          }
        />

        {/* Image Upload Section */}
        <Box className="flex flex-col space-y-2">
          <label className="text-sm text-gray-600">
            Add Images (up to {POST_CONSTANTS.MAX_IMAGES_PER_POST})
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
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
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  aria-label="Remove image"
                >
                  ✕
                </button>
              </Box>
            ))}
          </Box>
        )}

        {/* Error Message */}
        {error && content.length <= POST_CONSTANTS.MAX_CONTENT_LENGTH && (
          <Typography variant="body2" className="text-red-500">
            {error}
          </Typography>
        )}

        {/* Submit Button */}
        <Box className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading || !content.trim() || content.length > POST_CONSTANTS.MAX_CONTENT_LENGTH}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
          >
            {loading ? <Spinner size="small" /> : 'Post'}
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default CreatePost;
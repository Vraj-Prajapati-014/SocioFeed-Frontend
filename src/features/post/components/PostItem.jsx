import React, { useState, useContext } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Favorite, FavoriteBorder, Comment, Share } from '@mui/icons-material';
import Card from '../../../components/common/Card/Card';
import Button from '../../../components/common/Button/Button';
import ThemeContext from '../../../utils/context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const PostItem = ({ post }) => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false); // Placeholder for like state
  const [likesCount, setLikesCount] = useState(post.likesCount || 0); // Placeholder for likes count

  const handleLikeToggle = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    // TODO: Call API to update like status (e.g., /posts/:id/like)
  };

  const handleCommentClick = () => {
    // Navigate to a comments page or open a modal
    // For now, log to console
    console.log('Navigate to comments for post:', post.id);
  };

  const handleShareClick = () => {
    // Implement share functionality (e.g., copy link, share to other apps)
    console.log('Share post:', post.id);
  };

  const handleProfileClick = () => {
    navigate(`/profile/${post.author.username}`);
  };

  return (
    <Card className="w-full">
      {/* Post Header: Author Info */}
      <Box className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <Box
          component="img"
          src={post.author?.avatarUrl || '/default-avatar.png'}
          alt={post.author?.username || 'Unknown'}
          className="w-10 h-10 rounded-full mr-3 cursor-pointer"
          onClick={handleProfileClick}
        />
        <Typography
          variant="subtitle1"
          className="font-semibold cursor-pointer"
          onClick={handleProfileClick}
        >
          {post.author?.username || 'Unknown User'}
        </Typography>
      </Box>

      {/* Post Content */}
      <Box className="p-4">
        {post.content && (
          <Typography
            variant="body1"
            className={theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}
          >
            {post.content}
          </Typography>
        )}

        {/* Post Images (Carousel Placeholder) */}
        {post.images && post.images.length > 0 && (
          <Box className="mt-4">
            {/* Placeholder for PostCarousel.jsx */}
            <Box className="w-full h-64 bg-gray-200 dark:bg-gray-600 flex items-center justify-center rounded-lg">
              <Typography>Image Carousel Placeholder (Post ID: {post.id})</Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* Post Interactions */}
      <Box className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Box className="flex items-center justify-between mb-2">
          <Box className="flex items-center space-x-2">
            <IconButton onClick={handleLikeToggle}>
              {liked ? (
                <Favorite className="text-red-500" />
              ) : (
                <FavoriteBorder className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
              )}
            </IconButton>
            <IconButton onClick={handleCommentClick}>
              <Comment className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
            </IconButton>
            <IconButton onClick={handleShareClick}>
              <Share className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
            </IconButton>
          </Box>
          <Typography
            variant="caption"
            className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
          >
            {likesCount} likes
          </Typography>
        </Box>

        {/* Comments Preview */}
        {post.commentsCount > 0 && (
          <Typography
            variant="caption"
            className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}
          >
            View all {post.commentsCount} comments
          </Typography>
        )}

        {/* Add Comment Input (Placeholder) */}
        <Box className="mt-2 flex items-center">
          <input
            type="text"
            placeholder="Add a comment..."
            className={`flex-1 p-2 rounded-lg border ${
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-gray-300'
                : 'bg-gray-100 border-gray-300 text-gray-800'
            }`}
          />
          <Button className="ml-2" onClick={() => console.log('Post comment for post:', post.id)}>
            Post
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

export default PostItem;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Avatar } from '@mui/material';
import PostCarousel from './PostCarousel';
import PostInteraction from './PostInteraction';
import Card from '../../../components/common/Card/Card';
import ThemeContext from '../../../utils/context/ThemeContext';

const PostItem = ({ post }) => {
  const { theme } = React.useContext(ThemeContext);
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (!post?.id) {
      console.error('Missing post ID:', post);
      return;
    }
    navigate(`/posts/${post.id}`);
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (!post?.author?.id) {
      console.error('Missing author ID for post:', post);
      return;
    }
    navigate(`/profile/${post.author.id}`, { state: { username: post.author.username } });
  };

  if (!post?.author) {
    console.warn('Post missing author data:', post);
    return (
      <Card className="w-full">
        <Box className="p-4">
          <Typography variant="body2" color="error">
            Error: Invalid post data (missing author)
          </Typography>
        </Box>
      </Card>
    );
  }

  return (
    <Card className="w-full cursor-pointer" onClick={handleCardClick}>
      <Box className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <Avatar
          src={post.author?.avatarUrl || '/default-avatar.png'}
          alt={post.author.username || 'Unknown'}
          className="w-10 h-10 rounded-full mr-3 cursor-pointer"
          onClick={handleProfileClick}
        />
        <Typography
          variant="subtitle1"
          className="font-semibold cursor-pointer"
          onClick={handleProfileClick}
        >
          {post.author.username || 'Unknown User'}
        </Typography>
      </Box>
      <Box className="p-4">
        {post.content && (
          <Typography
            variant="body1"
            className={theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}
          >
            {post.content}
          </Typography>
        )}
        {post.images && post.images.length > 0 && (
          <Box className="mt-4">
            <PostCarousel images={post.images.map(img => [img.imageUrl])} />
          </Box>
        )}
      </Box>
      <Box
        className="p-4 border-t border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()} // Prevent interaction clicks from navigating
      >
        <PostInteraction post={post} />
      </Box>
    </Card>
  );
};

export default PostItem;
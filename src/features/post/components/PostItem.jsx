import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import PostCarousel from './PostCarousel';
import PostInteraction from './PostInteraction';
import Card from '../../../components/common/Card/Card';
import ThemeContext from '../../../utils/context/ThemeContext';
import useAuth from '../../auth/hooks/useAuth';
import { usePosts } from '../hooks/usePosts';

const PostItem = ({ post, hideHeader = false }) => {
  const { theme } = React.useContext(ThemeContext);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { handleDeletePost, loading } = usePosts();

  const handleProfileClick = (e) => {
    e.stopPropagation();
    if (!post?.author?.id) {
      console.error('Missing author ID for post:', post);
      return;
    }
    navigate(`/profile/${post.author.id}`, { state: { username: post.author.username } });
  };

  const handleDelete = () => {
    // if (window.confirm('Are you sure you want to delete this post?')) {
      handleDeletePost(post.id);
    // }
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
    <Card
      className="w-full h-full flex flex-col"
      sx={{
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: theme === 'dark' ? '#333' : '#fff',
      }}
    >
      <Box className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {!hideHeader && (
          <Box className="flex items-center">
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
        )}
        {post.author.id === user?.id && (
          <IconButton
            size="small"
            onClick={handleDelete}
            disabled={loading.delete?.[post.id]}
          >
            <Delete className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
          </IconButton>
        )}
      </Box>
      <Box className="p-4 flex-1">
        {post.content && (
          <Typography
            variant="body1"
            component="div"
            className={theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}
        {post.images && post.images.length > 0 && (
          <Box className="mt-4">
            <PostCarousel
              images={post.images}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            />
          </Box>
        )}
      </Box>
      <Box
        className="p-4 border-t border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <PostInteraction post={post} />
      </Box>
    </Card>
  );
};

export default PostItem;
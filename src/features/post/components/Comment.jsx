import React, { useState } from 'react';
import { Box, ListItem, ListItemAvatar, ListItemText, Avatar, Typography, IconButton, TextField } from '@mui/material';
import { Favorite, FavoriteBorder, Delete } from '@mui/icons-material';
import { useComments } from '../hooks/useComments';
import ThemeContext from '../../../utils/context/ThemeContext';

const Comment = ({ comment, postId, fetchPosts, user, level = 0 }) => {
  const { theme } = React.useContext(ThemeContext);
  const [replyContent, setReplyContent] = useState('');
  const [showReplyInput, setShowReplyInput] = useState(false);

  const { handleCreateComment, handleLikeComment, handleDeleteComment, error, loading } = useComments(postId, fetchPosts);

  const handleLikeToggle = () => {
    handleLikeComment(comment.id, comment.hasLiked, comment.likesCount);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      handleDeleteComment(comment.id);
    }
  };

  return (
    <Box className={level > 0 ? 'ml-8 pl-4 border-l-2 border-gray-200 dark:border-gray-700' : ''} sx={{ mb: 2 }}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar src={comment.user?.avatarUrl || '/default-avatar.png'} alt={comment.user?.username || 'Unknown'} />
        </ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant="body2" className="font-semibold">
              {comment.user?.username || 'Unknown User'}
            </Typography>
          }
          secondary={
            <>
              <Typography
                variant="body2"
                className={theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}
              >
                {comment.content}
              </Typography>
              <Box className="flex gap-2 mt-2">
                <IconButton size="small" onClick={handleLikeToggle} disabled={loading}>
                  {comment.hasLiked ? (
                    <Favorite className="text-red-500" />
                  ) : (
                    <FavoriteBorder className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                  )}
                  <Typography variant="caption" className="ml-1">
                    {comment.likesCount || 0}
                  </Typography>
                </IconButton>
                <IconButton size="small" onClick={() => setShowReplyInput(!showReplyInput)}>
                  <Typography variant="caption">Reply</Typography>
                </IconButton>
                {comment.userId === user?.id && (
                  <IconButton size="small" onClick={handleDelete}>
                    <Delete className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} />
                  </IconButton>
                )}
              </Box>
              {showReplyInput && (
                <Box className="mt-2">
                  <TextField
                    fullWidth
                    multiline
                    rows={2}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    variant="outlined"
                    size="small"
                  />
                  <Box className="mt-2">
                    <IconButton
                      onClick={() => {
                        handleCreateComment(replyContent, comment.id);
                        setReplyContent('');
                        setShowReplyInput(false);
                      }}
                      variant="contained"
                      size="small"
                    >
                      <Typography variant="caption">Submit</Typography>
                    </IconButton>
                    <IconButton onClick={() => setShowReplyInput(false)} size="small" className="ml-2">
                      <Typography variant="caption">Cancel</Typography>
                    </IconButton>
                  </Box>
                </Box>
              )}
              {error && (
                <Typography color="error" variant="caption" className="mt-2">
                  {error}
                </Typography>
              )}
            </>
          }
        />
      </ListItem>
      {comment.replies?.length > 0 && level < 2 && comment.replies.map(reply => (
        <Comment
          key={reply.id}
          comment={reply}
          postId={postId}
          fetchPosts={fetchPosts}
          user={user}
          level={level + 1}
        />
      ))}
    </Box>
  );
};

export default Comment;
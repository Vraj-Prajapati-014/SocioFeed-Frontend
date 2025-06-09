import React from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import SkeletonLoader from '../../../components/SkeletonLoader/SkeletonLoader';
import ErrorMessage from '../../../components/ErrorMessage/ErrorMessage';

const SearchHistory = ({ searchHistory, isLoading, isError, error, refetch, deleteSearchHistoryEntry, isDeleting }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return <SkeletonLoader type="list" count={3} />;
  }

  if (isError) {
    return <ErrorMessage error={error} onRetry={refetch} />;
  }

  return (
    <Box className="p-4">
      <Typography variant="h6" className="mb-4">
        Recent Searches
      </Typography>
      {searchHistory.length > 0 ? (
        searchHistory.map(entry => (
          <Box key={entry.id} className="flex items-center justify-between p-2">
            <Box
              className="flex items-center cursor-pointer"
              onClick={() => navigate(`/profile/${entry.user.id}`, { state: { username: entry.user.username } })}
            >
              <Avatar
                src={entry.user.avatarUrl || '/default-avatar.png'}
                alt={entry.user.username}
                className="w-10 h-10 mr-3"
              />
              {/* Use a span or div for the username to avoid nesting issues */}
              <Typography variant="body1" component="span">
                {entry.user.username}
              </Typography>
            </Box>
            <IconButton
              onClick={() => deleteSearchHistoryEntry(entry.id)}
              disabled={isDeleting}
              className="text-gray-500 hover:text-red-500"
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        ))
      ) : (
        <Typography variant="body1" component="div" className="text-gray-500 dark:text-gray-400">
          No recent searches.
        </Typography>
      )}
    </Box>
  );
};

export default SearchHistory;
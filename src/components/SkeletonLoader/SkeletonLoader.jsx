import React from 'react';
import { Box, Skeleton } from '@mui/material';

const SkeletonLoader = ({ type = 'post', count = 1 }) => {
  const renderPostSkeleton = () => (
    <Box className="w-full mb-6">
      <Box className="flex items-center p-4">
        <Skeleton variant="circular" width={40} height={40} className="mr-3" />
        <Skeleton variant="text" width="40%" />
      </Box>
      <Skeleton variant="rectangular" width="100%" height={200} className="mx-4" />
      <Box className="p-4">
        <Skeleton variant="text" width="80%" />
        <Skeleton variant="text" width="60%" className="mt-2" />
        <Box className="flex mt-2">
          <Skeleton variant="circular" width={24} height={24} className="mr-2" />
          <Skeleton variant="circular" width={24} height={24} className="mr-2" />
          <Skeleton variant="circular" width={24} height={24} />
        </Box>
      </Box>
    </Box>
  );

  const renderProfileSkeleton = () => (
    <Box className="w-full">
      <Box className="flex items-center p-4">
        <Skeleton variant="circular" width={80} height={80} className="mr-4" />
        <Box className="flex-1">
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="50%" className="mt-2" />
        </Box>
      </Box>
      <Box className="p-4">
        <Skeleton variant="rectangular" width="100%" height={40} />
      </Box>
    </Box>
  );

  const renderListSkeleton = () => (
    <Box className="w-full">
      {[...Array(3)].map((_, index) => (
        <Box key={index} className="flex items-center p-2">
          <Skeleton variant="circular" width={40} height={40} className="mr-3" />
          <Skeleton variant="text" width="50%" />
        </Box>
      ))}
    </Box>
  );

  const skeletons = {
    post: renderPostSkeleton,
    profile: renderProfileSkeleton,
    list: renderListSkeleton,
  };

  const selectedSkeleton = skeletons[type] || renderPostSkeleton;

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <Box key={index}>{selectedSkeleton()}</Box>
      ))}
    </>
  );
};

export default SkeletonLoader;
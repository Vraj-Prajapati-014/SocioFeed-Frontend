import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Box } from '@mui/material';
import Spinner from '../common/Spinner/Spinner';

const InfiniteScroll = ({ fetchNextPage, hasNextPage, isFetchingNextPage, children, endMessage }) => {
  const { ref, inView } = useInView({
    threshold: 0.1, // Trigger when 10% of the element is in view
    rootMargin: '200px', // Start fetching 200px before the element comes into view
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <Box>
      {children}
      {hasNextPage && (
        <Box ref={ref} className="flex justify-center my-4">
          {isFetchingNextPage ? (
            <Spinner />
          ) : (
            <Box className="h-10" /> // Placeholder to trigger inView
          )}
        </Box>
      )}
      {!hasNextPage && endMessage && (
        <Box className="text-center my-4">
          <p className="text-gray-500 dark:text-gray-400">{endMessage}</p>
        </Box>
      )}
    </Box>
  );
};

export default InfiniteScroll;
import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

const PostCarousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentMedia = images[currentIndex];

  return (
    <Box className="relative w-full h-96 overflow-hidden rounded-lg">
      <Box className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        {currentMedia.mediaType === 'video' ? (
          <video
            src={currentMedia.imageUrl}
            controls
            className="w-full h-full object-contain rounded-lg"
            onError={(e) => console.error('Error loading video:', e)}
          />
        ) : (
          <img
            src={currentMedia.imageUrl}
            alt={`Post media ${currentIndex + 1}`}
            className="w-full h-full object-contain rounded-lg"
            onError={(e) => console.error('Error loading image:', e)}
          />
        )}
      </Box>

      {images.length > 1 && (
        <>
          <IconButton
            onClick={handlePrev}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white rounded-full hover:bg-opacity-90 transition-opacity"
            sx={{ padding: '8px' }}
          >
            <ArrowBackIos fontSize="small" />
          </IconButton>
          <IconButton
            onClick={handleNext}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white rounded-full hover:bg-opacity-90 transition-opacity"
            sx={{ padding: '8px' }}
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        </>
      )}

      {images.length > 1 && (
        <Box className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
          {/* Left Arrow */}
          <IconButton
            onClick={handlePrev}
            className="bg-gray-800 bg-opacity-70 text-white rounded-full hover:bg-opacity-90 transition-opacity"
            sx={{ padding: '4px' }}
          >
            <ArrowBackIos fontSize="small" />
          </IconButton>

          <Typography
            variant="caption"
            className="text-white bg-gray-800 bg-opacity-70 px-3 py-1 rounded-full"
          >
            {currentIndex + 1}/{images.length}
          </Typography>

          <IconButton
            onClick={handleNext}
            className="bg-gray-800 bg-opacity-70 text-white rounded-full hover:bg-opacity-90 transition-opacity"
            sx={{ padding: '4px' }}
          >
            <ArrowForwardIos fontSize="small" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default PostCarousel;
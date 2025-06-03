export const getSpinnerStyles = {
  color: '#3b82f6',
  '& .MuiCircularProgress-circle': {
    strokeLinecap: 'round',
  },
  '.dark &': {
    color: '#60a5fa',
  },
  '@media (max-width: 600px)': {
    transform: 'scale(0.8)',
  },
};

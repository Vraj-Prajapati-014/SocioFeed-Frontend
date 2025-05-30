export const getCardStyles = elevation => ({
  padding: '16px',
  backgroundColor: '#ffffff', // Light theme default
  borderRadius: '8px',
  boxShadow: elevation === 0 ? 'none' : undefined,
  transition: 'box-shadow 0.3s ease',
  '.dark &': {
    backgroundColor: '#1f2937', // Dark theme
  },
});

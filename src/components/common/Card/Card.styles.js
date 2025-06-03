export const getCardStyles = elevation => ({
  padding: '24px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow:
    elevation === 0
      ? 'none'
      : elevation === 1
        ? '0 4px 6px rgba(0, 0, 0, 0.1)'
        : '0 6px 12px rgba(0, 0, 0, 0.15)',
  transition: 'box-shadow 0.3s ease',
  width: '100%',
  maxWidth: '400px',
  margin: '0 auto',
  '.dark &': {
    backgroundColor: '#1f2937',
    boxShadow:
      elevation === 0
        ? 'none'
        : elevation === 1
          ? '0 4px 6px rgba(0, 0, 0, 0.2)'
          : '0 6px 12px rgba(0, 0, 0, 0.25)',
  },
  '@media (max-width: 600px)': {
    padding: '16px',
    maxWidth: '90%',
    margin: '16px',
  },
  '@media (min-width: 601px) and (max-width: 960px)': {
    maxWidth: '500px',
    padding: '20px',
  },
});

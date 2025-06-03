export const getButtonStyles = (variant, size, disabled) => {
  const baseStyles = {
    textTransform: 'none',
    fontWeight: 600,
    transition: 'all 0.2s ease',
    borderRadius: '8px',
    boxShadow: disabled ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)',
    lineHeight: '1.5',
  };

  const variantStyles = {
    primary: {
      backgroundColor: disabled ? '#d1d5db' : '#3b82f6',
      color: '#ffffff',
      '&:hover': {
        backgroundColor: disabled ? '#d1d5db' : '#2563eb',
        boxShadow: disabled ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.15)',
        transform: disabled ? 'none' : 'translateY(-1px)',
      },
      '&:focus': {
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)',
      },
    },
    secondary: {
      backgroundColor: disabled ? '#d1d5db' : '#6b7280',
      color: '#ffffff',
      '&:hover': {
        backgroundColor: disabled ? '#d1d5db' : '#4b5563',
        boxShadow: disabled ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.15)',
        transform: disabled ? 'none' : 'translateY(-1px)',
      },
      '&:focus': {
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(107, 114, 128, 0.3)',
      },
    },
    outline: {
      backgroundColor: 'transparent',
      color: disabled ? '#d1d5db' : '#3b82f6',
      border: `1px solid ${disabled ? '#d1d5db' : '#3b82f6'}`,
      '&:hover': {
        backgroundColor: disabled ? 'transparent' : 'rgba(59, 130, 246, 0.1)',
        boxShadow: disabled ? 'none' : '0 4px 6px rgba(0, 0, 0, 0.15)',
      },
      '&:focus': {
        outline: 'none',
        boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)',
      },
    },
  };

  const sizeStyles = {
    small: {
      padding: '6px 12px',
      fontSize: '0.875rem',
    },
    medium: {
      padding: '8px 16px',
      fontSize: '1rem',
    },
    large: {
      padding: '12px 24px',
      fontSize: '1.125rem',
    },
  };

  return {
    ...baseStyles,
    ...(variantStyles[variant] || variantStyles.primary),
    ...(sizeStyles[size] || sizeStyles.medium),
    opacity: disabled ? 0.7 : 1,
    '@media (max-width: 600px)': {
      padding: size === 'small' ? '4px 10px' : size === 'medium' ? '6px 12px' : '8px 16px',
      fontSize: size === 'small' ? '0.75rem' : size === 'medium' ? '0.875rem' : '1rem',
    },
  };
};

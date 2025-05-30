// import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Button as MuiButton } from '@mui/material';
import { getButtonStyles } from './Button.styles';
import { ButtonPropTypes } from './Button.types';

const StyledButton = styled(MuiButton)(({ variant, size, disabled }) => ({
  ...getButtonStyles(variant, size, disabled),
}));

const Button = ({
  children,
  // variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) => {
  return (
    <StyledButton
      variant="contained"
      size={size}
      disabled={disabled}
      onClick={onClick}
      type={type}
      className={`rounded-lg ${className}`}
      {...rest}
    >
      {children}
    </StyledButton>
  );
};

Button.propTypes = ButtonPropTypes;

export default Button;

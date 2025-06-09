import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { TextField } from '@mui/material';
import { getInputStyles } from './Input.styles';
import { InputPropTypes } from './Input.types';

const StyledTextField = styled(TextField)(getInputStyles);

const Input = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  placeholder,
  required = false,
  className = '',
  ...rest
}) => {
  return (
    <StyledTextField
      id={id}
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      error={!!error} // Convert error string to boolean
      helperText={error || helperText} // Use error string as helperText
      disabled={disabled}
      placeholder={placeholder}
      required={required}
      className={className}
      fullWidth
      {...rest}
    />
  );
};

Input.propTypes = InputPropTypes;

export default Input;
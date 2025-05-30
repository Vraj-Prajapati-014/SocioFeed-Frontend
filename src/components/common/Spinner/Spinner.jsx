// import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { CircularProgress } from '@mui/material';
import { getSpinnerStyles } from './Spinner.styles';
import { SpinnerPropTypes } from './Spinner.types';

const StyledSpinner = styled(CircularProgress)(getSpinnerStyles);

const Spinner = ({ size = 'medium', className = '', ...rest }) => {
  return (
    <StyledSpinner
      size={size === 'small' ? 20 : size === 'medium' ? 40 : 60}
      className={className}
      {...rest}
    />
  );
};

Spinner.propTypes = SpinnerPropTypes;

export default Spinner;

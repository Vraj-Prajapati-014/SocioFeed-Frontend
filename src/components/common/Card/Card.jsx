// import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Paper } from '@mui/material';
import { getCardStyles } from './Card.styles';
import { CardPropTypes } from './Card.types';

const StyledCard = styled(Paper)(({ elevation, className }) => ({
  ...getCardStyles(elevation, className),
}));

const Card = ({ children, elevation = 1, className = '', ...rest }) => {
  return (
    <StyledCard elevation={elevation} className={`rounded-lg ${className}`} {...rest}>
      {children}
    </StyledCard>
  );
};

Card.propTypes = CardPropTypes;

export default Card;

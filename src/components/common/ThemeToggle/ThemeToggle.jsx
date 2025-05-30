// import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { IconButton } from '@mui/material';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../../../store/slices/themeSlice';
import { getThemeToggleStyles } from './ThemeToggle.styles';
import { ThemeTogglePropTypes } from './ThemeToggle.types';

const StyledIconButton = styled(IconButton)(getThemeToggleStyles);

const ThemeToggle = ({ className = '', ...rest }) => {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme.mode);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <StyledIconButton onClick={handleToggle} className={className} {...rest}>
      {theme === 'light' ? <MdLightMode /> : <MdDarkMode />}
    </StyledIconButton>
  );
};

ThemeToggle.propTypes = ThemeTogglePropTypes;

export default ThemeToggle;

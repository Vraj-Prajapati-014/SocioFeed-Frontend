import { createContext, useContext } from 'react';

const ThemeContext = createContext({
  mode: 'light',
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;

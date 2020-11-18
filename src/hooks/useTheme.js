import * as React from 'react';
import ThemeContext from 'components/Context/ThemeContext';

const { useContext } = React;

const useTheme = () => useContext(ThemeContext);

export default useTheme;

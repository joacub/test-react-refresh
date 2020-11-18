import ThemeContext from 'components/Context/ThemeContext';

// This function takes a component...
const withTheme = Component => props => (
  <ThemeContext.Consumer>{context => <Component {...props} pageContext={context} />}</ThemeContext.Consumer>
); //eslint-disable-line
export default withTheme;

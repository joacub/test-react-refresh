import LangContext from 'components/Context/Lang';

// This function takes a component...
const withLang = Component => props => (
  <LangContext.Consumer>{context => <Component {...props} lang={context} />}</LangContext.Consumer>
); //eslint-disable-line
export default withLang;

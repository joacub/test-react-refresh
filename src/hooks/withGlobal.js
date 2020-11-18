import GlobalContext from 'components/Context/Global';

// This function takes a component...
// eslint-disable-next-line
const withGlobal = Component => props => (
  <GlobalContext.Consumer>{context => <Component {...props} globalContext={context} />}</GlobalContext.Consumer>
);
export default withGlobal;

import LocaleContext from 'components/Context/LocaleContext';

const withLocale = Component => (function LocaleComponent(props) {
  // ... and renders the wrapped component with the context theme!
  // Notice that we pass through any additional props as well
  return <LocaleContext.Consumer>{context => <Component {...props} {...context} />}</LocaleContext.Consumer>;
});

export default withLocale;

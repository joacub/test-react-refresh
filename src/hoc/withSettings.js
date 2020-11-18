import SettingsContext from 'components/Context/Settings';

// This function takes a component...
// ...and returns another component...
const withSettings = Component => (function SettingsComponent(props) {
  // ... and renders the wrapped component with the context theme!
  // Notice that we pass through any additional props as well
  return <SettingsContext.Consumer>{context => <Component {...props} {...context} />}</SettingsContext.Consumer>;
});

export default withSettings;

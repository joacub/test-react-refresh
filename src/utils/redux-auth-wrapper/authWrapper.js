import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';

const defaults = {
  AuthenticatingComponent: () => null, // dont render anything while authenticating
  FailureComponent: () => null, // dont render anything on failure of the predicate
  wrapperDisplayName: 'AuthWrapper'
};

export default args => {
  const { AuthenticatingComponent, FailureComponent, wrapperDisplayName } = {
    ...defaults,
    ...args
  };

  // Wraps the component that needs the auth enforcement
  function wrapComponent(DecoratedComponent) {
    const displayName = DecoratedComponent.displayName || DecoratedComponent.name || 'Component';

    class UserAuthWrapper extends PureComponent {
      render() {
        const { isAuthenticated, isAuthenticating } = this.props;
        if (isAuthenticated) {
          return <DecoratedComponent {...this.props} />;
        } if (isAuthenticating) {
          return <AuthenticatingComponent {...this.props} />;
        }
        return <FailureComponent {...this.props} />;
      }
    }

    UserAuthWrapper.defaultProps = {
      isAuthenticating: false
    };
    UserAuthWrapper.displayName = `${wrapperDisplayName}(${displayName})`;
    UserAuthWrapper.propTypes = {
      isAuthenticated: PropTypes.bool,
      isAuthenticating: PropTypes.bool
    };

    return hoistStatics(UserAuthWrapper, DecoratedComponent);
  }

  return wrapComponent;
};

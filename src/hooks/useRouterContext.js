import * as React from 'react';
import RouterContext from 'components/Context/RouterContext';

const { useContext } = React;

const useRouterContext = () => useContext(RouterContext);

export default useRouterContext;

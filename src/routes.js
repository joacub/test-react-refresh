// import Redirect from 'react-router/Redirect';
import App from 'containers/App/App';
import Home from 'containers/Home/Loadable';

const routes = [
  {
    element: <App />,
    path: '/',
    children: [
      // { path: '/', element: redirect },
      { path: '/', element: <Home /> },
    ]
  }
];

export default routes;

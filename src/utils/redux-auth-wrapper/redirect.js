import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useLocation } from 'react-router-dom';
import useRouterContext from 'hooks/useRouterContext';

const Redirect = ({
  redirect, getRedirectLocation, redirectPath, ...rest
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const context = useRouterContext();
  // eslint-disable-next-line camelcase
  useEffect(() => {
    redirect({ ...rest, navigate, location }, redirectPath);
  });

  if (context) {
    const data = getRedirectLocation({ ...rest, location }, redirectPath);
    context.url = data.pathname + data.search;
  }
  // Redirect should happen before this is rendered
  return null;
};

Redirect.propTypes = {
  redirectPath: PropTypes.string.isRequired,
  redirect: PropTypes.func.isRequired
};

export default Redirect;

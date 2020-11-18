import { matchRoutes } from 'react-router';
import propName from 'redial/lib/propName';

const getComponents = match => match.map(v => v.route.element)
  .reduce((result, element) => {
    if (element.type) {
      result.push({ ...element, [propName]: element.type[propName] });
    }
    return result;
  }, []);

const getParams = match => match.reduce((result, element) => {
  if (element.params) {
    return { ...result, ...element.params };
  }
  return result;
}, {});

const asyncMatchRoutes = (routes, pathname) => {
  const match = matchRoutes(routes, pathname);
  console.log(routes, 'routes');
  console.log(pathname, 'pathname');
  console.log(match, 'match');
  const params = getParams(match);
  const components = getComponents(match);
  return { components, match, params };
};

export default asyncMatchRoutes;

import ReactDOM from 'react-dom/server';

global.__webworker = true;

const Html = require('./helpers/Html').default;

export default () => `<!doctype html>${ReactDOM.renderToStaticMarkup(<Html />)}`;

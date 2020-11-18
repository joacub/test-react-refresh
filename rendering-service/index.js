// Not using ES6 `import` syntax here
// to avoid `require()`ing `@babel/register`
// which would parse the whole server-side bundle by default.

require('source-map-support/register');

const startServer = require('universal-webpack/server');
const settings = require('../webpack/universal-webpack-settings');
const configuration = process.env.NODE_ENV !== 'production' ? require('../webpack/dev.config') : require('../webpack/prod.config');

startServer(configuration, settings);

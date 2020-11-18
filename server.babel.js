//  enable runtime transpilation to use ES6/7 in node
require('core-js/stable');
require('regenerator-runtime/runtime');
const babelConfig = require('./babel.config');

const config = babelConfig({
  caller(callback) {
    callback('node');
  }
});

require('@babel/register')(config);

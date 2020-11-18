global.__DEVELOPMENT__ = process.env.NODE_ENV !== 'production';
require('../server.babel'); // babel registration (runtime transpilation for node)
require('../api/api');

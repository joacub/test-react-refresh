require('../server.babel');
var PrettyError = require('pretty-error');
var Express = require('express');
var webpack = require('webpack');
var { errorBox, successBox } = require('../src/utils/cli/formatting');
var pretty = new PrettyError();

var config = require('../src/config');
var webpackConfig = require('./dev.config');
var compiler = webpack(webpackConfig);

var host = config.host || 'localhost';
var port = (Number(config.port) + 1) || 3001;
var serverOptions = {
  publicPath: webpackConfig.output.publicPath,
  headers: { 
    'Access-Control-Allow-Origin': '*',
  },
  // watchOptions: {
  //   aggregateTimeout: 300,
  //   poll: 1000
  // },
  // writeToDisk(filePath) {
  //   return /dist\/node\//.test(filePath) || /loadable-stats/.test(filePath)
  // }
};

process.on('unhandledRejection', (reason, p) => process.stdout.write(errorBox(['Unhandled Rejection at: Promise ', p, pretty.render(reason)].join('\n'), 'WEBPACK DEV') + '\n\n\n\n'));
process.on('uncaughtException', (reason, p) => process.stdout.write(errorBox(['Unhandled Rejection at: Promise ', p, pretty.render(reason)].join('\n'), 'WEBPACK DEV') + '\n\n\n\n'));

var app = new Express();

app.use(require('webpack-dev-middleware')(compiler, serverOptions));
app.use(require('webpack-hot-middleware')(compiler));


process.on('SIGTERM', () => {
  console.log('Stopping dev server');
});

app.listen(port, function onAppListening(err) {
  if (err) {
    process.stdout.write(
      errorBox(pretty.render(err))
    );
  } else {
    console.info('==> 🚧  Webpack development server listening on port ' + port, 'WEBPACK DEV');
  }
});

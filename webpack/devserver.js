const config = require('../src/config');

const host = config.host || 'localhost';
const port = Number(process.env.PORT) + 1 || 3001;
const webSserverPort = process.env.PORT;
const apiPort = process.env.APIPORT;

// `webpack-dev-server` settings.
export const devServerConfig = {
  // The port to serve assets on.
  port,
  contentBase: `http://${host}:${port}`,
  historyApiFallback: true,
  compress: true,
  quiet: true,
  noInfo: true,
  hot: true,
  hotOnly: true,
  inline: true,
  lazy: false,
  overlay: true,
  // injectHot: true,
  liveReload: false,
  // Chrome won't allow querying `localhost` from `localhost`
  // so had to just proxy the `/api` path using `webpack-dev-server`.
  //
  // The Chrome error was:
  //
  // "Failed to load http://localhost:3003/example/users:
  //  Response to preflight request doesn't pass access control check:
  //  No 'Access-Control-Allow-Origin' header is present on the requested resource.
  //  Origin 'http://localhost:3000' is therefore not allowed access."
  //
  // https://stackoverflow.com/a/10892392/970769
  //
  proxy: [
    {
      context: path => path !== '/api' && path.indexOf('/api/') !== 0,
      target: `http://localhost:${webSserverPort}`,
    },
    {
      context: '/api',
      target: `http://${host}:${apiPort}`,
      pathRewrite: { '^/api': '' },
    },
  ],

  // This is just for forcing `webpack-dev-server`
  // to not disable proxying for root path (`/`).
  index: '',

  // Uncomment if using `index.html` instead of Server-Side Rendering.
  // https://webpack.js.org/configuration/dev-server/#devserver-historyapifallback
  // historyApiFallback: true,

  headers: {
    'Access-Control-Allow-Origin': '*',
  },
};

// Modifies webpack configuration to get all files
// from webpack development server.
export function setDevFileServer(configuration) {
  return {
    ...configuration,
    output: {
      ...configuration.output,
      publicPath: `http://localhost:${port}${configuration.output.publicPath}`,
    },
  };
}

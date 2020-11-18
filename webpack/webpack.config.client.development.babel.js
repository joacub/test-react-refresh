import webpack from 'webpack'
import { clientConfiguration } from 'universal-webpack'
import settings from './universal-webpack-settings'
import { devServerConfig, setDevFileServer } from './devserver'
import WebpackBar from 'webpackbar';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

const baseConfiguration = process.env.NODE_ENV !== 'production' ? require('./dev.config') : require('./prod.config');

baseConfiguration.plugins.push(new webpack.ProvidePlugin({
  process: 'process/browser',
}));
baseConfiguration.plugins.push(new WebpackBar({
  name: 'Webpack Client',
  color: 'red',
  fancy: true,
  profile: true,
  basic: false,
  reporters: ['fancy', 'profile', 'stats'],
}));
baseConfiguration.plugins.push(new webpack.DefinePlugin({
  __CLIENT__: true,
  __SERVER__: false,
  __DEVELOPMENT__: true,
  __DEVTOOLS__: true, // <-------- DISABLE redux-devtools HERE
}));
// baseConfiguration.plugins.push(
//   // hot reload
//   new webpack.HotModuleReplacementPlugin()
// );
baseConfiguration.plugins.push(
   // new ReactRefreshWebpackPlugin({
  //   overlay: {
  //     sockIntegration: 'whm',
  //   },
  // }),
  new ReactRefreshWebpackPlugin()
);

baseConfiguration.module.rules.push(
  {
    enforce: 'pre',
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loader: 'eslint-loader',
  }
);

let configuration = clientConfiguration(baseConfiguration, settings)

// `webpack-serve` can't set the correct `mode` by itself
// so setting `mode` to `"development"` explicitly.
// https://github.com/webpack-contrib/webpack-serve/issues/94
configuration.mode = 'development'

// Fetch all files from webpack development server.
configuration = setDevFileServer(configuration)

devServerConfig.publicPath = configuration.output.publicPath;

// Run `webpack-dev-server`.
configuration.devServer = devServerConfig
configuration.resolve.alias.stream = 'stream-browserify'

// configuration.plugins.push
// (
// 	// Prints more readable module names in the browser console on HMR updates.
// 	// new webpack.NamedModulesPlugin()
// )

export default configuration
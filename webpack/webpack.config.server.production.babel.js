import { serverConfiguration } from 'universal-webpack';
import settings from './universal-webpack-settings';
import webpackNodeExternal from 'webpack-node-externals';
import WebpackBar from 'webpackbar';
import webpack from 'webpack';
import path from 'path';

const baseConfiguration = process.env.NODE_ENV !== 'production' ? require('./dev.config') : require('./prod.config');

baseConfiguration.plugins.push(new WebpackBar({
  name: 'Webpack Server',
  fancy: true,
  profile: true,
  basic: false,
  reporters: ['fancy', 'profile', 'stats'],
}));
baseConfiguration.plugins.push(new webpack.DefinePlugin({
  __CLIENT__: false,
  __SERVER__: true,
  __DEVELOPMENT__: process.env.NODE_ENV !== 'production',
  __DEVTOOLS__: process.env.NODE_ENV !== 'production', // <-------- DISABLE redux-devtools HERE
}));

const config = serverConfiguration(baseConfiguration, settings);
config.externals = [
  '@loadable/component',
  webpackNodeExternal({
    allowlist: [
      /^@material-ui\/core\/styles\/colorManipulator/,
      /^react-select-virtualized/,
      /\.(css|jpeg|jpg|png|gif)$/
    ]
  }),
];

export default config;

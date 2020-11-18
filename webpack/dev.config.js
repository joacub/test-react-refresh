// Webpack config for development
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');

const projectRootPath = path.resolve(__dirname, '../');
const assetsPath = path.resolve(__dirname, '../static/dist');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const WebappWebpackPlugin = require('favicons-webpack-plugin');

const LoadablePlugin = require('@loadable/webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

const plugins = [];
if (!devMode) {
  // enable in production only
  plugins.push(new MiniCssExtractPlugin());
}
const webpackConfig = (module.exports = {
  target: 'web',
  mode: 'development',
  devtool: 'eval-source-map',
  context: path.resolve(__dirname, '..'),
  output: {
    path: assetsPath,
    filename: '[name]-[fullhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/dist/',
  },
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000,
  },
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          'thread-loader',
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        exclude: /node_modules(\/|\\)(?!(swagger-ui-react|prismjs|react-virtualized))/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              esModule: false,
              modules: false,
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(woff2|ttf|eot|pdf)$/,
        exclude: /node_modules/,
        loader: 'url-loader',
        options: {
          limit: false,
          limit: 1024,
          esModule: false,
        },
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
        exclude: [/node_modules/],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // Any png-image or woff-font below or equal to 5K
              // will be converted to inline base64 instead.
              limit: 1024,
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              esModule: false,
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              // webp: {
              //   quality: 75
              // }
            },
          },
        ],
      },
    ],
  },
  resolve: {
    fallback: {
      zlib: false,
      path: false,
      fs: false,
      tty: false,
      child_process: false,
      crypto: false,
      net: false,
      tls: false,
      https: false,
      http: false,
    },
    modules: ['src', 'node_modules'],
    extensions: ['.mjs', '.json', '.js', '.jsx'],
    alias: {
      modernizr$: `${projectRootPath}/.modernizrrc.js`,
      'yoga-layout': 'yoga-layout-prebuilt',
    },
  },
  plugins: [
    ...plugins,
    new webpack.IgnorePlugin(/webpack-stats\.json$/),

    new webpack.DefinePlugin({
      configuration: {
        webpackDevServer: 3001,
      },
    }),

    new LoadablePlugin({ writeToDisk: true }),

    new CleanWebpackPlugin(),

    // new WebappWebpackPlugin({
    //   logo: path.resolve('src/components/Img/logowm-extra-rounded.png'), // svg works too!
    //   cache: true,
    //   // Prefix path for generated assets
    //   prefix: 'assets/',
    //   // Inject html links/metadata (requires html-webpack-plugin)
    //   // false: disables injection
    //   // true: enables injection if that is not disabled in html-webpack-plugin
    //   // 'force': enables injection even if that is disabled in html-webpack-plugin
    //   inject: true,
    //   favicons: {
    //     appName: 'Bringer',
    //     appDescription: 'Bringer Parcel Services',
    //     developerName: 'Bringer',
    //     developerURL: 'https://bringerparcel.com', // prevent retrieving from the nearest package.json
    //     background: 'transparent',
    //     theme_color: '#fff',
    //   },
    // }),
  ],
});

const fs = require('fs');
// Webpack config for creating the production bundle.
const path = require('path');
const webpack = require('webpack');
const WebpackBar = require('webpackbar');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebappWebpackPlugin = require('favicons-webpack-plugin');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
// var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Terser = require('terser');
// var ReactLoadablePlugin = require('react-loadable/webpack').ReactLoadablePlugin;
const LoadablePlugin = require('@loadable/webpack-plugin');

const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
// var MinifyPlugin = require("babel-minify-webpack-plugin");

const projectRootPath = path.resolve(__dirname, '../');
const assetsPath = path.resolve(projectRootPath, './static/dist');

// https://github.com/halt-hammerzeit/webpack-isomorphic-tools
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(require('./webpack-isomorphic-tools'));

// var SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const { GenerateSW } = require('workbox-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');

const CopyPlugin = require('copy-webpack-plugin');

const hashFiles = (+new Date()).toString(36);

module.exports = {
  mode: 'production',
  node: {
    fs: 'empty'
  },
  // devtool: 'source-map',
  context: path.resolve(__dirname, '..'),
  entry: {
    main: [
      // 'bootstrap-loader',
      './src/client.js',
    ],
    // sw: './src/service-worker.js'
  },
  output: {
    // globalObject: "this",
    path: assetsPath,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/dist/',
  },
  performance: {
    hints: false,
  },
  optimization: {
    concatenateModules: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        // sourceMap: true,
        // extractComments: true,
        parallel: true,
        // sourceMap: true, // set to true if you want JS source maps
        terserOptions: {
          parallel: true,
          mangle: true,
          warnings: false,
          ie8: false,
          keep_fnames: false,
          compress: {
            passes: 2,
            warnings: false, // Suppress uglification warnings
            pure_getters: true,
            // unsafe: true,
            // unsafe_comps: true,
            // unused: false,
            // collapse_vars: false, // debug has a problem in production without this.
            dead_code: true,
          },
          output: {
            comments: false,
            beautify: false,
          },
          exclude: [/\.min\.js$/gi],
        },
      }),
    ],

    /** // TODO: remove in webpack v5 */
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minChunks: Infinity,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/](@feathers.*|jquery.*|@material.*|lodash.*|date-fns.*|react.*|redux.*)/,
          name: 'vendor',
          chunks: 'initial',
          enforce: true,
          // priority: -10
        },
        polyfills: {
          test: /[\\/]node_modules[\\/](core-js.*|@babel.*)/,
          name: 'polyfills',
          chunks: 'initial',
          enforce: true,
          // priority: -10
        },
        pdftools: {
          test: /[\\/]node_modules[\\/](@react-pdf\/renderer.*|react-pdf.*)/,
          name: 'pdftools',
          chunks: 'all',
          enforce: true,
          // priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        loader: 'webpack-modernizr-loader',
        test: /\.modernizrrc\.js$/,
        // Uncomment this when you use `JSON` format for configuration
        // type: 'javascript/auto'
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules(\/|\\)/,
        loader: 'babel-loader',
      },
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, '../node_modules/@feathersjs'),
          path.resolve(__dirname, '../node_modules/spider-detector'),
          path.resolve(__dirname, '../node_modules/striptags'),
          path.resolve(__dirname, '../node_modules/debug'),
        ],
        use: {
          loader: 'babel-loader',
          options: {
            ...JSON.parse(fs.readFileSync(path.resolve(__dirname, '../.babelrc'))),
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    browsers: ['last 2 versions', 'IE >= 8'],
                    node: 'current',
                  },
                  useBuiltIns: 'usage',
                  corejs: {
                    version: 3,
                    proposals: true,
                  },
                  modules: 'commonjs',
                  loose: true,
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          // 'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: false,
          mimetype: 'application/font-woff',
        },
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: false,
          mimetype: 'application/octet-stream',
        },
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          esModule: false,
        },
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 1024,
          mimetype: 'image/svg+xml',
          esModule: false,
        },
        exclude: [path.resolve(__dirname, '../src/components/Img')],
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
        options: {
          mimetype: 'image/svg+xml',
          esModule: false,
        },
        include: [path.resolve(__dirname, '../src/components/Img')],
      },
      {
        test: /\.(pdf)$/,
        loader: 'file-loader',
        options: {
          esModule: false,
        },
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        loader: 'url-loader',
        options: {
          limit: 1024,
          esModule: false,
        },
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
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
  resolve: {
    modules: ['src', 'node_modules'],
    extensions: ['.mjs', '.json', '.js', '.jsx'],
    alias: {
      modernizr$: `${projectRootPath}/.modernizrrc.js`,
      'yoga-layout': 'yoga-layout-prebuilt',
    },
  },
  plugins: [
    new WebpackBar({
      fancy: true,
      profile: true,
      basic: false,
      reporters: ['fancy', 'profile', 'stats'],
    }),

    new CleanWebpackPlugin(),

    // css files from the extract-text-plugin loader
    new MiniCssExtractPlugin({
      filename: '[name]-[chunkhash].css',
      // disable: false,
      allChunks: true,
    }),

    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"',
      __CLIENT__: true,
      __SERVER__: false,
      __DEVELOPMENT__: false,
      __DEVTOOLS__: false,
    }),

    // ignore dev config
    new webpack.IgnorePlugin(/\.\/dev/, /\/config$/, /^\.\/locale$/, /moment$/),

    // webpack v5
    // new webpack.IgnorePlugin(
    //   {
    //    resourceRegExp: /\.\/dev/
    //   },
    //   {
    //    resourceRegExp:/\/config$/
    //   },
    //   {
    //    resourceRegExp: /^\.\/locale$/
    //   },
    //   {
    //    resourceRegExp: /moment$/
    //   },
    //   ),

    // optimizations
    new LodashModuleReplacementPlugin({
      currying: true,
      placeholders: true,
    }),

    webpackIsomorphicToolsPlugin,

    // new ReactLoadablePlugin({
    //   filename: path.join(assetsPath, 'loadable-chunks.json')
    // }),
    new LoadablePlugin(),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/pwa.js',
    }),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
    }),

    new CopyPlugin({
      patterns: [
        {
          from: `${projectRootPath}/src/service-worker.js`,
          to: `${projectRootPath}/static/dist/sw-import.js`,
          async transform(content, path) {
            content = (await Terser.minify(content.toString(), { toplevel: true })).code;
            content = Buffer.from(content, 'utf8');
            return Buffer.from(content, 'utf8');
          },
        },
      ],
    }),

    // old implemention, saved just in case
    // new CopyPlugin([
    //   {
    //     from: projectRootPath + '/src/service-worker.js',
    //     to: projectRootPath + '/static/dist/sw-import.js',
    //     transform(content, path) {
    //       content = Terser.minify(content.toString(), { toplevel: true }).code;
    //       content = Buffer.from(content, 'utf8');
    //       return Buffer.from(content, 'utf8');
    //     },
    //   }
    // ]),

    new GenerateSW({
      // importWorkboxFrom: 'local',
      cacheId: 'Bringer-com',
      swDest: 'service-worker.js',
      offlineGoogleAnalytics: true,
      maximumFileSizeToCacheInBytes: 8388608,
      exclude: [/asset-manifest\.json$/, /loadable-chunks\.json$/, /loadable-stats\.json$/],
      // Ensure all our static, local assets are cached.
      include: [
        /\.ico$/,
        /\.js$/,
        /\.html$/,
        /\.css$/,
        /\.png$/,
        /\.jpg$/,
        /\.jpeg$/,
        /\.gif$/,
        /\.svg$/,
        /\.eot$/,
        /\.ttf$/,
        /\.woff$/,
        /\.woff2$/,
      ],
      // globStrict: false,
      modifyURLPrefix: { [path.dirname(assetsPath)]: '' },
      directoryIndex: '/',
      importScripts: [
        '/dist/sw-import.js',
        // {
        //   chunkName: 'sw'
        // }
      ],
      // navigateFallback: '/dist/index.html',
      runtimeCaching: [
        {
          urlPattern: /\/api\//,
          handler: 'NetworkFirst',
        },
        {
          urlPattern: /\/media\//,
          handler: 'StaleWhileRevalidate',
        },
        // {
        //   urlPattern: /\/uploads/,
        //   handler: 'StaleWhileRevalidate',
        //   options: {
        //     debug: false
        //   }
        // },
        {
          urlPattern: /\/dist\//,
          handler: 'StaleWhileRevalidate',
        },
      ],
    }),

    new WebappWebpackPlugin({
      logo: path.resolve('src/components/Img/logowm-extra-rounded.png'), // svg works too!
      cache: true,
      // Prefix path for generated assets
      prefix: 'assets/',
      // Inject html links/metadata (requires html-webpack-plugin)
      // false: disables injection
      // true: enables injection if that is not disabled in html-webpack-plugin
      // 'force': enables injection even if that is disabled in html-webpack-plugin
      inject: true,
      favicons: {
        appName: 'Bringer',
        appDescription: 'News, politics, stories, stay informed',
        developerName: 'Bringer',
        developerURL: 'https://bringerparcel.com', // prevent retrieving from the nearest package.json
        background: 'transparent',
        theme_color: '#fff',
      },
    }),
  ],
};

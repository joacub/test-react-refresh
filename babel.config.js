function isWebTarget(caller) {
  return Boolean(caller && caller.target === 'web');
}

function isWebpack(caller) {
  return Boolean(caller && caller.name === 'babel-loader');
}

const devMode = process.env.NODE_ENV !== 'production';

module.exports = api => {
  const web = api.caller(isWebTarget);
  const webpack = api.caller(isWebpack);
  const plugins = [];
  if (devMode && web) {
    plugins.push('react-refresh/babel');
  }

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: web ? 'entry' : undefined,
          corejs: web ? 'core-js@3' : false,
          targets: !web ? { node: 'current' } : undefined,
          modules: webpack ? false : 'commonjs',
        },
      ],
      [
        '@babel/preset-react',
        {
          runtime: 'automatic',
        },
      ],
    ],
    plugins: [
      ...plugins,
      'lodash',
      [
        'react-intl',
        {
          idInterpolationPattern: '[sha512:contenthash:base64:6]',
          extractFromFormatMessageCall: true,
          ast: true,
        },
      ],
      [
        '@babel/plugin-transform-runtime',
        {
          corejs: web
            ? {
              version: 3,
              proposals: true,
            }
            : false,
        },
      ],
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true,
        },
      ],
      '@loadable/babel-plugin',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-syntax-import-meta',
      '@babel/plugin-proposal-class-properties',
      '@babel/plugin-proposal-json-strings',
      '@babel/plugin-proposal-function-sent',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-numeric-separator',
      '@babel/plugin-proposal-throw-expressions',
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-proposal-logical-assignment-operators',
      '@babel/plugin-proposal-optional-chaining',
      [
        '@babel/plugin-proposal-pipeline-operator',
        {
          proposal: 'minimal',
        },
      ],
      ['@babel/plugin-proposal-nullish-coalescing-operator'],
      '@babel/plugin-proposal-do-expressions',
      '@babel/plugin-proposal-function-bind',
    ],
    env: {
      production: {
        plugins: [
          [
            'transform-react-remove-prop-types',
            {
              removeImport: true,
            },
          ],
          '@babel/plugin-transform-react-constant-elements',
        ],
      },
      development: {
        plugins: ['@babel/plugin-transform-react-jsx-source'],
      },
    },
  };
};

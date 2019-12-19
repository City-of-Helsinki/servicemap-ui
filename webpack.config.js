const webpack = require('webpack'); //to access built-in plugins
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const NODE_ENV = process.env.NODE_ENV;
const isEnvProduction = NODE_ENV === 'production';
const isEnvDevelopment = !isEnvProduction;

// Default API paths if environment variables are not set
const ACCESSIBILITY_SENTENCE_API = 'https://www.hel.fi/palvelukarttaws/rest/v4';
const SERVICEMAP_API = 'https://api.hel.fi/servicemap/v2';
const EVENTS_API = 'https://api.hel.fi/linkedevents/v1';
const RESERVATIONS_API = 'https://api.hel.fi/respa/v1';

const PRODUCTION_PREFIX = 'SM';

const js = {
  
  test: /\.(js|mjs|jsx|ts|tsx)$/,
  exclude: /node_modules/,
  loader: require.resolve('babel-loader'),
  options: {
    customize: require.resolve(
      'babel-preset-react-app/webpack-overrides'
    ),
    
    plugins: [
      [
        require.resolve('babel-plugin-named-asset-import'),
        {
          loaderMap: {
            svg: {
              ReactComponent: '@svgr/webpack?-svgo,+ref![path]',
            },
          },
        },
      ],
    ],
    // This is a feature of `babel-loader` for webpack (not Babel itself).
    // It enables caching results in ./node_modules/.cache/babel-loader/
    // directory for faster rebuilds.
    cacheDirectory: true,
    cacheCompression: isEnvProduction,
    compact: isEnvProduction,
  }
};

const fonts = (isClient = true) => ({
    test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
    use: [{
        loader: 'file-loader',
        options: {
          emitFile: isClient,
          name: `[name].[hash:8].[ext]`,
          outputPath: `/assets`,
          publicPath: '/assets'
        },
    }]
});

const icons = (isClient = true) => ({
  test: /\.(ico)(\?v=\d+\.\d+\.\d+)?$/,
  use: [{
      loader: 'file-loader',
      options: {
        emitFile: isClient,
        name: `[name].[hash:8].[ext]`,
        outputPath: `/assets/icons`,
        publicPath: '/assets/icons'
      },
  }]
});

const css = {
  test: /\.css$/,
  exclude: /node_modules/,
  use: [
    'isomorphic-style-loader',
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1
      }
    }
  ],
};

const serverConfig = {
  mode: isEnvProduction ? 'production' : 'development',
  target: 'node',
  node: {
    __dirname: false,
  },
  entry: {
    'index.js': path.resolve(__dirname, 'server/server.js'),
  },
  module: {
    rules: [
      {
        oneOf: [
          js,
          fonts(false),
          css
        ],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]',
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      'PORT': false,
      'SSR_FETCH_TIMEOUT': 2500,
      'ACCESSIBILITY_SENTENCE_API': ACCESSIBILITY_SENTENCE_API,
      'SERVICEMAP_API': SERVICEMAP_API,
      'EVENTS_API': EVENTS_API,
      'RESERVATIONS_API': RESERVATIONS_API,
      'PRODUCTION_PREFIX': PRODUCTION_PREFIX,
    }),
  ]
};

const clientConfig = {
  mode: isEnvProduction ? 'production' : 'development',
  target: 'web',
  entry: {
    'index.js': path.resolve(__dirname, 'src/client.js'),
  },
  module: {
    rules: [
      {
        oneOf: [
          js,
          fonts(),
          css,
          icons(),
        ],
      }
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist/src'),
    filename: '[name]',
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      'ACCESSIBILITY_SENTENCE_API': ACCESSIBILITY_SENTENCE_API,
      'SERVICEMAP_API': SERVICEMAP_API,
      'EVENTS_API': EVENTS_API,
      'RESERVATIONS_API': RESERVATIONS_API,
      'PRODUCTION_PREFIX': PRODUCTION_PREFIX,
    }),
  ]
};

module.exports = [serverConfig, clientConfig];

const webpack = require('webpack'); //to access built-in plugins
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const NODE_ENV = process.env.NODE_ENV;
const isEnvProduction = NODE_ENV === 'production';
const isEnvDevelopment = !isEnvProduction;

const js = {
  test: /\.(js|mjs|jsx|ts|tsx)$/,
  exclude: /node_modules/,
  loader: 'babel-loader',
  options: {
    // This is a feature of `babel-loader` for webpack (not Babel itself).
    // It enables caching results in ./node_modules/.cache/babel-loader/
    // directory for faster rebuilds.
    cacheDirectory: true,
    cacheCompression: isEnvProduction,
    compact: isEnvProduction,
  }
};

const fonts = (isClient = true) => ({
    test: /\.(woff(2)?|ttf|eot|svg|png)(\?v=\d+\.\d+\.\d+)?$/,
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
  include: [
    path.resolve(__dirname, "src"),
    /node_modules\/leaflet.markercluster/
  ],
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
  optimization: {
    minimize: false,
    concatenateModules: false,
  }
};

const clientConfig = {
  mode: isEnvProduction ? 'production' : 'development',
  target: 'web',
  entry: {
    'index.js': path.resolve(__dirname, 'client/client.js'),
  },
  resolve: {
    fallback: {
      // Needed to enable importing dotenv in the browser.  Although
      // dotenv is not used there, the code is shared with the server,
      // where dotenv *is* used.
      fs: false,
      "path": false,
    }
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
  devtool: isEnvDevelopment ? 'source-map' : undefined,
};

module.exports = [serverConfig, clientConfig];

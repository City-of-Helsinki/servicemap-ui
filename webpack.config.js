const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

const js = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['react', 'es2015'],
      plugins: ['transform-class-properties'],
    },
  },
};

const css = {
  test: /\.css$/,
  exclude: /node_modules/,
  use: 'css-loader',
};

const serverConfig = {
  mode: 'development',
  target: 'node',
  node: {
    __dirname: false,
  },
  externals: [nodeExternals()],
  entry: {
    'index.js': path.resolve(__dirname, 'src/server/index.js'),
  },
  module: {
    rules: [js, css],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]',
  },
};

const clientConfig = {
  mode: 'development',
  target: 'web',
  entry: {
    'index.js': path.resolve(__dirname, 'src/index.js'),
  },
  module: {
    rules: [js, css],
  },
  output: {
    path: path.resolve(__dirname, 'dist/src'),
    filename: '[name]',
  },
};

module.exports = [serverConfig, clientConfig];

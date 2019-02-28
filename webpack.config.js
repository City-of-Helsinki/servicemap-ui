const path = require('path');

const js = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: ['@babel/plugin-proposal-class-properties'],
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
  entry: {
    'index.js': path.resolve(__dirname, 'src/server.js'),
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
    'index.js': path.resolve(__dirname, 'src/client.js'),
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

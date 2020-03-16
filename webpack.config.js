const webpack = require('webpack'); //to access built-in plugins
const path = require('path');
const nodeExternals = require('webpack-node-externals');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const LoadablePlugin = require('@loadable/webpack-plugin')
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
    test: /\.(woff(2)?|ttf|eot|svg|jpg)(\?v=\d+\.\d+\.\d+)?$/,
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
  entry: path.resolve(__dirname, 'server/server.js'),
  externals: [nodeExternals({
      // excluding material ui from the build breaks the page styles
      whitelist: [/^@material-ui.*/]
  })],
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

  plugins: [new LoadablePlugin()],

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  optimization: {
    minimize: false,
    concatenateModules: false,
  }
};

const clientConfig = {
  mode: isEnvProduction ? 'production' : 'development',
  target: 'web',
  entry: path.resolve(__dirname, 'src/client.js'),
  node: {
    // Needed to enable importing dotenv in the browser.  Although
    // dotenv is not used there, the code is shared with the server,
    // where dotenv *is* used.
    fs: 'empty'
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

  plugins: [
    new LoadablePlugin(), 
    // new BundleAnalyzerPlugin() Use this to display bundle stats
  ],

  output: {
    path: path.resolve(__dirname, 'dist/src'),
    filename: '[name].js',
  }
};

module.exports = [serverConfig, clientConfig];

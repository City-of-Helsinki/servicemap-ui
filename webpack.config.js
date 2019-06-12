const path = require('path');

const NODE_ENV = process.env.NODE_ENV;
const isEnvProduction = NODE_ENV === 'production';
const isEnvDevelopment = !isEnvProduction;

const js = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env', '@babel/preset-react'],
      plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-runtime'],
    },
  },
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
          // Process application JS with Babel.
          // The preset includes JSX, Flow, TypeScript, and some ESnext features.
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: /src/,
            loader: require.resolve('babel-loader'),
            options: {
              customize: require.resolve(
                'babel-preset-react-app/webpack-overrides'
              ),
              // This is a feature of `babel-loader` for webpack (not Babel itself).
              // It enables caching results in ./node_modules/.cache/babel-loader/
              // directory for faster rebuilds.
              cacheDirectory: true,
              cacheCompression: isEnvProduction,
              compact: isEnvProduction,
            },
          },
          fonts(false),
          js,
          css
        ],
      },
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]',
  },
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
          // Process application JS with Babel.
          // The preset includes JSX, Flow, TypeScript, and some ESnext features.
          {
            test: /\.(js|mjs|jsx|ts|tsx)$/,
            include: /src/,
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
            },
          },
          // "file" loader makes sure those assets get served by WebpackDevServer.
          // When you `import` an asset, you get its (virtual) filename.
          // In production, they would get copied to the `build` folder.
          // This loader doesn't use a "test" so it will catch all modules
          // that fall through the other loaders.
          {
            loader: require.resolve('file-loader'),
            // Exclude `js` files to keep "css" loader working as it injects
            // its runtime that would otherwise be processed through "file" loader.
            // Also exclude `html` and `json` extensions so they get processed
            // by webpacks internal loaders.
            exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
            options: {
              name: '/static/media/[name].[hash:8].[ext]',
            },
          },
        ],
      }
    ],
  },
  output: {
    path: path.resolve(__dirname, 'dist/src'),
    filename: '[name]',
  },
};

module.exports = [serverConfig, clientConfig];

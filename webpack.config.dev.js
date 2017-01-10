const path = require('path');
const webpack = require('webpack');
const NODE_ENV = process.env.NODE_ENV;

module.exports = {
  target: 'web',

  devtool: 'cheap-module-eval-source-map',

  entry: [
    'babel-polyfill',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/dev-server',
    './src/main.js',
  ],

  output: {
    path: path.join(__dirname, '/dist/'),
    filename: 'bundle.js',
    pathInfo: true,
    publicPath: 'http://localhost:3000/dist/',
    hot: true,
  },

  resolve: {
    root: path.join(__dirname, ''),
    modulesDirectories: [
      'node_modules',
      'src',
      'src/components',
      'src/styles',
    ],
    extensions: ['', '.js', '.jsx'],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      __ENV__: NODE_ENV,
    }),
  ],

  module: {
    loaders: [
      {
        test: /\.scss$/, // sass files
        loader: 'style!css!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded',
      },
      {
        test: /\.(ttf|eot|svg|woff)(\?[a-z0-9]+)?$/, // font files
        loader: 'file-loader?name=[path][name].[ext]',
      },
      {
        test: /\.json$/, // font files
        loader: 'json',
      },
      {
        test: /\.(js|jsx)?$/, // react files
        exclude: /node_modules/,
        loaders: ['react-hot', 'babel?' + JSON.stringify({
          presets: ['es2015', 'stage-0', 'react'],
          plugins: ['transform-decorators-legacy']
        })],
      }
    ],

    noParse: /\.min\.js/,
  },
};

const path = require('path');
const webpack = require('webpack');
const NODE_ENV = process.env.NODE_ENV;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: '#source-map',

  // Capture timing information for each module
  profile: false,

  // Switch loaders to debug mode
  debug: false,

  // Report the first error as a hard error instead of tolerating it
  bail: true,

  entry: [
    'babel-polyfill',
    './src/main.js',
  ],

  output: {
    path: 'dist/',
    pathInfo: true,
    publicPath: '/dist/',
    filename: 'bundle.[hash].min.js',
  },

  resolve: {
    root: path.join(__dirname, ''),
    modulesDirectories: [
      'node_modules',
      'src/',
      'src/components',
      'src/styles'
    ],
    extensions: ['', '.js', '.jsx'],
  },

  resolveLoader: {
    root: path.join(__dirname, 'node_modules'),
  },

  plugins: [
    new CleanWebpackPlugin(['dist'], {
      verbose: false,
      dry: false
    }),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      output: {
        comments: false,
      },
      compress: {
        warnings: false,
        screw_ie8: true,
      },
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new HtmlWebpackPlugin({
      title: 'React'
    })
  ],

  module: {
    loaders: [
      {
        test: /\.scss$/, // sass files
        loader: 'style!css!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded',
      },
      {
        test: /\.(ttf|eot|svg|woff)(\?[a-z0-9]+)?$/, // fonts files
        loader: 'file-loader?name=[path][name].[ext]',
      },
      {
        test: /\.json$/,
        loader: 'json'
      },
      {
        test: /\.(js|jsx)?$/, // js files
        exclude: /node_modules/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src'),
      },
    ],

    noParse: /\.min\.js/,
  },
};

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config.dev');
const PORT = 3000;

require('colors');

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  noInfo: true,
  historyApiFallback: true
}).listen(PORT, 'localhost', function (err, result) {
  if (err) console.log(err);

  console.log('===================================='.magenta);
  console.log('         WEBPACK DEV SERVER         ');
  console.log('===================================='.magenta);
  console.log('Configuration:', 'webpack.config.dev.js'.magenta);
  console.log('Listening at', `http://localhost:${PORT}`.magenta);
  console.log('===================================='.magenta);
});

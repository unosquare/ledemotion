const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './AppClient/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = env => ({
  entry: './AppClient/index.js',
  output: {
    path: path.resolve(env.dev == 'true'? 'bin/Debug/net46/wwwroot/':'wwwroot'),
    filename: 'index_bundle.js'
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.css$/, loader: "style-loader!css-loader?importLoaders=1" },
      { test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' }
    ]
  },
  plugins: [
      HtmlWebpackPluginConfig,
      new CopyWebpackPlugin([
          {
              "from": "./AppClient/assets",
              "to": path.resolve(env.dev == 'true' ? 'bin/Debug/net46/wwwroot/assets/' : 'wwwroot/assets/')
          },
          {
              "from": "./AppClient/manifest.json",
              "to": path.resolve(env.dev == 'true' ? 'bin/Debug/net46/wwwroot/' : 'wwwroot'),
          },
          {
              "from": "./AppClient/favicon.ico",
              "to": path.resolve(env.dev == 'true' ? 'bin/Debug/net46/wwwroot/' : 'wwwroot'),
              
          }
      ])
  ]
});

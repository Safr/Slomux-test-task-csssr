const path = require('path');
const webpack = require('webpack');

const production = process.env.NODE_ENV === 'production';

const pluginsBase = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || ''),
    },
  }),
];

const developmentPlugins = [
  ...pluginsBase,
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NamedModulesPlugin(),
  // new OpenBrowserPlugin({ url: `http://localhost:${SETTINGS.PORT}` }),
];
const productionPlugins = [
  ...pluginsBase,
  new webpack.HashedModuleIdsPlugin(),
  new webpack.optimize.ModuleConcatenationPlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.optimize.UglifyJsPlugin({
    beautify: false,
    mangle: true,
    sourcemap: true,
    compress: {
      warnings: false, // Suppress uglification warnings
      pure_getters: true,
      conditionals: true,
      join_vars: true,
      if_return: true,
      unsafe: true,
      sequences: true,
      booleans: true,
      loops: true,
      unused: false,
      drop_console: true,
      unsafe_comps: true,
      screw_ie8: true,
    },
    output: {
      comments: false,
    },
    exclude: [/\.min\.js$/gi], // skip pre-minified libs
  }),
];

const configDev = {
  app: [
    'react-hot-loader/patch',
    // activate HMR for React
    'webpack-dev-server/client?http://localhost:8080',
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint
    'webpack/hot/only-dev-server',
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates
    './src/slomux.jsx',
  ],
};

const configProd = {
  app: './src/slomux.jsx',
};

const config = production ? configProd : configDev;

module.exports = {
  context: __dirname,
  entry: {
    app: config.app,
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    pathinfo: true,
    // filename: '[name].bundle.js',
    filename: `bundle.js`,
  },
  plugins: production ? productionPlugins : developmentPlugins,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          // 'react-hot-loader',
          {
            loader: 'babel-loader',
            options: {
              plugins: [
                'transform-class-properties',
              ],
              presets: ['env', 'react'],
            },
          },
        ],
      },
    ],
  },

  devServer: {
    compress: true,
    disableHostCheck: true,
    inline: true,
    hot: true,
    watchContentBase: true,
    contentBase: path.join(__dirname, 'dist'),
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
    // // show compile errors
    overlay: true,
    // webpack build logs config
    stats: {
      colors: true,
      reasons: true,
      chunks: false,
    },
  },

  devtool: production ? 'cheap-module-eval-source-map' : 'source-map',
  // devtool: production ? 'cheap-module-source-map' : 'cheap-module-eval-source-map',
  // devtool: production ? 'cheap-module-source-map' : 'source-map',
  cache: false,
  resolve: {
    modules: [
      path.join(__dirname, 'dist'),
      'node_modules', 'shared',
    ],
    extensions: ['.js', '.jsx', '.json', '*'],
  },
};

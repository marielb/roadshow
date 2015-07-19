var path = require('path');
module.exports = {
  entry: {
    index: './public/js/index',
    create_auction: './public/js/create_auction',
    auction_detail: './public/js/auction_detail',
  },
  output: {
    filename: './public/js/[name].min.js'
  },
  resolve: {
    alias: {
      // Tungsten.js doesn't need jQuery, but backbone needs a subset of jQuery APIs.  Backbone.native
      // implements tha minimum subset of required functionality
      'jquery': 'backbone.native',
      //  Aliases for the current version of tungstenjs above the ./examples directory.  If
      //  examples dir is run outside of main tungstenjs repo, remove these aliases
      //  and use via normal modules directories (e.g., via NPM)
      'tungstenjs/adaptors/backbone' : path.join(__dirname, 'node_modules/tungstenjs/adaptors/backbone'),
      'tungstenjs/src/template/template': path.join(__dirname, 'node_modules/tungstenjs/src/template/template'),
      // 'tungstenjs/src/template': path.join(__dirname, 'node_modules/tungstenjs/src/template'),
      'tungstenjs': 'node_modules/tungstenjs/src'
      // 'tungstenjs': path.join(__dirname, 'node_modules/tungstenjs/src')
      // 'tungstenjs' : 'node_modules/tungstenjs/src',
    }
  },
  resolveLoader: {
    modulesDirectories: ['node_modules', path.join(__dirname, 'node_modules/tungstenjs/precompile')]
  },
  module: {
    loaders: [
      {
        test: /\.mustache$/,
        loader: 'tungsten_template'
      }
    ]
  }
};

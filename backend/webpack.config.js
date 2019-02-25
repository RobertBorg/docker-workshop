var path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  target: 'node',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.bundle.js'
  },
  resolve: {
    alias: {
      'hiredis': path.join(__dirname, 'aliases/hiredis.js')
    }
  },
};
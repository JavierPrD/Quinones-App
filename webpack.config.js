const path = require('path');

module.exports = {
  entry: './src/electron/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
    
  },
  target: 'electron-main',
  
  
};

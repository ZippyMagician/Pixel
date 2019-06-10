var minify = require('rollup-plugin-babel-minify');
var resolve = require('rollup-plugin-node-resolve');

module.exports = [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/Pixel.js',
      format: 'cjs'
    },
    plugins: [resolve({
      mainFields: ['main']
    })]
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/Pixel.min.js',
      format: 'cjs'
    },
    plugins: [uglify(), resolve({
      mainFields: ['main']
    })]
  }
];

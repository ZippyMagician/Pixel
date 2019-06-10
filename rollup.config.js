var { uglify } = require('rollup-plugin-uglify');
var resolve = require('rollup-plugin-node-resolve');

module.exports = [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/Pixel.js',
      format: 'cjs'
    }
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

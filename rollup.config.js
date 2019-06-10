var { uglify } = require('rollup-plugin-uglify');

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
    plugins: [uglify()]
  }
];

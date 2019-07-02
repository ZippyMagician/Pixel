import minifier from "rollup-plugin-babel-minify";
import resolver from "rollup-plugin-node-resolve";

let banner = `/**
  * Created by Joshua Barnett
  * 
  * Licensed under MIT, 2019
  * All Rights reserved
  */
`;

let ENTRY = "src/index.js";
let EXIT = ["dist/Pixel.js", "dist/Pixel.min.js"];
let resolve = resolver({mainFields: ["main"]});
let minify = minifier({comments: false, banner: banner});

module.exports = [
  {
    input: ENTRY,
    output: {
      file: EXIT[0],
      format: "cjs",
      banner: banner
    },
    plugins: [resolve]
  },
  {
    input: ENTRY,
    output: {
      file: EXIT[1],
      format: "cjs"
    },
    plugins: [minify, resolve]
  }
];
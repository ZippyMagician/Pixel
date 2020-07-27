### PixelJS - Small Javascript game API

![PixelJS Logo](https://raw.githubusercontent.com/ZippyMagician/Pixel/master/assets/pixeljs.png)
<br>
![Dependencies](https://david-dm.org/ZippyMagician/Pixel/dev-status.svg)
![Build](https://api.travis-ci.org/ZippyMagician/Pixel.svg?branch=master)
![Release](https://img.shields.io/badge/version-v1.5.1-blue.svg)

A small, lightweight Javascript API designed to make drawing on the canvas simpler

## Installation
To run PixelJS on your website, add
```html
<script src="https://cdn.jsdelivr.net/gh/ZippyMagician/Pixel/bundles/1.1.0/Pixel.min.js"></script>
<!-- Where "1.1.0" can be subsituted for any version of PixelJS -->
```
to your website. To install yourself, clone the repo using
```sh
git clone https://github.com/ZippyMagician/Pixel
```
and then run
```sh
npm install
npm run build
```
to generate a file that contains all of Pixel's functions. Use
```sh
npm run docs
```
to create the documentation for Pixel.

## Example
Here is an example file you can use in Pixel
```js
var app = new Pixel.Stage({ // Create new Pixel Stage
  height: 400,
  width: 400
});
document.body.appendChild(app.view); // Add stage to document body

var rect = new Pixel.Rectangle(100, 100); // Create new rectangle with width and height of 100

rect.x = 200;
rect.y = 200;
rect.setAnchor(0.5, 0.5); // Center rectangle, move to center of screen

app.addChild(rect); // Add rectangle to screen

app.stage.on('tick', () => {
  rect.deg += 5; // Every tick, rotate 5 degrees
});
```

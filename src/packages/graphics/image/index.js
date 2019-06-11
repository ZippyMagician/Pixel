import { Sprite } from "../../sprite";

/**
  * ImageGraphics class
  *
  * @class
  * @memberof Pixel.EXPORTS
*/

export default class ImageGraphics {

  /**
    * Iterates a new "ImageGraphics" Element
    *
    * @constructor
  */

  constructor() {

    /**
      * Storage for a backup rendering context element
      *
      * @name Pixel.Graphics#cctx
      * @type {CanvasRenderingContext2d}
      * @private
    */

    this.cctx;

    /**
      * Storage for a backup canvas element
      *
      * @name Pixel.Graphics#canvas
      * @type {HTMLCanvasElement}
      * @private
    */

    this.canvas;

    /**
      * Stores the image modified
      *
      * @name Pixel.Graphics#image
      * @type {HTMLImageElement}
      * @private
    */

    this.image = new Image();

    /**
      * Determines whether or not the image is renderable
      *
      * @name Pixel.Graphics#renderable
      * @type {boolean}
      * @private
    */

    this.renderable = false;

    /**
      * Internal width of the canvas
      *
      * @name Pixel.Graphics#width
      * @type {number}
      * @private
    */

    this.width = 0;

    /**
      * Internal height of the canvas
      *
      * @name Pixel.Graphics#height
      * @type {number}
      * @private
    */

    this.height = 0;
  }

  /**
    * Loads image based on url
    *
    * @method Pixel.Graphics#loadImage
    * @return {Promise}
    * @param {string} [url] - URL of Image Element
  */

  loadImage(url) {
    var self = this;

    return new Promise(function (resolve, reject) {
      self.image.onload = function() {
        self.renderable = true;
        self.math = true;
        self.width = self.image.width;
        self.height = self.image.height;

        return resolve(self);
      }
      self.image.src = url;
    });
  }

  /**
    * Crops image based on x, y, width, and height
    *
    * @method Pixel.Graphics#cropRect
    * @return {Pixel.Sprite}
    * @param {number} [x] - X position of crop
    * @param {number} [y] - Y position of crop
    * @param {number} [w] - Width of crop
    * @param {number} [h] - Height of crop
  */

  cropRect(x, y, w, h) {
    var self = this;
    this.canvas = document.createElement("canvas");
    this.cctx = this.canvas.getContext("2d");

    this.cctx.canvas.width = this.width;
    this.cctx.canvas.height = this.height;
    this.cctx.drawImage(this.image, 0, 0);

    var data = this.cctx.getImageData(x, y, w, h);
    this.cctx.clearRect(0, 0, this.width, this.height);
    this.canvas.width = w;
    this.canvas.height = h;
    this.cctx.putImageData(data, 0, 0);

    return new Sprite({renderable: true, image: self.canvas});
  }
}

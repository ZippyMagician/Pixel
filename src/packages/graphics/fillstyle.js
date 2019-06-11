/**
  * Color/Transparency element for graphics
  *
  * @class
  * @memberof Pixel.EXPORTS
*/

export default class FillStyle {

  /**
    * Initiates new FillStyle element
    *
    * @constructor
  */

  constructor() {

    /**
      * The color of the fill element
      *
      * @name Pixel.Graphics._fillStyle#color
      * @type {number}
    */

    this.color;

    /**
      * Alpha (transparency) of element
      *
      * @name Pixel.Graphics._fillStyle#alpha
      * @type {number}
    */

    this.alpha;

    this.reset();
  }

  /**
    * Resets color and alpha
    * 
    * @method Pixel.Graphics._fillStyle#reset
  */

  reset() {
    this.color = 0xFFFFFF;
    this.alpha = 1;
  }

  /**
    * Clones this fill iteration into new one
    *
    * @method Pixel.Graphics._fillStyle#clone
    * @return {Pixel.EXPORTS.FillStyle}
  */

  clone() {
    var f = new FillStyle();
    f.color = this.color;
    f.alpha = this.alpha;
    
    return f;
  }

  /**
    * Fills color to new color
    *
    * @method Pixel.Graphics._fillStyle#fill
    * @param {number} [c] - Color to be set, Hex or RGB
    * @return {number}
  */

  fill(c) {
    this.color = c;

    return this.color;
  }
}

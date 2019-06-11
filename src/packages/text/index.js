import SpriteBase from '../sprite/base';

/**
  * Text class
  *
  * @class
  * @memberof Pixel
  * @extends Pixel.EXPORTS.SpriteBase
*/

export default class Text extends SpriteBase {
  
  /**
    * Create new text object
    *
    * @constructor
    * @param {string|number} [txt] - Text to be printed
    * @param {number} [size] - Size of the text
    * @param {string} [c="#000000"] - Color of the text
  */
  
  constructor(txt, size, c = "#000000") {
    super();
    
    /**
      * The text that will be printed
      *
      * @member {string}
    */
    
    this.text = txt;
    
    /**
      * The size of the text
      *
      * @member {number}
    */
    
    this.size = size;
    
    /**
      * The color of the text
      *
      * @member {string}
    */
    
    this.color = c;
  }

  /**
    * Renders text
    *
    * @param {CanvasRenderingContext2d} [ctx] - The Canvas to print to
  */

  render(canvas) {
    this.settings(canvas);
    canvas.beginPath();
    canvas.fillStyle = this.color;
    canvas.font = this.size + "px Verdana";
    canvas.fillText(this.text, this.x, this.y);
    canvas.fill();
    this.reset(canvas);
  }
}

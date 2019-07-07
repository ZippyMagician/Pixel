import SpriteBase from "./base";

/**
  * Spritesheet class
  *
  * @class
  * @memberof Pixel
  * @extends Pixel.EXPORTS.SpriteBase
*/

export default class SpriteSheet extends SpriteBase {
  
  /**
    * Create new Sprite sheet class
    * 
    * @constructor
    * @param {Pixel.Texture} texture - The texture used for the sprite sheet
    * @param {object} data - Data passed in order to split spritesheet
    * @param {number} data.width - Width of the spritesheet (in tiles)
    * @param {number} data.height - Height of the spritesheet (in tiles)
    * @param {number} data.margin - Amount of padding around each sprite
    * @param {number} data.spacing - Amount of space between each sprite
    * @param {object} data.image - Stores data for each image being split
    * @param {number} data.image.width - Width of single tile
    * @param {number} data.image.height - Height of single tile
  */
  
  constructor(texture, data) {
    super();
    
    /**
      * Stores the texture for later use
      * 
      * @name Pixel.SpriteSheet#texture
      * @type {Pixel.Texture}
      * @private
    */
    
    this.texture = texture;
    
    /**
      * Stores every seperate frame of the spritesheet
      *
      * @name Pixel.SpriteSheet#sheet
      * @type {HTMLCanvasElement[]}
    */

    this.sheet = [];
    
    
    
    this._parse(data);
  }
  
  /**
    * Crops an image into a smaller version
    *
    * @method Pixel.SpriteSheet#_slice
    * @private
    * @param {number} x - X position of crop
    * @param {number} y - Y position of crop
    * @param {number} w - Width of crop
    * @param {number} h - Height of crop
    * @param {image} [image=false] - If you want to pass a texture other than the main texture, use this
    * @returns {HTMLCanvasElement}
  */

  _slice(x, y, w, h, image=false) {
    let img = image || this.texture;
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    ctx.canvas.width = img.width ? img.width : img.image.width;
    ctx.canvas.height = img.height ? img.height : img.image.height;
    ctx.drawImage(img.width ? img : img.image, 0, 0);

    let data = ctx.getImageData(x, y, w, h);
    canvas.width = w;
    canvas.height = h;
    ctx.putImageData(data, 0, 0);

    return canvas;
  }
  
  /**
    * Trim image centered around image
    *
    * @method Pixel.SpriteSheet#trim
    * @private
    * @deprecated
    * @param {object} data - Data object passed
  */

  trim(data) {
    let w = data.width, h = data.height;
    let prev_w = this.sheet[0].width, prev_h = this.sheet[0].height;

    for (let i in this.sheet) {
      let image = this.sheet[i];
      let diffW = prev_w - w, diffH = prev_h - h;
      this.sheet[i] = this._slice(diffW / 2, diffH / 2, w - diffW / 2, h - diffH / 2, image);
    }
  }
  
  /**
    * Parses texture file into seperate files based on data
    *
    * @method Pixel.SpriteSheet#_parse
    * @private
    * @param {object} data - Data passed
  */

  _parse(data) {
    let w = this.texture.image.width;
    let h = this.texture.image.height;
    let rows = Math.floor(w / data.width);
    let cols = Math.floor(h / data.height);
    let margin = data.margin || 0;
    let spacing = data.spacing || 0;
    let curRow;
    let curCol;

    for (curCol = 1; curCol <= cols; curCol++) {
      for (curRow = 1; curRow <= rows; curRow++) {
        let img = this._slice(curRow * (data.width + spacing) - data.width,
          curCol * (data.height + spacing + margin) - data.height,
          data.width - margin - spacing,
          data.height - margin - spacing);
        this.sheet.push(img);
      }
    }
  }
  
  /**
    * Returns the sheet for use in other sprites
    *
    * @method Pixel.SpriteSheet#generateSheet
    * @returns {Pixel.SpriteSheet#sheet}
  */

  generateSheet() {
    return this.sheet;
  }
}

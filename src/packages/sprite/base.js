import {Point} from "../shape";

/**
  * The base of every Sprite
  *
  * @class
  * @memberof Pixel.EXPORTS
*/

export default class SpriteBase {

  /**
    * Create new Sprite Base
    *
    * @param {boolean} [noscale=false] - Determines whether or not object can be rotated and scaled
  */

  constructor(noscale = false) {

    /**
      * The position of the sprite
      *
      * @name Pixel.EXPORTS.SpriteBase#point
      * @type {Pixel.Point}
    */

    this.point = new Point();

    /**
      * The anchor position of the sprite
      *
      * @name Pixel.EXPORTS.SpriteBase#anchor
      * @type {Pixel.Point}
    */

    this.anchor = new Point();

    /**
      * The opacity of the sprite
      *
      * @name Pixel.EXPORTS.SpriteBase#opacity
      * @type {number}
    */

    this.opacity = 1.0;

    /**
      * The degress of rotation on the sprite
      *
      * @name Pixel.EXPORTS.SpriteBase#deg
      * @type {number}
      * @default 0
    */

    this.deg = 0;

    /**
      * The scale of the sprite (0 --> 1)
      *
      * @name Pixel.EXPORTS.SpriteBase#scale
      * @type {number}
      * @default 1
    */

    this.scale = 1;

    /**
      * Whether the sprite is scaled, stored
      * 
      * @name Pixel.EXPORTS.SpriteBase#noscale
      * @private
      * @type {boolean}
    */

    this.noscale = noscale;

    /**
      * Determines if the sprite is flipped over the x axis
      *
      * @name Pixel.EXPORTS.SpriteBase#flipX
      * @type {boolean}
      * @default false
    */

    this.flipX = false;

    /**
      * Determines if the sprite is flipped over the y axis
      *
      * @name Pixel.EXPORTS.SpriteBase#flipY
      * @type {boolean}
      * @default false
    */

    this.flipY = false;
  }

  /**
    * Sets the hitbox size of the sprite
    *
    * @method Pixel.EXPORTS.SpriteBase#setSize
    * @param {number} w - Width
    * @param {number} h - Height
  */

  setSize(w, h) {

    /**
      * Width of the Sprite's hitbox
      *
      * @name Pixel.EXPORTS.SpriteBase#width
      * @type {number}
    */

    this.width = w;

    /**
      * Height of the Sprite's hitbox
      *
      * @name Pixel.EXPORTS.SpriteBase#height
      * @type {number}
    */

    this.height = h;
  }

  /**
    * X position
    *
    * @name Pixel.EXPORTS.SpriteBase#x
    * @type {number}
  */

  get x() {
    return this.point.x;
  }

  set x(v) {
    return (this.point.x = v);
  }

  /**
    * Y position
    *
    * @name Pixel.EXPORTS.SpriteBase#y
    * @type {number}
  */

  get y() {
    return this.point.y;
  }

  set y(v) {
    return (this.point.y = v);
  }

  /**
    * Set the position the sprite is anchored to (0-->1)
    *
    * @method Pixel.EXPORTS.SpriteBase#setAnchor
    * @param {number} x - X position, scale of 0 to 1
    * @param {number} y - Y position, scale of 0 to 1
  */

  setAnchor(x, y) {
    this.anchor.x = x;
    this.anchor.y = y;
  }

  /**
    * Copy the value of another sprite onto this one
    *
    * @method Pixel.EXPORTS.SpriteBase#copy
    * @param {Pixel.Sprite} sprite - Sprite who's values this will copy
  */

  copy(sprite) {
    this.point = sprite.point;
    this.deg = sprite.deg;
    this.anchor = sprite.anchor;
    this.flipX = sprite.flipX;
    this.flipY = sprite.flipY;
    this.opacity = sprite.opacity;
    this.scale = sprite.scale;
  }

  /**
    * Spins x * 360 degrees
    *
    * @method Pixel.EXPORTS.SpriteBase#spin
    * @param {number} num - Amount of times sprite rotates 360 degrees
  */

  spin(num) {
    this.deg = num * 360;
  }

  /**
    * Applies settings set on sprite
    *
    * @method Pixel.EXPORTS.SpriteBase#settings
    * @param {CanvasRenderingContext2d} ctx - Context to apply settings to
  */

  settings(ctx) {
    if (!this.noscale) {ctx.globalAlpha = this.opacity;}
    ctx.scale(this.scale, this.scale);
  }

  /**
    * Resets settings set on sprite
    *
    * @method Pixel.EXPORTS.SpriteBase#reset
    * @param {CanvasRenderingContext2d} ctx - Context to reset settings on
  */

  reset(ctx) {
    ctx.globalAlpha = 1.0;
    if (!this.noscale) {ctx.scale(1 / this.scale, 1 / this.scale);}
  }
}

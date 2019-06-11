import SpriteBase from '../base';
import AnimationCore from './base';

/*
  * AnimatedSprite Class
  *
  * @class
  * @memberof Pixel
  * @extends Pixel.EXPORTS.SpriteBase
*/

export default class AnimatedSprite extends SpriteBase {

  /*
    * Create new Animated Sprite Object
    *
    * @constructor
    * @param {object|false} [config] - The configuration object, only passed if it is a json file
    * @param {Pixel.SpriteSheet#sheet|Pixel.SpriteSheet#generateSheet} [sheet] - The Sprite Sheet
    * @param {number} [speed=0.15] - Speed of animation
  */

  constructor(config, sheet, speed = 0.15) {
    super();

    /*
      * Animation Core for playing the animations
      *
      * @member {Pixel.EXPORTS.AnimationCore}
    */

    this.animation = new AnimationCore(this);

    /*
      * Speed of the animation
      *
      * @member {number}
    */

    this.speed = speed;

    /*
      * SpriteSheet's image
      *
      * @member {object|Pixel.SpriteSheet#sheet|Pixel.SpriteSheet#generateSheet}
    */

    this.texture = {image: new Image()};

    if (this.config) {

      /*
        * JSON Config file
        *
        * @member {object}
      */

      this.config = config;
      this.texture = sheet;

      this._splitFrames();
    } else {
      this.sheet = sheet;

      this._splitSheetFrames();
    }
  }

  /*
    * Slices each frame off of the SpriteSheet, used if JSON file exists
    *
    * @private
  */

  _splitFrames() {
    var conf = this.config;
    var self = this;

    for (var f in conf.textures[0].frames) {
      let frame = conf.textures[0].frames[f];
      this.animation.cache.push({
        name: frame.name,
        image: self._slice(
          frame.position.x,
          frame.position.y,
          frame.position.w,
          frame.position.h
        )
      });
    }
  }

  /*
    * Slices each frame off of the SpriteSheet, used if no JSON file
    *
    * @private
  */

  _splitSheetFrames() {
    var self = this;

    for (var f in self.sheet) {
      let img = self.sheet[f];
      this.animation.cache.push({
        name: f.toString(),
        image: img
      });
    }
  }

  /*
    * Cuts image
    *
    * @private
    * @param {number} [x] - X position
    * @param {number} [y] - Y position
    * @param {number} [w] - Width
    * @param {number} [h] - Height
    * @returns {HTMLCanvasElement}
  */

  _slice(x, y, w, h) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    ctx.canvas.width = this.texture.image.width;
    ctx.canvas.height = this.texture.image.height;
    ctx.drawImage(this.texture.image, 0, 0);

    var data = ctx.getImageData(x, y, w, h);
    ctx.clearRect(0, 0, this.texture.image.width, this.texture.image.height);
    canvas.width = w;
    canvas.height = h;
    ctx.putImageData(data, 0, 0);

    return canvas;
  }

  /*
    * Renders current animation frame of sprite
    *
    * @param {CanvasRenderingContext2d} [ctx] - The Canvas to print to
  */

  render(ctx) {
    if (this.animation.current) {
      var dummy = this.animation.current[
        Math.floor(this.animation.frame) % this.animation.current.length
      ];
      dummy.copy(this);
      this.texture = dummy.texture;
      dummy.render(ctx);

      this.animation.frame += this.speed;
    }
  }
}

var SpriteBase = require('./base');

class Sprite extends SpriteBase {
  constructor(texture) {
    super();
    var self = this;
    this.texture = texture
  }

  render(canvas) {
    if (this.texture.renderable) {
      if (this.deg > 0) this.rotation_render(canvas)
      else canvas.drawImage(this.texture.image, this.x, this.y);
    }
  }

  rotation_render(ctx) {
    var image = this.texture.image;
    var width = ((ctx.canvas.width * this.anchor.x));
    var height = ((ctx.canvas.height * this.anchor.y));
    var x = this.x - width - (image.width * this.anchor.x);
    var y = this.y - height - (image.height * this.anchor.y);

    ctx.save();
    ctx.translate(width - x, height - y);
    ctx.rotate(Math.PI / 180 * this.deg);
    ctx.drawImage(image, x, y);
    ctx.restore();
  }
}

module.exports = Sprite;

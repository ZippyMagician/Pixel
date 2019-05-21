var SpriteBase = require('../sprite/base');

class Rectangle extends SpriteBase {
  constructor(w, h, c='#000000') {
    super();
    this.width = w;
    this.height = h;
    this.color = c;
  }

  render(canvas) {
    if (this.deg > 0) this.rotation_render(canvas);
    else {
      canvas.fillStyle = this.color;
      canvas.fillRect(this.x, this.y, this.width, this.height);
      canvas.fill();
    }
  }

  rotation_render(ctx) {
    var width = ((ctx.canvas.width * this.anchor.x));
    var height = ((ctx.canvas.height * this.anchor.y));
    var x = width - this.x;
    var y = height - this.y;

    ctx.save();
    ctx.translate(x + (this.width * this.anchor.x), y + (this.height * this.anchor.y));
    ctx.rotate(Math.PI / 180 * this.deg);
    ctx.fillStyle = this.color;
    ctx.fillRect(0 - (this.width * this.anchor.x), 0 - (this.height * this.anchor.y), this.width, this.height);
    ctx.fill();
    ctx.restore();
  }
}

module.exports = Rectangle;

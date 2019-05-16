var SpriteBase = require('../sprite/base');

class Rectangle extends SpriteBase {
  constructor(w, h, c='#000000') {
    super();
    this.width = w;
    this.height = h;
    this.color = c;
  }

  render(canvas) {
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);
    canvas.fill();
  }
}

module.exports = Rectangle;

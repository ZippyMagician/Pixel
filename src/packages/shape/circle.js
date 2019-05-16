var SpriteBase = require('../sprite/base');

class Circle extends SpriteBase {
  constructor(r, c='#000000') {
    super();
    this.radius = r;
    this.color = c;
  }

  render(canvas) {
    canvas.beginPath();
    canvas.fillStyle = this.color;
    canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    canvas.fill();
  }
}

module.exports = Circle;

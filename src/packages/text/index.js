var SpriteBase = require('../sprite/base');

class Text extends SpriteBase {
  constructor(txt, size, c='#000000') {
    super();
    this.text = txt;
    this.size = size;
    this.color = c;
  }

  render(canvas) {
    canvas.beginPath();
    canvas.fillStyle = this.color;
    canvas.font = this.size + 'px Verdana';
    canvas.fillText(this.text, this.x, this.y);
    canvas.fill();
  }
}

module.exports = Text;
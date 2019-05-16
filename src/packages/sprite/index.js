var SpriteBase = require('./base');

class Sprite extends SpriteBase {
  constructor(texture) {
    super();
    var self = this;
    this.texture = texture
  }

  render(canvas) {
    if (this.texture.renderable) {
      canvas.drawImage(this.texture.image, this.x, this.y);
    }
  }
}

module.exports = Sprite;

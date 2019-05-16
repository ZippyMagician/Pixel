var Point = require('../shape/point');

class SpriteBase {
  constructor() {
    this.point = new Point();
  }

  get x() {
    return this.point.x;
  }

  set x(v) {
    return this.point.x = v;
  }

  get y() {
    return this.point.y;
  }

  set y(v) {
    return this.point.y = v;
  }

  clone() {
    return this;
  }
}

module.exports = SpriteBase;

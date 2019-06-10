import { Point } from '../shape';

export default class SpriteBase {
  constructor(noscale = false) {
    this.point = new Point();
    this.anchor = new Point();
    this.opacity = 1.0;
    this.deg = 0;
    this.scale = 1;
    this.noscale = noscale;
    this.flipX = false;
    this.flipY = false;
  }

  setSize(w, h) {
    this.width = w;
    this.height = h;
  }

  get x() {
    return this.point.x;
  }

  set x(v) {
    return (this.point.x = v);
  }

  get y() {
    return this.point.y;
  }

  set y(v) {
    return (this.point.y = v);
  }

  setAnchor(x, y) {
    this.anchor.x = x;
    this.anchor.y = y;
  }

  copy(sprite) {
    this.point = sprite.point;
    this.deg = sprite.deg;
    this.anchor = sprite.anchor;
    this.flipX = sprite.flipX;
    this.flipY = sprite.flipY;
    this.opacity = sprite.opacity;
    this.scale = sprite.scale;
  }

  spin(num) {
    this.deg = num * 360;
  }

  settings(ctx) {
    if (!this.noscale) ctx.globalAlpha = this.opacity;
    ctx.scale(this.scale, this.scale);
  }

  reset(ctx) {
    ctx.globalAlpha = 1.0;
    if (!this.noscale) ctx.scale(1 / this.scale, 1 / this.scale);
  }
}

import SpriteBase from '../sprite/base';

export default class Rectangle extends SpriteBase {
  constructor(w, h, c = "#000000") {
    super(true);
    this.width = w;
    this.height = h;
    this.color = c;
  }

  render(canvas) {
    this.settings(canvas);
    if (this.deg > 0 || this.flipX || this.flipY) this.rotation_render(canvas);
    else {
      canvas.fillStyle = this.color;
      canvas.fillRect(
        this.x - this.width * this.anchor.x,
        this.y - this.height * this.anchor.y,
        this.width,
        this.height
      );
      canvas.fill();
    }
    this.reset(canvas);
  }

  rotation_render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.flipX) ctx.scale(-1, 1);
    if (this.flipY) ctx.scale(1, -1);
    ctx.rotate((Math.PI / 180) * this.deg);
    ctx.fillStyle = this.color;
    ctx.fillRect(
      0 - this.width * this.anchor.x,
      0 - this.height * this.anchor.y,
      this.width,
      this.height
    );
    ctx.fill();
    ctx.restore();
  }
}

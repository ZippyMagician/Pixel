import FillStyle from './fillstyle';
import ImageGraphics from './image';

export default class Graphics extends ImageGraphics {
  constructor(canvas) {
    super(canvas);
    this.ctx = canvas;
    this.dsc = this.ctx.shadowColor;
    this._fillStyle = new FillStyle();
  }

  transparency(value) {
    this.ctx.globalAlpha = value;

    return this;
  }

  shadow(blur, color, offsetx, offsety) {
    this.ctx.shadowBlur = blur;
    this.ctx.shadowColor = color;
    this.ctx.shadowOffsetX = offsetx;
    this.ctx.shadowOffsetY = offsety;

    return this;
  }

  fill(c) {
    this.ctx.fillStyle = this._fillStyle.fill(c);
    
    return this;
  }

  end() {
    this._fillStyle.reset();
    this.ctx.fillStyle = '#000000';
    this.ctx.shadowBlur = 0;
    this.ctx.shadowColor = this.dsc;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.globalAlpha = 1.0;
  }

  drawRect(a, b, c, d) {
    this.ctx.fillRect(a, b, c, d);

    return this;
  }

  arc(a, b, c, d, e, f=false) {
    this.ctx.beginPath();
    this.ctx.arc(a, b, c, d, e, f);
    this.ctx.fill();

    return this;
  }

  arcTo(a, b, c, d, e) {
    this.ctx.beginPath();
    this.ctx.arcTo(a, b, c, d, e)
    this.ctx.fill();

    return this;
  }

  move(a, b) {
    this.ctx.moveTo(a, b);

    return this;
  }

  clearRect(x, y, w, h) {
    this.ctx.clearRect(x, y, w, h);

    return this;
  }

  clearCircle(x, y, radius) {
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.globalCompositeOperation = 'source-over';
  }
}

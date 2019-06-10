import SpriteBase from '../sprite/base';

export default class Circle extends SpriteBase {
  constructor(r, c = "#000000") {
    super(true);
    this.radius = r;
    this.color = c;
  }

  render(canvas) {
    this.settings(canvas);
    canvas.beginPath();
    canvas.fillStyle = this.color;
    canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    canvas.fill();
    this.reset(canvas);
  }
}

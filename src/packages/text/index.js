import SpriteBase from '../sprite/base';

export default class Text extends SpriteBase {
  constructor(txt, size, c = "#000000") {
    super();
    this.text = txt;
    this.size = size;
    this.color = c;
  }

  /*
    * Renders text
    *
    * @param {CanvasRenderingContext2d} [ctx] - The Canvas to print to
  */

  render(canvas) {
    this.settings(canvas);
    canvas.beginPath();
    canvas.fillStyle = this.color;
    canvas.font = this.size + "px Verdana";
    canvas.fillText(this.text, this.x, this.y);
    canvas.fill();
    this.reset(canvas);
  }
}

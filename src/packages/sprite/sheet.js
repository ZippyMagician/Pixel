import SpriteBase from './base';

export default class SpriteSheet extends SpriteBase {
  constructor(texture, data) {
    super();
    if (!texture.renderable)
      throw new Error(
        "PixelError: Texture passed to Pixel#SpriteSheet constructor MUST be loaded"
      );
    else this.texture = texture;

    this.sheet = [];
    this._parse(data);
  }

  _slice(x, y, w, h, image=false) {
    let img = image || this.texture
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    ctx.canvas.width = img.width ? img.width : img.image.width
    ctx.canvas.height = img.height ? img.height : img.image.height
    ctx.drawImage(img.width ? img : img.image, 0, 0);

    let data = ctx.getImageData(x, y, w, h);
    canvas.width = w;
    canvas.height = h;
    ctx.putImageData(data, 0, 0);

    return canvas;
  }

  trim(data) {
    let w = data.width, h = data.height;
    let prev_w = this.sheet[0].width, prev_h = this.sheet[0].height;

    for (let i in this.sheet) {
      let image = this.sheet[i];
      let diffW = prev_w - w, diffH = prev_h - h;
      this.sheet[i] = this._slice(diffW / 2, diffH / 2, w - diffW / 2, h - diffH / 2, image)
    }
  }

  _parse(data) {
    let w = this.texture.image.width;
    let h = this.texture.image.height;
    let rows = Math.floor(w / data.width);
    let cols = Math.floor(h / data.height);
    let margin = data.margin || 0;
    let spacing = data.spacing || 0;
    let curRow;
    let curCol;

    for (curCol = 1; curCol <= cols; curCol++) {
      for (curRow = 1; curRow <= rows; curRow++) {
        // TODO: FIX MARGIN + SPACING
        let img = this._slice(
          curRow * (data.width + spacing) - data.width,
          curCol * (data.height + spacing + margin) - data.height,
          data.width - margin - spacing,
          data.height - margin - spacing
        );
        this.sheet.push(img);
      }
    }
  }

  generateSheet() {
    return this.sheet;
  }
}

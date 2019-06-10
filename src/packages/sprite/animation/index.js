import SpriteBase from '../base';

export class AnimatedSprite extends SpriteBase {
  constructor(config, sheet, speed = 1) {
    super();

    this.animation = new AnimationCore(this);
    this.speed = speed;
    this.texture = {image: new Image()};

    if (this.config) {
      this.config = config;
      this.texture = sheet;

      this._splitFrames();
    } else {
      this.sheet = sheet;

      this._splitSheetFrames();
    }
  }

  _splitFrames() {
    var conf = this.config;
    var self = this;

    for (var f in conf.textures[0].frames) {
      let frame = conf.textures[0].frames[f];
      this.animation.cache.push({
        name: frame.name,
        image: self._slice(
          frame.position.x,
          frame.position.y,
          frame.position.w,
          frame.position.h
        )
      });
    }
  }

  _splitSheetFrames() {
    var self = this;

    for (var f in self.sheet) {
      let img = self.sheet[f];
      this.animation.cache.push({
        name: f.toString(),
        image: img
      });
    }
  }

  _slice(x, y, w, h) {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");

    ctx.canvas.width = this.texture.image.width;
    ctx.canvas.height = this.texture.image.height;
    ctx.drawImage(this.texture.image, 0, 0);

    var data = ctx.getImageData(x, y, w, h);
    ctx.clearRect(0, 0, this.texture.image.width, this.texture.image.height);
    canvas.width = w;
    canvas.height = h;
    ctx.putImageData(data, 0, 0);

    return canvas;
  }

  render(ctx) {
    if (this.animation.current) {
      var dummy = this.animation.current[
        Math.floor(this.animation.frame) % this.animation.current.length
      ];
      dummy.copy(this);
      this.texture = dummy.texture;
      dummy.render(ctx);

      this.animation.frame += this.speed;
    }
  }
}

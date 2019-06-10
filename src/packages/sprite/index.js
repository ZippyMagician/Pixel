import SpriteBase from './base';
import AnimatedSprite from './animation';
import SpriteSheet from './sheet';

export class Sprite extends SpriteBase {
  constructor(texture) {
    super();
    this.texture = texture;
  }

  render(canvas) {
    if (this.texture.renderable) {
      this.settings(canvas);
      if (this.deg > 0 || this.flipX || this.flipY)
        this.rotation_render(canvas);
      else
        canvas.drawImage(
          this.texture.image,
          this.x / this.scale - this.texture.image.width * this.anchor.x,
          this.y / this.scale - this.texture.image.height * this.anchor.y
        );
      this.reset(canvas);
    }
  }

  rotation_render(ctx) {
    var image = this.texture.image;

    ctx.save();
    ctx.translate(this.x / this.scale, this.y / this.scale);
    if (this.flipX) ctx.scale(-1, 1);
    if (this.flipY) ctx.scale(1, -1);
    ctx.fillStyle = "#000000";
    ctx.rotate((Math.PI / 180) * this.deg);
    ctx.drawImage(
      image,
      -image.width * this.anchor.x,
      -image.height * this.anchor.y
    );
    ctx.restore();
  }

  checkCollisions(otherobj) { // Ported from https://www.w3schools.com/graphics/game_obstacles.asp
    let bias = 0;
    var myleft = this.x / this.scale - this.texture.image.width * this.anchor.x;
    var myright = myleft + (this.texture.image.width);
    var mytop = this.y / this.scale - this.texture.image.height * this.anchor.y;
    var mybottom = mytop + (this.texture.image.height);
    var otherleft = otherobj.x / otherobj.scale - (otherobj.width || otherobj.texture.image.width) * otherobj.anchor.x;
    var otherright = otherleft + (otherobj.width || otherobj.texture.image.width) / otherobj.scale;
    var othertop = otherobj.y / otherobj.scale - (otherobj.height || otherobj.texture.image.height) * otherobj.anchor.y;
    var otherbottom = othertop + (otherobj.height || otherobj.texture.image.height) / otherobj.scale;
    //console.log(this.anchor.x, this.anchor.y);
    //console.log(myleft, otherleft, myright, otherright, mytop, othertop, mybottom, otherbottom);
    var crash = true;
    var left = false;
    var right = false;
    var top = false;
    var bottom = false;

    if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) {
      crash = false;
    }
    if (crash) {
      if (mybottom - bias > otherbottom && mytop + bias < otherbottom) bottom = true;
      if (mytop + bias < othertop && mybottom - bias > othertop) top = true;
      if (myleft + bias < otherleft && myright - bias > otherleft) left = true;
      if (myright - bias > otherright && myleft + bias < otherright) right = true;
    }
    return {body: crash, left: left, right: right, top: top, bottom: bottom};
  }

  clone() {
    return new Sprite(this.texture);
  }
}

export AnimatedSprite;
export SpriteSheet;

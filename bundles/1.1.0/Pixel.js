class Point {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  clone() {
    return this;
  }
}

class Game {
  constructor(height, width, options={ticker:true}) {
    var self = this;
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    ctx.canvas.height = height;
    ctx.canvas.width = width;
    this.view = ctx.canvas;
    this.draw = ctx;
    this.onclick;
    this.tick = false;

    this.elements = {sprites: []};
    this.resources = {};
    this.screen = {add: {}, clear: {}, mousePos: {}};

    this.view.onclick = function (e) {
      if (self.onclick) return self.onclick(e);
    }

    this.elements.add = function (name='default', type={id: "rect", h: 10, w: 10, color: '#000000'}) {
      self.resources[name] = type;
      return self.loader;
    }

    this.screen.add = function (sprite) {
      return sprite.render(ctx);
    }

    this.screen.clear = function () {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    this.screen.mousePos = function (event) {
      var rect = canvas.getBoundingClientRect(),
          scaleX = canvas.width / rect.width,
          scaleY = canvas.height / rect.height;

      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
      }
    }

    if (options.ticker) this._animFrame(this);
  }

  addChild(sprite) {
    this.elements.sprites.push(sprite);
  }

  removeChildren() {
    this.elements.sprites = [];
  }

  _animFrame(self) {
    if (self.elements.sprites.length >= 1) self.screen.clear();
    for (var i = 0; i < self.elements.sprites.length; i++) {
      self.screen.add(self.elements.sprites[i]);
    }
    requestAnimationFrame(self._tick.bind(false, self));
    requestAnimationFrame(self._animFrame.bind(false, self));
  }

  _tick(self) {
    if (self.tick) {
      self.tick();
    }
  }

  render() {
    var l = this.elements.sprites.length;
    if (l >= 1) this.screen.clear();
    for (var i = 0; i < l; i++) {
      this.screen.add(this.elements.sprites[i]);
    }
  }
}

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

class Rectangle extends SpriteBase {
  constructor(w, h, c='#000000') {
    super();
    this.width = w;
    this.height = h;
    this.color = c;
  }

  render(canvas) {
    canvas.fillStyle = this.color;
    canvas.fillRect(this.x, this.y, this.width, this.height);
    canvas.fill();
  }
}

class Circle extends SpriteBase {
  constructor(r, c='#000000') {
    super();
    this.radius = r;
    this.color = c;
  }

  render(canvas) {
    canvas.beginPath();
    canvas.fillStyle = this.color;
    canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    canvas.fill();
  }
}

class Text extends SpriteBase {
  constructor(txt, size, c='#000000') {
    super();
    this.text = txt;
    this.size = size;
    this.color = c;
  }

  render(canvas) {
    canvas.beginPath();
    canvas.fillStyle = this.color;
    canvas.font = this.size + 'px Verdana';
    canvas.fillText(this.text, this.x, this.y);
    canvas.fill();
  }
}

class Sound {
  constructor() {}
}

class Texture {
  constructor(src) {
    var self = this;
    this.image = new Image();
    this.renderable = false;
    this.image.onload = function () {
      self.renderable = true;
    }
    this.image.src = src;
  }
}

window.Pixel = {
  Game: Game,
  Sprite: Sprite,
  Texture: Texture,
  Rectangle: Rectangle,
  Circle: Circle,
  Text: Text,
  Sound: Sound,
  Point: Point
}

window.requestAnimationFrame = window.requestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.msRequestAnimationFrame
  || function(f){return setTimeout(f, 1000/60)};

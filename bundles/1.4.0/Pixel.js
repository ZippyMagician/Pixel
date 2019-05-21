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
    this.tick = false;

    this.onclick;
    this.onmousemove;
    this.onkeydown;
    this.onmousedown;

    this.elements = {sprites: []};
    this.resources = {};
    this.screen = {add: {}, clear: {}, mousePos: {}};

    this.view.onclick = function (e) {
      if (self.onclick) return self.onclick(e);
    }

    document.onmousemove = function (e) {
      if (self.onmousemove) return self.onmousemove(e);
    }

    document.onkeydown = function (e) {
      if (self.onkeydown) return self.onkeydown(e);
    }

    document.onmousedown = function (e) {
      if (self.onmousedown) return self.onmousedown(e);
    }

    document.onmouseup = function (e) {
      if (self.onmouseup) return self.onmouseup(e);
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

    this.screen.on = function (name, call) {
      self['on' + name] = call;
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

class Container {
  constructor() {
    this.contents = [];
    this.container = true;
    this.point = new Point();
  }

  addChild(sprite) {
    this.contents.push(sprite);
  }

  cloneChildren(base) {
    var con = this.contents;
    for(var i in con) {
      base.addChild(con[i]);
    }
  }

  get x() {
    return this.point.x;
  }

  get y() {
    return this.point.y;
  }

  set x(v) {
    var con = this.contents;
    for (var i in con) {
      var c = con[i];
      c.x = c.x + (v - this.x);
    }
    this.point.x = v;
  }

  set y(v) {
    var con = this.contents;
    for (var i in con) {
      var c = con[i];
      c.y = c.y + (v - this.y);
    }
    this.point.y = v;
  }

  render(ctx) {
    var con = this.contents;
    for (var i in con) {
      con[i].render(ctx);
    }
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

class FillStyle {
  constructor() {
    this.reset();
  }

  reset() {
    this.color = 0xFFFFFF;
    this.alpha = 1;
  }

  clone() {
    var f = new FillStyle();
    f.color = this.color;
    f.alpha = this.alpha;
    
    return f;
  }

  fill(c) {
    this.color = c;

    return this.color;
  }
}

class ImageGraphics {
  constructor(canvas) {
    this.ctx = canvas;
    this.cctx;
    this.canvas;
    this.image = new Image();
    this.renderabe = false;

    this.width = 0;
    this.height = 0;
    this.math = false;
  }

  loadImage(url) {
    var self = this;

    return new Promise(function (resolve, reject) {
      self.image.onload = function() {
        self.renderable = true;
        self.math = true;
        self.width = self.image.width;
        self.height = self.image.height;

        return resolve(self);
      }
      self.image.src = url;
    });
  }

  cropRect(x, y, w, h) {
    var self = this;
    this.canvas = document.createElement("canvas");
    this.cctx = this.canvas.getContext("2d");

    this.cctx.canvas.width = this.width;
    this.cctx.canvas.height = this.height;
    this.cctx.drawImage(this.image, 0, 0);

    var data = this.cctx.getImageData(x, y, w, h);
    this.cctx.clearRect(0, 0, this.width, this.height);
    this.canvas.width = w;
    this.canvas.height = h;
    this.cctx.putImageData(data, 0, 0);

    return {
      x: 0,
      y: 0,
      image: self.canvas,
      render: function (c) {
        c.drawImage(this.image, this.x, this.y);
      },
      clone: function () {
        var s = this;
        return {
          x: s.x,
          y: s.y,
          image: s.image,
          render: s.render
        };
      }
    }
  }
}

class Graphics extends ImageGraphics {
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

window.Pixel = {
  Game: Game,
  Sprite: Sprite,
  Texture: Texture,
  Rectangle: Rectangle,
  Circle: Circle,
  Text: Text,
  Sound: Sound,
  Point: Point,
  Container: Container,
  Graphics: Graphics
}

window.requestAnimationFrame = window.requestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.msRequestAnimationFrame
  || function(f){return setTimeout(f, 1000/60)};

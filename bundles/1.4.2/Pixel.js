class Point {
  constructor(x=0, y=0) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Point(this.x, this.y);
  }
}

class Stage {
  constructor(width, height, options={ticker:true}) {
    var self = this;
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    ctx.canvas.height = height;
    ctx.canvas.width = width;
    this.view = ctx.canvas;
    this.draw = ctx;
    this.tick = false;
    this.cursor = canvas.style.cursor;

    this.onclick;
    this.onmousemove;
    this.onkeydown;
    this.onmousedown;

    this.elements = {sprites: []};
    this.resources = {};
    this.stage = {add: {}, clear: {}, regions: {}};

    this.stage.mousePos = function (event) {
      var rect = canvas.getBoundingClientRect(),
          scaleX = canvas.width / rect.width,
          scaleY = canvas.height / rect.height;

      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
      }
    }

    this._checkRegions = function (e, int=true) {
      var c = false;
      var mouse = self.stage.mousePos(e);
      for (var r in self.stage.regions) {
        var reg = self.stage.regions[r];
        if (mouse.x > reg.start.x && mouse.x < reg.end.x && mouse.y > reg.start.y && mouse.y < reg.end.y) {
          if (int) reg.call();
          else canvas.style.cursor = "pointer";
          c = true;
        }
      }
      return c;
    }

    this.view.onclick = function (e) {
      self._checkRegions(e);
      if (self.onclick) return self.onclick(e);
    }

    document.onmousemove = function (e) {
      var check = self._checkRegions(e, false);
      if (!check) canvas.style.cursor = self.cursor;
      if (self.onmousemove) return self.onmousemove(e);
    }

    this.view.onkeydown = function (e) {
      if (self.onkeydown) return self.onkeydown(e);
    }

    this.view.onmousedown = function (e) {
      if (self.onmousedown) return self.onmousedown(e);
    }

    this.view.onmouseup = function (e) {
      if (self.onmouseup) return self.onmouseup(e);
    }

    this.elements.add = function (name='default', type={id: "rect", h: 10, w: 10, color: '#000000'}) {
      self.resources[name] = type;
      return self.loader;
    }

    this.stage.add = function (sprite) {
      return sprite.render(ctx);
    }

    this.stage.clear = function () {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }

    this.stage.on = function (name, call) {
      self['on' + name] = call;
    }

    this.stage.addHitRegion = function (opts, call) {
      self.stage.regions[opts.name] = new Object(Object.assign({call: call}, opts));
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
  constructor(noscale=false) {
    this.point = new Point();
    this.anchor = new Point();
    this.opacity = 1.0;
    this.deg = 0;
    this.scale = 1;
    this.noscale = noscale;
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

  setAnchor(x, y) {
    this.anchor.x = x;
    this.anchor.y = y;
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

class Sprite extends SpriteBase {
  constructor(texture) {
    super();
    var self = this;
    this.texture = texture
  }

  render(canvas) {
    if (this.texture.renderable) {
      this.settings(canvas);
      if (this.deg > 0) this.rotation_render(canvas)
      else canvas.drawImage(this.texture.image, this.x / this.scale - (this.texture.image.width * this.anchor.x), this.y / this.scale - (this.texture.image.height * this.anchor.y));
      this.reset(canvas);
    }
  }

  rotation_render(ctx) {
    var image = this.texture.image;

    ctx.save();
    ctx.translate(this.x / this.scale, this.y / this.scale);
    ctx.fillStyle = '#000000';
    ctx.rotate(Math.PI / 180 * this.deg);
    ctx.drawImage(image, (-image.width * this.anchor.x), (-image.height * this.anchor.y));
    ctx.restore();
  }

  clone() {
    return new Sprite(this.texture);
  }
}

class Rectangle extends SpriteBase {
  constructor(w, h, c='#000000') {
    super(true);
    this.width = w;
    this.height = h;
    this.color = c;
  }

  render(canvas) {
    this.settings(canvas);
    if (this.deg > 0) this.rotation_render(canvas);
    else {
      canvas.fillStyle = this.color;
      canvas.fillRect(this.x - (this.width * this.anchor.x), this.y - (this.height * this.anchor.y), this.width, this.height);
      canvas.fill();
    }
    this.reset(canvas);
  }

  rotation_render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.PI / 180 * this.deg);
    ctx.fillStyle = this.color;
    ctx.fillRect(0 - (this.width * this.anchor.x), 0 - (this.height * this.anchor.y), this.width, this.height);
    ctx.fill();
    ctx.restore();
  }
}

class Circle extends SpriteBase {
  constructor(r, c='#000000') {
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

class Text extends SpriteBase {
  constructor(txt, size, c='#000000') {
    super();
    this.text = txt;
    this.size = size;
    this.color = c;
  }

  render(canvas) {
    this.settings(canvas);
    canvas.beginPath();
    canvas.fillStyle = this.color;
    canvas.font = this.size + 'px Verdana';
    canvas.fillText(this.text, this.x, this.y);
    canvas.fill();
    this.reset(canvas);
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
    this.image = typeof src === "string" ? new Image() : src;
    this.renderable = typeof src === "string" ? false : true;
    if (typeof src === "string") {
      this.image.onload = function () {
        self.renderable = true;
      }
      this.image.src = src;
    }
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

    return new Sprite(new Texture(self.canvas));
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

  text(text, x, y, size, color) {
    this.ctx.beginPath();
    this.ctx.font = size + 'px Verdana';
    this.ctx.fillText(text, x, y);
    this.ctx.fill();

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
  App: Stage,
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

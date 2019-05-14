window.Pixel = {
  Game: game,
  Sprite: new game().sprite,
  Texture: new game().texture,
  Rectangle: new game().rectangle,
  Circle: new game().circle,
  Text: new game().text,
  Sound: new game().sound,
  PreTexture: function () {
    return {id: 'texture-preload', x: 0, y: 0, pivotX: 0, pivotY: 0, deg: 0, img: null};
  },
  DummySprite: function () {
    return {id: null, x: 0, y: 0, pivotX: 0, pivotY: 0, deg: 0, img: 0, w: 0, h: 0, r: 0, color: '#000000', size: 0};
  }
}

window.requestAnimationFrame = window.requestAnimationFrame
  || window.mozRequestAnimationFrame
  || window.webkitRequestAnimationFrame
  || window.msRequestAnimationFrame
  || function(f){return setTimeout(f, 1000/60)};

function game (height, width, options={ticker:true}) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  ctx.canvas.height = height;
  ctx.canvas.width = width;
  this.view = ctx.canvas;
  this.autoTick = options.ticker;
  this.draw = ctx;
  this.onclick;
  var self = this;

  this.elements = {sprites: []};
  this.resources = {};
  this.screen = {};

  var METHODS = {
    'texture': function (sprite) {
      sprite.img.onload = function () {
        ctx.drawImage(sprite.img, sX, sY);
      }
      sprite.img.src = sprite.src;
    },
    'texture-preload': function (sprite) {
      ctx.drawImage(sprite.img, sprite.x, sprite.y);
    },
    'rect': function (sprite) {
      ctx.fillStyle = sprite.color;
      ctx.fillRect(sprite.x, sprite.y, sprite.w, sprite.h);
      ctx.fill();
    },
    'circle': function (sprite) {
      ctx.fillStyle = sprite.color;
      ctx.beginPath();
      ctx.arc(sprite.x, sprite.y, sprite.r, 0, 2 * Math.PI);
      ctx.fill();
    },
    'text': function (sprite) {
      ctx.beginPath();
      ctx.fillStyle = sprite.color;
      ctx.font = sprite.size + 'px Verdana';
      ctx.fillText(sprite.text, sprite.x, sprite.y);
      ctx.fill();
    }
  }

  this.view.onclick = function (e) {
    if (self.onclick) return self.onclick(e);
  }

  function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect(),
        scaleX = canvas.width / rect.width,
        scaleY = canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    }
  }

  this.loader = {
    load: function (call) {
      return call(self.resources);
    }
  }

  this.elements.add = function (name='default', type={id: "rect", h: 10, w: 10, color: '#000000'}) {
    self.resources[name] = type;
    return self.loader;
  }

  this._rotate = function (pX, pY, deg, call) {
    if (deg === 0) return call();
    ctx.save();
    ctx.translate(pX, pY);
    ctx.rotate(deg * Math.PI / 180);
    call();
    ctx.restore();
  }

  this.screen.add = function (sprite) {
    return METHODS[sprite.id](sprite);
  }

  this.screen.clear = function () {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  this.screen.mouseX = function (event) {
    return getMousePos(self.view, event).x;
  }

  this.screen.mouseY = function (event) {
    return getMousePos(self.view, event).y;
  }

  this.texture = function (src) {
    var image;
    var img = {
      img: new Image(),
      src: src,
      id: 'texture'
    };
    return img;
  }

  this.rectangle = function (width, height, color='#000000') {
    return {
      id: 'rect',
      w: width,
      h: height,
      color: color
    }
  }

  this.text = function (txt='Hello World!', size=10, color='#000000') {
    return {
      id: 'text',
      txt: txt,
      color: color,
      size: size
    }
  }

  this.circle = function (radius, color='#000000') {
    return {
      id: 'circle',
      r: radius,
      color: color
    }
  }

  this.sprite = function (id) {
    var slf = this;
    this.x = 0;
    this.y = 0;
    this.pivotX = 0;
    this.pivotY = 0;
    this.deg = 0;
    this.id = id.id;
    this.anchor = function (pX, pY) {
      if (slf.id === "rect") {
        slf.pivotX = slf.x + (slf.w * pX);
        slf.pivotY = slf.y + (slf.h * pY);
      } else {
        return console.log("Anchoring an image, circle, or text is not yet supported");
      }
    }
    if (id.id === "rect") {
      this.w = id.w;
      this.h = id.h;
      this.color = id.color;
    } else if (id.id === "texture") {
      this.img = id.img;
    } else if (id.id === "circle") {
      this.r = id.r;
      this.color = id.color;
    } else if (id.id === "text") {
      this.text = id.txt;
      this.color = id.color;
      this.size = id.size;
    }
  }

  this.sound = function (url) {
    var audio = new Audio(url);
    return {play: function () { audio.play(); }};
  }

  this.addChild = function (sprite) {
    self.elements.sprites.push(sprite);
  }

  this.removeChildren = function () {
    self.elements.sprites = [];
  }

  this._animFrame = async function () {
    if (self.elements.sprites.length >= 1) self.screen.clear();
    for (var i = 0; i < self.elements.sprites.length; i++) {
      self.screen.add(self.elements.sprites[i]);
    }
    await requestAnimationFrame(self._tick);
    await requestAnimationFrame(self._animFrame);
  }

  this._tick = function () {
    if (self.tick !== undefined|null) {
      self.tick();
    }
  }

  this.render = function () {
    var l = self.elements.sprites.length;
    var i;
    if (l >= 1) self.screen.clear();
    for (i = 0; i < l; i++) {
      self.screen.add(self.elements.sprites[i]);
    }
  }

  if (self.autoTick) this._animFrame();
}

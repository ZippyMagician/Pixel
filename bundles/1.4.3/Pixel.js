class Point {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Point(this.x, this.y);
  }
}

function chooseRandom(array) {
  return array[Math.floor(Math.random() * (array.length - 1))];
}

var _pixel_keys = {
  1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 0: "0",
  TAB: "Tab", SHIFT: "Shift", COMMA: ",", PERIOD: ".", BACKSLASH: "/", TILDE: "~", EXCLAMATION: "!", ATSIGN: "@", HASHTAG: "#", DOLLARSIGN: "$", PERCENT: "%", DASH: "-", UNDERSCORE: "_", PLUS: "+", QUESTIONMARK: "?",
  A: "a", B: "b", C: "c", D: "d", E: "e", F: "f", G: "g", H: "h", I: "i", J: "j", K: "k", L: "l", M: "m", N: "n", O: "o", P: "p", Q: "q", R: "r", S: "s", T: "t", U: "u", V: "v", W: "w", X: "x", Y: "y", Z: "z",
  UP: "ArrowUp", DOWN: "ArrowDown", LEFT: "ArrowLeft", RIGHT: "ArrowRight",
  down: {
    1: false,2: false,3: false,4: false,5: false,6: false,7: false,8: false,9: false,0: false,
    TAB: false,SHIFT: false,COMMA: false,PERIOD: false,BACKSLASH: false,TILDE: false,EXCLAMATION: false,ATSIGN: false,HASHTAG: false,DOLLARSIGN: false,PERCENT: false,DASH: false,UNDERSCORE: false,PLUS: false,QUESTIONMARK: false,
    A: false,B: false,C: false,D: false,E: false,F: false,G: false,H: false,I: false,J: false,K: false,L: false,M: false,N: false,O: false,P: false,Q: false,R: false,S: false,T: false,U: false,V: false,W: false,X: false,Y: false,Z: false,
    UP: false,DOWN: false,LEFT: false,RIGHT: false
  }
};

class Stage {
  constructor(options) {
    var self = this;
    var canvas = document.createElement("canvas");
    canvas.height = options.height;
    canvas.width = options.width;
    var ctx = canvas.getContext("2d");
    this.view = ctx.canvas;
    this.draw = ctx;
    this.tick = false;
    this.cursor = canvas.style.cursor;
    this._backColor = "#FFFFFF";

    this.elements = { sprites: [] };
    this.resources = {};
    this.stage = { add: {}, clear: {}, regions: {}, keyboard: {}, mouse: {} };
    this.physics = { collider: {}, collisions: [], colliding: {} }

    this.physics.collider.add = function (name, sprite1, sprite2) { // Curently only Pixel#Map includes a checkCollisions ability
      self.physics.collisions.push({name: name, parent: sprite1, child: sprite2});
      self.physics.colliding[name] = false;
    }

    this.stage.mousePos = function(event) {
      var rect = canvas.getBoundingClientRect(),
        scaleX = canvas.width / rect.width,
        scaleY = canvas.height / rect.height;

      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
      };
    };

    this.stage.background = function(color) {
      self._backColor = color;
    };

    this._checkRegions = function(e, int = true) {
      var c = false;
      var mouse = self.stage.mousePos(e);
      self.stage.mouse = mouse;
      for (var r in self.stage.regions) {
        var reg = self.stage.regions[r];
        if (
          mouse.x > reg.start.x &&
          mouse.x < reg.end.x &&
          mouse.y > reg.start.y &&
          mouse.y < reg.end.y
        ) {
          if (int) reg.call();
          else canvas.style.cursor = "pointer";
          c = true;
        }
      }
      return c;
    };

    this.view.onclick = function(e) {
      self._checkRegions(e);
      if (self.onclick) return self.onclick(e);
    };

    document.onmousemove = function(e) {
      var check = self._checkRegions(e, false);
      if (!check) canvas.style.cursor = self.cursor;
      if (self.onmousemove) return self.onmousemove(e);
    };

    document.onmousedown = function(e) {
      self.lastClickTarget = e.target;
      if (self.onmousedown) return self.onmousedown(e);
    };

    document.onkeydown = function(e) {
      let key = e.key;
      let keys = _pixel_keys;
      for (var ke in keys) {
        if (key === keys[ke]) {
          keys.down[ke] = true;
        }
      }
      if (self.onkeydown) return self.onkeydown(e);
    };

    document.onkeyup = function(e) {
      let key = e.key;
      let keys = _pixel_keys;
      for (var ke in keys) {
        if (key === keys[ke]) {
          keys.down[ke] = false;
        }
      }
      if (self.onkeyup) return self.onkeyup(e);
    };

    this.elements.add = function(name = "default", url = "") {
      var image = new Image();
      return new Promise(function(resolve, reject) {
        image.onload = function() {
          self.resources[name] = {
            image: image,
            renderable: true
          };
          return resolve(self.resources);
        };
        image.crossOrigin = "Anonymous";
        image.src = url;
      });
    };

    this.stage.add = function(sprite) {
      return sprite.render(ctx);
    };

    this.stage.clear = function() {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    this.stage.on = function(name, call) {
      if (name === "mousemove" || name === "mousedown" || name === "click") {
        self["on" + name] = call;
      } else {
        self.view.addEventListener(name, call);
      }
    };

    this.stage.keyboard.on = function(name, call) {
      if (name === "keydown" || name === "keyup") self["on" + name] = call;
      else document["on" + name] = call;
    };

    this.stage.addHitRegion = function(opts, call) {
      self.stage.regions[opts.name] = new Object(
        Object.assign({ call: call }, opts)
      );
    };

    if ((options.ticker === undefined) | null || options.ticker)
      this._animFrame(this);
  }

  addChild(sprite) {
    this.elements.sprites.push(sprite);
  }

  removeChildren() {
    this.elements.sprites = [];
  }

  render(self) {
    var l = self.elements.sprites.length;
    if (l >= 1) self.stage.clear();

    self.draw.fillStyle = self._backColor;
    self.draw.fillRect(0, 0, self.view.width, self.view.height);

    for (var i = 0; i < l; i++) {
      self.stage.add(self.elements.sprites[i]);
    }
  }

  _checkCollisions(self) {
    for (let i in self.physics.collisions) {
      let collision = self.physics.collisions[i];
      let name = collision.name;
      let sprite = collision.parent;
      let ret = {top: false, bottom: false, left: false, right: false, body: false}


      if (Array.isArray(sprite)) {
        for (let x in sprite) {
          let spr = sprite[x];
          let col = spr.checkCollisions(collision.child);

          ret.body = col.body === true || ret.body === true ? true : false;
          ret.left = col.left === true || ret.left === true ? true : false;
          ret.right = col.right === true || ret.right === true ? true : false;
          ret.bottom = col.bottom === true || ret.bottom === true ? true : false;
          ret.top = col.top === true || ret.top === true ? true : false;
        }
      } else ret = sprite.checkCollisions(collision.child);

      self.physics.colliding[name] = ret;
    }
  }

  _animFrame(self) {
    self.render(self);
    requestAnimationFrame(self._checkCollisions.bind(false, self));
    requestAnimationFrame(self._tick.bind(false, self));
    requestAnimationFrame(self._animFrame.bind(false, self));
  }

  _tick(self) {
    if (self.tick) {
      self.tick();
    }
  }
}

class SpriteBase {
  constructor(noscale = false) {
    this.point = new Point();
    this.anchor = new Point();
    this.opacity = 1.0;
    this.deg = 0;
    this.scale = 1;
    this.noscale = noscale;
    this.flipX = false;
    this.flipY = false;
  }

  setSize(w, h) {
    this.width = w;
    this.height = h;
  }

  get x() {
    return this.point.x;
  }

  set x(v) {
    return (this.point.x = v);
  }

  get y() {
    return this.point.y;
  }

  set y(v) {
    return (this.point.y = v);
  }

  setAnchor(x, y) {
    this.anchor.x = x;
    this.anchor.y = y;
  }

  copy(sprite) {
    this.point = sprite.point;
    this.deg = sprite.deg;
    this.anchor = sprite.anchor;
    this.flipX = sprite.flipX;
    this.flipY = sprite.flipY;
    this.opacity = sprite.opacity;
    this.scale = sprite.scale;
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

class AnimationCore {
  constructor(parent) {
    this.parent = parent;
    this.frame = 0;
    this.cache = [];
    this.tracks = {};
    this.current = false;
    this.track;
  }

  stop(num) {
    let dummy = new Sprite({
      renderable: true,
      image: this.cache[num - 1].image
    });
    this.current = [dummy];
    this.frame = 0;
  }

  play(name) {
    if (this.track !== name) this.frame = 0;
    this.current = this.tracks[name];
    this.track = name;
  }

  add(name, prefix, delay = 0) {
    var cur_delay = delay;
    var frames = this.cache;
    var storage = [];

    for (var frame in frames) {
      var fram = frames[frame];

      if (fram.name.startsWith(prefix) && cur_delay === 0) {
        var dummy = new Sprite({ renderable: true, image: fram.image });
        storage.push(dummy);
      } else if (cur_delay > 0) cur_delay--;
    }
    if (storage.length > 0) this.tracks[name] = storage;
  }

  create(data) {
    let name = data.name;
    let start = data.positions[0];
    let end = data.positions[1];
    let frames = this.cache;
    let storage = [];

    for (var i = start - 1; i < end; i++) {
      var dummy = new Sprite({ renderable: true, image: frames[i].image });
      storage.push(dummy);
    }
    this.tracks[name] = storage;
  }

  multiAdd(groups) {
    for (var g in groups) {
      let group = groups[g];
      let name = group.name;
      let prefix = group.filter;
      let delay = group.offset;
      this.add(name, prefix, delay);
    }
  }

  group(name, prefix, delay = 0) {
    return {
      name: name,
      filter: prefix,
      offset: delay
    };
  }
}

class AnimatedSprite extends SpriteBase {
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

class SpriteSheet extends SpriteBase {
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

class Map extends SpriteBase {
  constructor(sheet, data) {
    super();
    this.sheet = sheet;
    this.data = data;
    this.tiles = [];
    this.exclude;
    this.colliders = [];
  }

  _includeCollider(id, sprite) {
    if (this.exclude) {
      let shouldInclude = this.exclude.indexOf(id) > -1 ? false : true;
      if (shouldInclude) this.colliders.push(sprite);
    }
  }

  applyTileset(tiles) {
    let layers = this.data.height;
    let cols = this.data.width;
    let self = this;
    for (var lay = 0; lay < layers; lay++) {
      for (var col = 0; col < cols; col++) {
        let tile = tiles[lay][col];
        let sprite = this.sheet[tile] ? new Sprite({ image: self.sheet[tile], renderable: true }) : false;
        this.tiles.push(sprite);
        if (sprite) this._includeCollider(tile, sprite);
      }
      col = 0;
    }
  }

  generateBlankMap() {
    for (var lay = 0; lay < this.data.height; lay++) {
      for (var col = 0; col < this.data.width; col++) {
        this.tiles.push(false);
      }
    }
  }

  collideByExclusion(ids) {
    this.exclude = ids;
  }

  checkCollisions(rect2) {
    let ret = {body: false, top: false, bottom: false, left: false, right: false};

    for (let i = 0; i < this.colliders.length; i++) {
      let rect1 = this.colliders[i];

      //rect1.x += this.x;
      //rect1.y += this.y;
      let col = rect1.checkCollisions(rect2);
      //console.log(col);
      ret.body = col.body === true || ret.body === true ? true : false;
      ret.left = col.left === true || ret.left === true ? true : false;
      ret.right = col.right === true || ret.right === true ? true : false;
      ret.bottom = col.bottom === true || ret.bottom === true ? true : false;
      ret.top = col.top === true || ret.top === true ? true : false;
      //rect1.x -= this.x;
      //rect1.y -= this.y;
    }
    return ret;
  }

  _match(max, array) {
    let rand = Math.random() * max;
    
    var sum = 0;
    var randomIndex = -1;
    for (var j = 0; j < array.length; j++) {
      sum += array[j].weight;
      if (rand <= sum) {
        var chosen = array[j].index;
        randomIndex = Array.isArray(chosen)
        ? chosen[Math.floor(Math.random() * chosen.length)]
        : chosen;
        break;
      }
    }
    return randomIndex;
  }

  weightedRandomize(gx, gy, w, h, index) {
    let bias = index.map(a => {
      return a.weight;
    });
    let max = 0;
    bias.forEach(r => {
      max += r;
    });
    
    let self = this;
    
    for (let y = gy; y <= gy + h; y++) {
      for (let x = gx; x <= gx + w; x++) {
        let til = this._match(max, index);

        this.tiles[x + y * this.data.height] = new Sprite({image: self.sheet[til], renderable: true});
        this._includeCollider(til, this.tiles[x + y * this.data.height]); // Include in others
      }
    }
  }

  placeTile(id, x, y) {
    let self = this;
    this.tiles[x + y * this.data.height] = new Sprite({image: self.sheet[id], renderable: true});
    this._includeCollider(id, this.tiles[x + y * this.data.height]);
  }

  tileToWorldX(x) {
    return (((this.data.width * this.data.tileWidth) / 2) * -1) + x * this.data.tileWidth;
  }

  tileToWorldY(y) {
    return (((this.data.height * this.data.tileHeight) / 2) * -1) + y * this.data.tileHeight;
  }

  placeTiles(tilesArray, x, y, w, h) { // Used from Phaser's 3.0.0 PutTilesAt method
    if (!Array.isArray(tilesArray[0])) {
      tilesArray = [ tilesArray ];
    }

    var height = tilesArray.length;
    var width = tilesArray[0].length;

    for (var ty = 0; ty < height; ty++) {
      for (var tx = 0; tx < width; tx++) {
        var tile = tilesArray[ty][tx];
        this.placeTile(tile, x + tx, y + ty);
      }
    }
  }

  fill(id, gx, gy, w, h) {
    let self = this;
    
    for (let y = gy; y < gy + h; y++) {
      for (let x = gx; x < gx + w; x++) {
        this.placeTile(id, x, y);
      }
    }
  }

  render(ctx) {
    let x = ((this.data.width * this.data.tileWidth) / 2) * -1;
    let y = ((this.data.height * this.data.tileHeight) / 2) * -1;
    for (var til in this.tiles) {
      let tile = this.tiles[til];
      if (tile) {
        tile.x = x + this.x;
        tile.y = y + this.y;
        tile.render(ctx);
      }
      x += this.data.tileWidth;
      if (x > this.data.tileWidth * this.data.width / 2 - this.data.tileWidth) {
        x = ((this.data.width * this.data.tileWidth) / 2) * -1;
        y += this.data.tileHeight;
      }
    }
  }
}

class Rectangle extends SpriteBase {
  constructor(w, h, c = "#000000") {
    super(true);
    this.width = w;
    this.height = h;
    this.color = c;
  }

  render(canvas) {
    this.settings(canvas);
    if (this.deg > 0 || this.flipX || this.flipY) this.rotation_render(canvas);
    else {
      canvas.fillStyle = this.color;
      canvas.fillRect(
        this.x - this.width * this.anchor.x,
        this.y - this.height * this.anchor.y,
        this.width,
        this.height
      );
      canvas.fill();
    }
    this.reset(canvas);
  }

  rotation_render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.flipX) ctx.scale(-1, 1);
    if (this.flipY) ctx.scale(1, -1);
    ctx.rotate((Math.PI / 180) * this.deg);
    ctx.fillStyle = this.color;
    ctx.fillRect(
      0 - this.width * this.anchor.x,
      0 - this.height * this.anchor.y,
      this.width,
      this.height
    );
    ctx.fill();
    ctx.restore();
  }
}

class Circle extends SpriteBase {
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

class Text extends SpriteBase {
  constructor(txt, size, c = "#000000") {
    super();
    this.text = txt;
    this.size = size;
    this.color = c;
  }

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
    for (var i in con) {
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
      this.image.onload = function() {
        self.renderable = true;
      };
      this.image.src = src;
    }
  }
}

class FillStyle {
  constructor() {
    this.reset();
  }

  reset() {
    this.color = 0xffffff;
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

    return new Promise(function(resolve, reject) {
      self.image.onload = function() {
        self.renderable = true;
        self.math = true;
        self.width = self.image.width;
        self.height = self.image.height;

        return resolve(self);
      };
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
    this.ctx.font = size + "px Verdana";
    this.ctx.fillText(text, x, y);
    this.ctx.fill();

    return this;
  }

  end() {
    this._fillStyle.reset();
    this.ctx.fillStyle = "#000000";
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

  arc(a, b, c, d, e, f = false) {
    this.ctx.beginPath();
    this.ctx.arc(a, b, c, d, e, f);
    this.ctx.fill();

    return this;
  }

  arcTo(a, b, c, d, e) {
    this.ctx.beginPath();
    this.ctx.arcTo(a, b, c, d, e);
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
    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.globalCompositeOperation = "source-over";
  }
}

window.Pixel = {
  App: Stage,
  Sprite: Sprite,
  AnimatedSprite: AnimatedSprite,
  Texture: Texture,
  Rectangle: Rectangle,
  Circle: Circle,
  Text: Text,
  Sound: Sound,
  Point: Point,
  Container: Container,
  Graphics: Graphics,
  SpriteSheet: SpriteSheet,
  Keys: _pixel_keys,
  Map: Map,
  EXPORTS: {
    SpriteBase: SpriteBase,
    AnimationCore: AnimationCore
  }
};

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(f) {
    return setTimeout(f, 1000 / 60);
  };

export class Stage {
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

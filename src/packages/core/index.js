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

module.exports = Game;

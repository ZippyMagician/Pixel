import Container from "./container";

/**
  * The stage controls all things that run in Pixel
  *
  * @class
  * @memberof Pixel
*/

class Stage {

  /**
    * Takes an options object, contains the width and height
    *
    * @constructor
    * @param {object} options - The options rendering parameter
    * @param {number} options.width - The width of the canvas
    * @param {number} options.height - The height of the canvas
    * @param {boolean} [options.ticker=true] - Whether or not the canvas automatically renders every tick
  */

  constructor(options) {
    var canvas = document.createElement("canvas");
    canvas.height = options.height;
    canvas.width = options.width;
    var ctx = canvas.getContext("2d");

    /**
      * The canvas element
      * 
      * @name Pixel.Stage#view
      * @type {HTMLCanvasElement}
    */

    this.view = ctx.canvas;

    /**
      * The primitive drawing function
      * 
      * @name Pixel.Stage#draw
      * @type {CanvasRenderingContext2d}
    */

    this.draw = ctx;

    /**
      * Records whether or not the canvas renders every tick
      * 
      * @private
      * @name Pixel.Stage#tick
      * @type {boolean}
    */

    this.tick = options.ticker === undefined|null ? true : options.ticker;

    /**
      * Current cursor displayed
      * 
      * @private
      * @name Pixel.Stage#cursor
    */

    this.cursor = canvas.style.cursor;

    /**
      * Stores all preloaded textures
      * 
      * @namespace Pixel.Stage.resources
    */

    this.resources = {};

    /**
      * The current stage object
      * 
      * @type {Pixel.Container}
      * @name Pixel.Stage#stage
    */

    this.stage = new Container(this.draw);

    /**
      * The physics storage object
      * 
      * @type {object}
      * @namespace Pixel.Stage.physics
      * @property {object[]} [collisions] - Stores all collision data
      * @property {object} [colliding] - Stores the booleans of every colliding element
    */

    this.physics = {collisions: [], colliding: {} };
   
    /**
      * The collider element, allows to add more collisions
      *
      * @namespace Pixel.Stage.physics.collider
    */
   
    this.physics.collider = {};

    /**
      * Adds new collider
      * 
      * @function Pixel.Stage.physics.collider#add
      * @param {string} name - The name of the collision
      * @param {Pixel.Sprite[]|Pixel.Map[]|Pixel.AnimatedSprite[]} sprite1 - The first sprite(s) that will collide with the second
      * @param {Pixel.Sprite|Pixel.Map|Pixel.AnimatedSprite} sprite2 - The second sprite that collides with the first
    */

    this.physics.collider.add = (name, sprite1, sprite2) => {
      this.physics.collisions.push({name: name, parent: sprite1, child: sprite2});
      this.physics.colliding[name] = false;
    };

    /**
      * Checks if the mouse is inside any described click region
      * 
      * @private
      * @function Pixel.Stage#_checkRegions
      * @param {DocumentEvent} e - The Document Event
      * @param {boolean} [int=true] - Whether or not it will change the cursor
      * @return {boolean} True or False
    */

    this._checkRegions = (e, int = true) => {
      var c = false;
      var mouse = this.stage.mousePos(canvas, e);
      this.stage.mouse = mouse;
      for (var r in this.stage.regions) {
        var reg = this.stage.regions[r];
        if (mouse.x > reg.start.x && mouse.x < reg.end.x && mouse.y > reg.start.y && mouse.y < reg.end.y) {
          if (int) {
            reg.call();
          }
          else {
            canvas.style.cursor = "pointer";
          }
          c = true;
        }
      }
      return c;
    };

    /**
      * Private onclick function manager
      * 
      * @function Pixel.Stage.view#onclick
      * @private
    */

    this.view.onclick = (e) => {
      this._checkRegions(e);
      if (this.onclick) {
        return this.onclick(e);
      }
    };

    /**
      * Private onmousemove function manager
      * 
      * @private
      * @static
    */

    document.onmousemove = (e) => {
      var check = this._checkRegions(e, false);
      if (!check) {
        canvas.style.cursor = this.cursor;
      }
      if (this.stage.onmousemove) {
        return this.stage.onmousemove(e);
      }
    };

    /**
      * Private onmousedown function manager
      * 
      * @private
      * @static
    */

    document.onmousedown = (e) => {
      this.lastClickTarget = e.target;
      if (this.stage.onmousedown) {
        return this.stage.onmousedown(e);
      }
    };

    /**
      * Private onkeydown function manager
      * 
      * @private
      * @static
    */

    document.onkeydown = (e) => {
      let key = e.key;
      let keys = Pixel.Keys;
      for (var ke in keys) {
        if (key === keys[ke]) {
          keys.down[ke] = true;
        }
      }
      if (this.stage.onkeydown) {
        return this.stage.onkeydown(e);
      }
    };

    /**
      * Private onkeyup function manager
      * 
      * @private
      * @static
    */

    document.onkeyup = function(e) {
      let key = e.key;
      let keys = Pixel.Keys;
      for (var ke in keys) {
        if (key === keys[ke]) {
          keys.down[ke] = false;
        }
      }
      if (this.stage.onkeyup) {
        return this.stage.onkeyup(e);
      }
    };

    /**
      * Adds and preloads new Texture element to the resources
      * 
      * @function Pixel.Stage.resources#add
      * @param {string} name - Name this element will refer to
      * @param {string} url - URL That image is loaded from
      * @return {Promise}
      * @example
      * // Example of use where app is an instance of Pixel.Stage
      * app.resources.add('name', 'image/path').then(function (resources) {
      *   let sprite = new Pixel.Sprite(resources.name); // Automatically preloaded as a Pixel.Texture, pass through this
      * 
      *   // ...
      * });
    */

    this.resources.add = (name, url) => {
      var image = new Image();
      return new Promise((resolve, reject) => {
        image.onload = function() {
          this.resources[name] = {
            image: image,
            renderable: true
          };
          return resolve(this.resources);
        };
        image.crossOrigin = "Anonymous";
        image.src = url;
      });
    };

    if ((options.ticker === undefined) | null || options.ticker) {
      window.requestAnimationFrame(this._animFrame.bind(this));
    }
  }

  /**
    * Adds child to stage
    * 
    * @method Pixel.Stage#addChild
    * @param {Pixel.Sprite} sprite - Sprite to be added
  */

  addChild(sprite) {
    this.stage.addChild(sprite);
  }

  /**
    * Renders the entire stage
    * 
    * @method Pixel.Stage#render
  */

  render() {
    var l = this.stage.sprites.length;
    if (l >= 1) {this.stage.clear();}

    this.draw.fillStyle = this.stage._backColor;
    this.draw.fillRect(0, 0, this.view.width, this.view.height);

    for (var i = 0; i < l; i++) {
      this.stage.sprites[i].render(this.draw);
    }
  }

  /**
    * Checks through all collisions
    * 
    * @private
    * @method Pixel.Stage#_checkCollisions
  */

  _checkCollisions() {
    for (let i in this.physics.collisions) {
      let collision = this.physics.collisions[i];
      let name = collision.name;
      let sprite = collision.parent;
      let ret = {top: false, bottom: false, left: false, right: false, body: false};


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
      } else {ret = sprite.checkCollisions(collision.child);}

      this.physics.colliding[name] = ret;
    }
  }

  /**
    * Animation frame loop
    * 
    * @method Pixel.Stage#_animFrame
    * @private
  */

  _animFrame() {
    this.render();
    window.requestAnimationFrame(this._checkCollisions.bind(this));
    window.requestAnimationFrame(this._tick.bind(this));
    window.requestAnimationFrame(this._animFrame.bind(this));
  }

  /**
    * Ticker manager
    * 
    * @method Pixel.Stage#_tick
    * @private
    * @param {Pixel.Stage} self - Stage anim frame occurs on
  */

  _tick() {
    if (this.tick) {
      this.tick();
    }
  }
}

export {Stage as Stage, Container as Container};

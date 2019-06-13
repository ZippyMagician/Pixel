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
    var self = this;
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
      * The background color
      * 
      * @private
      * @name Pixel.Stage#_backColor
      * @type {string}
    */

    this._backColor = "#FFFFFF";

    /**
      * Stores all element management
      * 
      * @namespace Pixel.Stage.elements
    */

    this.elements = {};
   
    /**
      * Stores all textures loaded with `Pixel.Stage.elements.add`
      *
      * @name Pixel.Stage.elements#sprites
      * @type {object[]}
    */
   
    this.elements.sprites = [];

    /**
      * Stores all preloaded textures
      * 
      * @type {object}
      * @name Pixel.Stage#resources
    */

    this.resources = {};

    /**
      * The current stage object
      * 
      * @namespace Pixel.Stage.stage
    */

    this.stage = {};
   
    /**
      * Stores all clickable regions on the screen
      *
      * @name Pixel.Stage.stage#regions
      * @type {object}
    */
   
    this.stage.regions = {};
   
    /**
      * All keyboard related functions exist here
      *
      * @namespace Pixel.Stage.stage.keyboard
    */
   
    this.stage.keyboard = {};

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

    this.physics.collider.add = function (name, sprite1, sprite2) {
      self.physics.collisions.push({name: name, parent: sprite1, child: sprite2});
      self.physics.colliding[name] = false;
    };

    /**
      * Gets the current mouse position
      * 
      * @private
      * @function Pixel.Stage.stage#mousePos
      * @param {DocumentEvent} event - The Document Event element
      * @return {object} Returns the x and y in an object
    */

    this.stage.mousePos = function(event) {
      var rect = canvas.getBoundingClientRect(),
        scaleX = canvas.width / rect.width,
        scaleY = canvas.height / rect.height;

      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
      };
    };

    /**
      * Changes the background color
      * 
      * @function Pixel.Stage.stage#background
      * @param {string} color - The color, in hexidecimal or rgb
    */

    this.stage.background = function(color) {
      self._backColor = color;
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
          if (int) {reg.call();}
          else {canvas.style.cursor = "pointer";}
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

    this.view.onclick = function(e) {
      self._checkRegions(e);
      if (self.onclick) {return self.onclick(e);}
    };

    /**
      * Private onmousemove function manager
      * 
      * @private
      * @static
    */

    document.onmousemove = function(e) {
      var check = self._checkRegions(e, false);
      if (!check) {canvas.style.cursor = self.cursor;}
      if (self.onmousemove) {return self.onmousemove(e);}
    };

    /**
      * Private onmousedown function manager
      * 
      * @private
      * @static
    */

    document.onmousedown = function(e) {
      self.lastClickTarget = e.target;
      if (self.onmousedown) {return self.onmousedown(e);}
    };

    /**
      * Private onkeydown function manager
      * 
      * @private
      * @static
    */

    document.onkeydown = function(e) {
      let key = e.key;
      let keys = _pixel_keys;
      for (var ke in keys) {
        if (key === keys[ke]) {
          keys.down[ke] = true;
        }
      }
      if (self.onkeydown) {return self.onkeydown(e);}
    };

    /**
      * Private onkeyup function manager
      * 
      * @private
      * @static
    */

    document.onkeyup = function(e) {
      let key = e.key;
      let keys = _pixel_keys;
      for (var ke in keys) {
        if (key === keys[ke]) {
          keys.down[ke] = false;
        }
      }
      if (self.onkeyup) {return self.onkeyup(e);}
    };

    /**
      * Adds and preloads new Texture element to the resources
      * 
      * @function Pixel.Stage.elements#add
      * @param {string} name - Name this element will refer to
      * @param {string} url - URL That image is loaded from
      * @return {Promise}
    */

    this.elements.add = function(name, url) {
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

    /**
      * Auto renders sprite
      * 
      * @function Pixel.Stage.stage#add
      * @param {Pixel.Sprite|Pixel.SpriteSheet|Pixel.AnimatedSprite|Pixel.Map|Pixel.Rectangle|Pixel.Circle|Pixel.Text} sprite - Sprite to be rendered
    */

    this.stage.add = function(sprite) {
      return sprite.render(ctx);
    };

    /**
      * Clears the screen
      * 
      * @private
      * @function Pixel.Stage.stage#clear
    */

    this.stage.clear = function() {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    /**
      * Event handler
      * 
      * @function Pixel.Stage.stage#on
      * @param {string} name - Name of event
      * @param {function} call - Function called whenever event occurs
    */

    this.stage.on = function(name, call) {
      if (name === "mousemove" || name === "mousedown" || name === "click") {
        self["on" + name] = call;
      } else {
        self.view.addEventListener(name, call);
      }
    };

    /**
      * Define keyboard event triggers
      * 
      * @function Pixel.Stage.stage.keyboard#on
      * @param {string} name - Name of event
      * @param {function} call - Function called whenever event occurs
    */

    this.stage.keyboard.on = function(name, call) {
      if (name === "keydown" || name === "keyup") {self["on" + name] = call;}
      else {document["on" + name] = call;}
    };

    /**
      * Adds clickable region to the stage
      * 
      * @function Pixel.Stage.stage#addHitRegion
      * @param {object} opts - Options for hit region
      * @param {string} opts.name - Name of hit region
      * @param {Pixel.Point} opts.start - Start point of hit region
      * @param {Pixel.Point} opts.end - End point of hit region
      * @param {function} call - Function called when region clicked
    */

    this.stage.addHitRegion = function(opts, call) {
      self.stage.regions[opts.name] = new Object(
        Object.assign({call: call}, opts)
      );
    };

    if ((options.ticker === undefined) | null || options.ticker)
      {this._animFrame(this);}
  }

  /**
    * Adds child to stage
    * 
    * @method Pixel.Stage#addChild
    * @param {Pixel.Sprite} sprite - Sprite to be added
  */

  addChild(sprite) {
    this.elements.sprites.push(sprite);
  }

  /**
    * Removes all children from stage
    * 
    * @method Pixel.Stage#removeChildren
  */

  removeChildren() {
    this.elements.sprites = [];
  }

  /**
    * Renders the entire stage
    * 
    * @method Pixel.Stage#render
    * @param {Pixel.Stage} self - Stage to be rendered
  */

  render(self) {
    var l = self.elements.sprites.length;
    if (l >= 1) {self.stage.clear();}

    self.draw.fillStyle = self._backColor;
    self.draw.fillRect(0, 0, self.view.width, self.view.height);

    for (var i = 0; i < l; i++) {
      self.stage.add(self.elements.sprites[i]);
    }
  }

  /**
    * Checks through all collisions
    * 
    * @private
    * @method Pixel.Stage#_checkCollisions
    * @param {Pixel.Stage} self - Stage that collisions are checked for
  */

  _checkCollisions(self) {
    for (let i in self.physics.collisions) {
      let collision = self.physics.collisions[i];
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

      self.physics.colliding[name] = ret;
    }
  }

  /**
    * Animation frame loop
    * 
    * @method Pixel.Stage#_animFrame
    * @private
    * @param {Pixel.Stage} self - Stage anim frame occurs on
  */

  _animFrame(self) {
    self.render(self);
    requestAnimationFrame(self._checkCollisions.bind(false, self));
    requestAnimationFrame(self._tick.bind(false, self));
    requestAnimationFrame(self._animFrame.bind(false, self));
  }

  /**
    * Ticker manager
    * 
    * @method Pixel.Stage#_tick
    * @private
    * @param {Pixel.Stage} self - Stage anim frame occurs on
  */

  _tick(self) {
    if (self.tick) {
      self.tick();
    }
  }
}

export {Stage as Stage, Container as Container};
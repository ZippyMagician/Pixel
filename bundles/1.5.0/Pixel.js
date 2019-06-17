/**
  * Created by Joshua Barnett
  * 
  * Licensed under MIT, 2019
  * All Rights reserved
  */

'use strict';

/**
  * The base of every Sprite
  *
  * @class
  * @memberof Pixel.EXPORTS
*/

class SpriteBase {

  /**
    * Create new Sprite Base
    *
    * @param {boolean} [noscale=false] - Determines whether or not object can be rotated and scaled
  */

  constructor(noscale = false) {

    /**
      * The position of the sprite
      *
      * @name Pixel.EXPORTS.SpriteBase#point
      * @type {Pixel.Point}
    */

    this.point = new Point();

    /**
      * The anchor position of the sprite
      *
      * @name Pixel.EXPORTS.SpriteBase#anchor
      * @type {Pixel.Point}
    */

    this.anchor = new Point();

    /**
      * The opacity of the sprite
      *
      * @name Pixel.EXPORTS.SpriteBase#opacity
      * @type {number}
    */

    this.opacity = 1.0;

    /**
      * The degress of rotation on the sprite
      *
      * @name Pixel.EXPORTS.SpriteBase#deg
      * @type {number}
      * @default 0
    */

    this.deg = 0;

    /**
      * The scale of the sprite (0 --> 1)
      *
      * @name Pixel.EXPORTS.SpriteBase#scale
      * @type {number}
      * @default 1
    */

    this.scale = 1;

    /**
      * Whether the sprite is scaled, stored
      * 
      * @name Pixel.EXPORTS.SpriteBase#noscale
      * @private
      * @type {boolean}
    */

    this.noscale = noscale;

    /**
      * Determines if the sprite is flipped over the x axis
      *
      * @name Pixel.EXPORTS.SpriteBase#flipX
      * @type {boolean}
      * @default false
    */

    this.flipX = false;

    /**
      * Determines if the sprite is flipped over the y axis
      *
      * @name Pixel.EXPORTS.SpriteBase#flipY
      * @type {boolean}
      * @default false
    */

    this.flipY = false;
  }

  /**
    * Sets the hitbox size of the sprite
    *
    * @method Pixel.EXPORTS.SpriteBase#setSize
    * @param {number} w - Width
    * @param {number} h - Height
  */

  setSize(w, h) {

    /**
      * Width of the Sprite's hitbox
      *
      * @name Pixel.EXPORTS.SpriteBase#width
      * @type {number}
    */

    this.width = w;

    /**
      * Height of the Sprite's hitbox
      *
      * @name Pixel.EXPORTS.SpriteBase#height
      * @type {number}
    */

    this.height = h;
  }

  /**
    * X position
    *
    * @name Pixel.EXPORTS.SpriteBase#x
    * @type {number}
  */

  get x() {
    return this.point.x;
  }

  set x(v) {
    return (this.point.x = v);
  }

  /**
    * Y position
    *
    * @name Pixel.EXPORTS.SpriteBase#y
    * @type {number}
  */

  get y() {
    return this.point.y;
  }

  set y(v) {
    return (this.point.y = v);
  }

  /**
    * Set the position the sprite is anchored to (0-->1)
    *
    * @method Pixel.EXPORTS.SpriteBase#setAnchor
    * @param {number} x - X position, scale of 0 to 1
    * @param {number} y - Y position, scale of 0 to 1
  */

  setAnchor(x, y) {
    this.anchor.x = x;
    this.anchor.y = y;
  }

  /**
    * Copy the value of another sprite onto this one
    *
    * @method Pixel.EXPORTS.SpriteBase#copy
    * @param {Pixel.Sprite} sprite - Sprite who's values this will copy
  */

  copy(sprite) {
    this.point = sprite.point;
    this.deg = sprite.deg;
    this.anchor = sprite.anchor;
    this.flipX = sprite.flipX;
    this.flipY = sprite.flipY;
    this.opacity = sprite.opacity;
    this.scale = sprite.scale;
  }

  /**
    * Spins x * 360 degrees
    *
    * @method Pixel.EXPORTS.SpriteBase#spin
    * @param {number} num - Amount of times sprite rotates 360 degrees
  */

  spin(num) {
    this.deg = num * 360;
  }

  /**
    * Applies settings set on sprite
    *
    * @method Pixel.EXPORTS.SpriteBase#settings
    * @param {CanvasRenderingContext2d} ctx - Context to apply settings to
  */

  settings(ctx) {
    if (!this.noscale) {ctx.globalAlpha = this.opacity;}
    ctx.scale(this.scale, this.scale);
  }

  /**
    * Resets settings set on sprite
    *
    * @method Pixel.EXPORTS.SpriteBase#reset
    * @param {CanvasRenderingContext2d} ctx - Context to reset settings on
  */

  reset(ctx) {
    ctx.globalAlpha = 1.0;
    if (!this.noscale) {ctx.scale(1 / this.scale, 1 / this.scale);}
  }
}

/**
  * Circle class
  *
  * @class
  * @memberof Pixel
  * @extends {Pixel.EXPORTS.SpriteBase}
*/

class Circle extends SpriteBase {

  /**
    * Create new Circle element
    *
    * @constructor
    * @param {number} r - Radius of circle
    * @param {string} [c="#000000"] - Color of circle
  */

  constructor(r, c = "#000000") {
    super(true);

    /**
      * The radius of the circle
      *
      * @readonly
      * @name Pixel.Circle#radius
      * @type {number}
    */

    this.radius = r;

    /**
      * The color of the circle
      *
      * @readonly
      * @name Pixel.Circle#color
      * @type {string}
    */

    this.color = c;
  }

  /**
    * Renders circle
    *
    * @member Pixel.Circle#render
    * @param {CanvasRenderingContext2d} ctx - The Canvas to print to
  */

  render(canvas) {
    this.settings(canvas);
    canvas.beginPath();
    canvas.fillStyle = this.color;
    canvas.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    canvas.fill();
    this.reset(canvas);
  }
}

/**
  * New Point on the stage
  *
  * @class
  * @memberof Pixel
*/

class Point {

  /**
    * Create new point
    *
    * @param {number} [x=0] - X position
    * @param {number} [y=0] - Y position
  */

  constructor(x = 0, y = 0) {

    /**
      * Current X Coordinate
      *
      * @name Pixel.Point#x
      * @type {number}
    */

    this.x = x;

    /**
      * Current Y Coordinate
      *
      * @name Pixel.Point#y
      * @type {number}
    */

    this.y = y;
  }

  /**
    * Clones the point
    *
    * @method Pixel.Point#clone
    * @return {Pixel.Point}
  */

  clone() {
    return new Point(this.x, this.y);
  }
}

/**
  * New rectangle class
  *
  * @class
  * @memberof Pixel
  * @extends Pixel.EXPORTS.SpriteBase
*/

class Rectangle extends SpriteBase {

  /**
    * Create new rectangle
    *
    * @constructor
    * @param {number} w - Width of rectangle
    * @param {number} h - Height of rectangle
    * @param {string} [c="#000000"] - Color of rectangle
  */

  constructor(w, h, c = "#000000") {
    super(true);

    /**
      * Stores width of rectangle
      *
      * @readonly
      * @name Pixel.Rectangle#width
      * @type {number}
    */

    this.width = w;

    /**
      * Stores height of rectangle
      *
      * @readonly
      * @name Pixel.Rectangle#height
      * @type {number}
    */

    this.height = h;

    /**
      * Stores color of rectangle
      *
      * @readonly
      * @name Pixel.Rectangle#color
      * @type {string}
    */

    this.color = c;
  }

  /**
    * Renders rectangle
    *
    * @method Pixel.Rectangle#render
    * @param {CanvasRenderingContext2d} ctx - The Canvas to print to
  */

  render(canvas) {
    this.settings(canvas);
    if (this.deg > 0 || this.flipX || this.flipY) {this.rotation_render(canvas);}
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

  /**
    * Renders the rectangle at an angle, if necessary
    *
    * @private
    * @method Pixel.Rectangle#rotation_render
    * @param {CanvasRenderingContext2d} ctx - Rendering context drawn on
  */

  rotation_render(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    if (this.flipX) {ctx.scale(-1, 1);}
    if (this.flipY) {ctx.scale(1, -1);}
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

/**
  * Container class
  *
  * @class
  * @memberof Pixel
*/

class Container {

  /**
    * Creates a container element
    *
    * @constructor
    * @param {CanvasRenderingContext2D} ctx - The screen every object is rendered to
  */

  constructor(ctx) {
    let self = this;

    /**
      * Contains all sprites
      *
      * @name Pixel.Container#stage
      * @type {Pixel.Sprite[]}
    */

    this.sprites = [];

    /**
     * Stores the background color
     * 
     * @name Pixel.Container#_backColor
     * @type {string}
     * @private
    */

    this._backColor = "#FFFFFF";

    /**
     * Stores the canvas 2d context
     * 
     * @name Pixel.Container#ctx
     * @type {CanvasRenderingContext2D}
    */

    this.ctx = ctx;

    /**
      * I forgot what this is for but am to worried to get rid of it
      *
      * @name Pixel.Container#container
      * @type {boolean}
    */

    this.container = true;
   
    /**
      * Stores all clickable regions on the screen
      *
      * @name Pixel.Container#regions
      * @type {object}
    */
   
    this.regions = {};
   
    /**
      * All keyboard related functions exist here
      *
      * @namespace Pixel.Container.keyboard
    */
   
    this.keyboard = {};

    /**
      * Gets the current mouse position
      * 
      * @private
      * @function Pixel.Container#mousePos
      * @param {DocumentEvent} event - The Document Event element
      * @param {HTMLCanvasElement} canvas - The canvas it gets the mouse position on
      * @return {object} Returns the x and y in an object
    */

    this.mousePos = function(canvas, event) {
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
      * @function Pixel.Container#background
      * @param {string} color - The color, in hexidecimal or rgb
    */

    this.background = function(color) {
      self._backColor = color;
    };

    /**
      * Auto renders sprite
      * 
      * @function Pixel.Container#add
      * @param {Pixel.Sprite|Pixel.SpriteSheet|Pixel.AnimatedSprite|Pixel.Map|Pixel.Rectangle|Pixel.Circle|Pixel.Text} sprite - Sprite to be rendered
    */

    this.add = function(sprite) {
      return sprite.render(this.ctx);
    };

    /**
      * Clears the screen
      * 
      * @private
      * @function Pixel.Container#clear
    */

    this.clear = function() {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    };

    /**
      * Event handler
      * 
      * @function Pixel.Container#on
      * @param {string} name - Name of event
      * @param {function} call - Function called whenever event occurs
    */

    this.on = function(name, call) {
      if (name === "mousemove" || name === "mousedown" || name === "click") {
        self["on" + name] = call;
      } else {
        self.view.addEventListener(name, call);
      }
    };

    /**
      * Define keyboard event triggers
      * 
      * @function Pixel.Container.keyboard#on
      * @param {string} name - Name of event
      * @param {function} call - Function called whenever event occurs
    */

    this.keyboard.on = function(name, call) {
      if (name === "keydown" || name === "keyup") {self["on" + name] = call;}
      else {document["on" + name] = call;}
    };

    /**
      * Adds clickable region to the stage
      * 
      * @function Pixel.Container#addHitRegion
      * @param {object} opts - Options for hit region
      * @param {string} opts.name - Name of hit region
      * @param {Pixel.Point} opts.start - Start point of hit region
      * @param {Pixel.Point} opts.end - End point of hit region
      * @param {function} call - Function called when region clicked
    */

    this.addHitRegion = function(opts, call) {
      self.stage.regions[opts.name] = new Object(
        Object.assign({call: call}, opts)
      );
    };
  }

  /**
    * Adds child to container
    *
    * @method Pixel.Container#addChild
    * @param {Pixel.Sprite} sprite - Sprite to add
  */

  addChild(sprite) {
    this.sprites.push(sprite);
  }

  /**
    * Moves all children into a Pixel.Stage element
    *
    * @method Pixel.Container#cloneChildren
    * @param {Pixel.Stage} base - Stage contents are moved to
  */

  cloneChildren(base) {
    var con = this.contents;
    for(var i in con) {
      base.addChild(con[i]);
    }
  }

  /**
    * Renders all elements in container
    *
    * @method Pixel.Container#render
  */

  render() {
    var con = this.sprites;
    for (var i in con) {
      con[i].render(this.ctx);
    }
  }
}

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

    this.physics.collider.add = function (name, sprite1, sprite2) {
      self.physics.collisions.push({name: name, parent: sprite1, child: sprite2});
      self.physics.colliding[name] = false;
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
      var mouse = self.stage.mousePos(canvas, e);
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
      if (self.stage.onmousemove) {return self.stage.onmousemove(e);}
    };

    /**
      * Private onmousedown function manager
      * 
      * @private
      * @static
    */

    document.onmousedown = function(e) {
      self.lastClickTarget = e.target;
      if (self.stage.onmousedown) {return self.stage.onmousedown(e);}
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
      if (self.stage.onkeydown) {return self.stage.onkeydown(e);}
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
      if (self.stage.onkeyup) {return self.stage.onkeyup(e);}
    };

    /**
      * Adds and preloads new Texture element to the resources
      * 
      * @function Pixel.Stage.resources#add
      * @param {string} name - Name this element will refer to
      * @param {string} url - URL That image is loaded from
      * @return {Promise}
    */

    this.resources.add = function(name, url) {
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
    this.stage.addChild(sprite);
  }

  /**
    * Renders the entire stage
    * 
    * @method Pixel.Stage#render
    * @param {Pixel.Stage} self - Stage to be rendered
  */

  render(self) {
    var l = self.stage.sprites.length;
    if (l >= 1) {self.stage.clear();}

    self.draw.fillStyle = self.stage._backColor;
    self.draw.fillRect(0, 0, self.view.width, self.view.height);

    for (var i = 0; i < l; i++) {
      self.stage.sprites[i].render(self.draw);
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

/**
  * Animation core class
  *
  * @class
  * @memberof Pixel.EXPORTS
*/

class AnimationCore {

  /**
    * Create new Animation Core element
    *
    * @constructor
    * @param {Pixel.AnimatedSprite} parent - Parent of Animation Core
  */

  constructor(parent) {

    /**
      * Stores parent of this core
      *
      * @private
      * @name Pixel.EXPORTS.AnimationCore#parent
      * @type {Pixel.AnimatedSprite}
    */

    this.parent = parent;

    /**
      * Current frame this core is on
      *
      * @name Pixel.EXPORTS.AnimationCore#frame
      * @type {number}
    */

    this.frame = 0;

    /**
      * Stores spritesheet
      *
      * @name Pixel.EXPORTS.AnimationCore#cache
      * @type {Pixel.Sprite}
    */

    this.cache = [];

    /**
      * All tracks created that can be played
      *
      * @name Pixel.EXPORTS.AnimationCore#tracks
      * @type {object}
    */

    this.tracks = {};

    /**
      * Current track being played
      *
      * @name Pixel.EXPORTS.AnimationCore#current
      * @type {boolean|Pixel.Sprite[]}
    */

    this.current = false;

    /**
      * Current name of the track being played
      *
      * @name Pixel.EXPORTS.AnimationCore#track
      * @type {string}
    */

    this.track = "";
  }

  /**
    * Stops the current animation and plays 1 item in the cache on continous loop
    *
    * @method Pixel.EXPORTS.AnimationCore#stop
    * @param {number} num - ID of image being played continously
  */

  stop(num) {
    let dummy = new Sprite({
      renderable: true,
      image: this.cache[num - 1].image
    });
    this.current = [dummy];
    this.frame = 0;
  }

  /**
    * Plays an animation saved in the cache
    *
    * @method Pixel.EXPORTS.AnimationCore#play
    * @param {string} name - Name of track to be played
  */

  play(name) {
    if (this.track !== name) {this.frame = 0;}
    this.current = this.tracks[name];
    this.track = name;
  }

  /**
    * Add track when cached spritesheet is defined through a json file
    *
    * @method Pixel.EXPORTS.AnimationCore#add
    * @param {string} name - Name of track
    * @param {string} prefix - Name every item in track begins with
    * @param {number} [delay=0] - How many items to skip before they are added
  */

  add(name, prefix, delay = 0) {
    var cur_delay = delay;
    var frames = this.cache;
    var storage = [];

    for (var frame in frames) {
      var fram = frames[frame];

      if (fram.name.startsWith(prefix) && cur_delay === 0) {
        var dummy = new Sprite({renderable: true, image: fram.image});
        storage.push(dummy);
      } else if (cur_delay > 0) {cur_delay--;}
    }
    if (storage.length > 0) {this.tracks[name] = storage;}
  }

  /**
    * Create a new track if there is no json file
    *
    * @method Pixel.EXPORTS.AnimationCore#create
    * @param {object} data - Data for the creation
    * @param {string} data.name - Name of track
    * @param {number[]} data.positions - Array of start and end id of animation
  */

  create(data) {
    let name = data.name;
    let start = data.positions[0];
    let end = data.positions[1];
    let frames = this.cache;
    let storage = [];

    for (var i = start - 1; i < end; i++) {
      var dummy = new Sprite({renderable: true, image: frames[i].image});
      storage.push(dummy);
    }
    this.tracks[name] = storage;
  }

  /**
    * Add multiple animation tracks at once (with json file)
    *
    * @method Pixel.EXPORTS.AnimationCore#multiAdd
    * @param {object[]} groups - Data of every group to be added
    * 
    * @example
    *   data = { name: 'name', filter: 'prefix', offset: 'delay' }
    *   Pixel.AnimatedSprite.animation.multiAdd([data]) // Adds just one, but you get the idea
  */

  multiAdd(groups) {
    for (var g in groups) {
      let group = groups[g];
      let name = group.name;
      let prefix = group.filter;
      let delay = group.offset;
      this.add(name, prefix, delay);
    }
  }
}

/**
  * AnimatedSprite Class
  *
  * @class
  * @memberof Pixel
  * @extends Pixel.EXPORTS.SpriteBase
*/

class AnimatedSprite extends SpriteBase {

  /**
    * Create new Animated Sprite Object
    *
    * @constructor
    * @param {object|false} config - The configuration object, only passed if it is a json file
    * @param {Pixel.SpriteSheet#sheet|Pixel.SpriteSheet#generateSheet} sheet - The Sprite Sheet
    * @param {number} [speed=0.15] - Speed of animation
  */

  constructor(config, sheet, speed = 0.15) {
    super();

    /**
      * Animation Core for playing the animations
      *
      * @name Pixel.AnimatedSprite#animation
      * @type {Pixel.EXPORTS.AnimationCore}
    */

    this.animation = new AnimationCore(this);

    /**
      * Speed of the animation
      *
      * @name Pixel.AnimatedSprite#speed
      * @type {number}
      * @default 0.15
    */

    this.speed = speed;

    /**
      * SpriteSheet's image
      *
      * @name Pixel.AnimatedSprite#texture
      * @type {object|Pixel.SpriteSheet#sheet|Pixel.SpriteSheet#generateSheet}
    */

    this.texture = {image: new Image()};

    if (this.config) {

      /**
        * JSON Config file
        *
        * @name Pixel.AnimatedSprite#config
        * @type {object}
      */

      this.config = config;
      this.texture = sheet;

      this._splitFrames();
    } else {
      this.sheet = sheet;

      this._splitSheetFrames();
    }
  }

  /**
    * Slices each frame off of the SpriteSheet, used if JSON file exists
    *
    * @member Pixel.AnimatedSprite#_splitFrames
    * @private
  */

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

  /**
    * Slices each frame off of the SpriteSheet, used if no JSON file
    *
    * @member Pixel.AnimatedSprite#_splitSheetFrames
    * @private
  */

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

  /**
    * Cuts image
    *
    * @member Pixel.AnimatedSprite#_slice
    * @private
    * @param {number} x - X position
    * @param {number} y - Y position
    * @param {number} w - Width
    * @param {number} h - Height
    * @returns {HTMLCanvasElement}
  */

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

  /**
    * Renders current animation frame of sprite
    *
    * @member Pixel.AnimatedSprite#render
    * @param {CanvasRenderingContext2d} ctx - The Canvas to print to
  */

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

/**
  * Spritesheet class
  *
  * @class
  * @memberof Pixel
  * @extends Pixel.EXPORTS.SpriteBase
*/

class SpriteSheet extends SpriteBase {
  
  /**
    * Create new Sprite sheet class
    * 
    * @constructor
    * @param {Pixel.Texture} texture - The texture used for the sprite sheet
    * @param {object} data - Data passed in order to split spritesheet
    * @param {number} data.width - Width of the spritesheet (in tiles)
    * @param {number} data.height - Height of the spritesheet (in tiles)
    * @param {number} data.margin - Amount of padding around each sprite
    * @param {number} data.spacing - Amount of space between each sprite
    * @param {object} data.image - Stores data for each image being split
    * @param {number} data.image.width - Width of single tile
    * @param {number} data.image.height - Height of single tile
  */
  
  constructor(texture, data) {
    super();
    
    /**
      * Stores the texture for later use
      * 
      * @name Pixel.SpriteSheet#texture
      * @type {Pixel.Texture}
      * @private
    */
    
    this.texture = texture;
    
    /**
      * Stores every seperate frame of the spritesheet
      *
      * @name Pixel.SpriteSheet#sheet
      * @type {HTMLCanvasElement[]}
    */

    this.sheet = [];
    
    
    
    this._parse(data);
  }
  
  /**
    * Crops an image into a smaller version
    *
    * @method Pixel.SpriteSheet#_slice
    * @private
    * @param {number} x - X position of crop
    * @param {number} y - Y position of crop
    * @param {number} w - Width of crop
    * @param {number} h - Height of crop
    * @param {image} [image=false] - If you want to pass a texture other than the main texture, use this
    * @returns {HTMLCanvasElement}
  */

  _slice(x, y, w, h, image=false) {
    let img = image || this.texture;
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");

    ctx.canvas.width = img.width ? img.width : img.image.width;
    ctx.canvas.height = img.height ? img.height : img.image.height;
    ctx.drawImage(img.width ? img : img.image, 0, 0);

    let data = ctx.getImageData(x, y, w, h);
    canvas.width = w;
    canvas.height = h;
    ctx.putImageData(data, 0, 0);

    return canvas;
  }
  
  /**
    * Trim image centered around image
    *
    * @method Pixel.SpriteSheet#trim
    * @private
    * @deprecated
    * @param {object} data - Data object passed
  */

  trim(data) {
    let w = data.width, h = data.height;
    let prev_w = this.sheet[0].width, prev_h = this.sheet[0].height;

    for (let i in this.sheet) {
      let image = this.sheet[i];
      let diffW = prev_w - w, diffH = prev_h - h;
      this.sheet[i] = this._slice(diffW / 2, diffH / 2, w - diffW / 2, h - diffH / 2, image);
    }
  }
  
  /**
    * Parses texture file into seperate files based on data
    *
    * @method Pixel.SpriteSheet#_parse
    * @private
    * @param {object} data - Data passed
  */

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
  
  /**
    * Returns the sheet for use in other sprites
    *
    * @method Pixel.SpriteSheet#generateSheet
    * @returns {Pixel.SpriteSheet#sheet}
  */

  generateSheet() {
    return this.sheet;
  }
}

/**
  * Sprite class
  *
  * @class
  * @memberof Pixel
  * @extends Pixel.EXPORTS.SpriteBase
*/

class Sprite$1 extends SpriteBase {

  /**
    * Create new Sprite
    *
    * @constructor
    * @param {Pixel.Texture} texture - Pass a texture to be used by the sprite
  */

  constructor(texture) {
    super();

    /**
      * Store the texture for later use
      * 
      * @name Pixel.Sprite#texture
      * @type {Pixel.Texture}
    */

    this.texture = texture;
  }

  /**
    * Renders sprite
    *
    * @method Pixel.Sprite#render
    * @param {CanvasRenderingContext2d} ctx - The Canvas to print to
  */

  render(canvas) {
    if (this.texture.renderable) {
      this.settings(canvas);
      if (this.deg > 0 || this.flipX || this.flipY)
        {this.rotation_render(canvas);}
      else
        {canvas.drawImage(
          this.texture.image,
          this.x / this.scale - this.texture.image.width * this.anchor.x,
          this.y / this.scale - this.texture.image.height * this.anchor.y
        );}
      this.reset(canvas);
    }
  }

  /**
    * Renders the sprite at an angle
    *
    * @method Pixel.Sprite#rotation_render
    * @param {CanvasRenderingContext2d} ctx - The Canvas to print to
  */

  rotation_render(ctx) {
    var image = this.texture.image;

    ctx.save();
    ctx.translate(this.x / this.scale, this.y / this.scale);
    if (this.flipX) {ctx.scale(-1, 1);}
    if (this.flipY) {ctx.scale(1, -1);}
    ctx.fillStyle = "#000000";
    ctx.rotate((Math.PI / 180) * this.deg);
    ctx.drawImage(
      image,
      -image.width * this.anchor.x,
      -image.height * this.anchor.y
    );
    ctx.restore();
  }

  /**
    * Check if object is colliding with another object
    *
    * Ported from https://www.w3schools.com/graphics/game_obstacles.asp
    * 
    * @method Pixel.Sprite#checkCollisions
    * @param {Pixel.Sprite} otherobj - The other sprite
    * @returns {object}
  */

  checkCollisions(otherobj) {
    let bias = 0;
    var myleft = this.x / this.scale - this.texture.image.width * this.anchor.x;
    var myright = myleft + (this.texture.image.width);
    var mytop = this.y / this.scale - this.texture.image.height * this.anchor.y;
    var mybottom = mytop + (this.texture.image.height);
    var otherleft = otherobj.x / otherobj.scale - (otherobj.width || otherobj.texture.image.width) * otherobj.anchor.x;
    var otherright = otherleft + (otherobj.width || otherobj.texture.image.width) / otherobj.scale;
    var othertop = otherobj.y / otherobj.scale - (otherobj.height || otherobj.texture.image.height) * otherobj.anchor.y;
    var otherbottom = othertop + (otherobj.height || otherobj.texture.image.height) / otherobj.scale;
    
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
      if (mybottom - bias > otherbottom && mytop + bias < otherbottom) {bottom = true;}
      if (mytop + bias < othertop && mybottom - bias > othertop) {top = true;}
      if (myleft + bias < otherleft && myright - bias > otherleft) {left = true;}
      if (myright - bias > otherright && myleft + bias < otherright) {right = true;}
    }
    return {body: crash, left: left, right: right, top: top, bottom: bottom};
  }

  /**
    * Clones the sprite
    *
    * @method Pixel.Sprite#clone
    * @returns {Pixel.Sprite}
  */

  clone() {
    let sprite = new Sprite$1(this.texture);
    sprite.copy(this);
    return sprite;
  }
}

/**
  * Texture class for loading images
  *
  * @class
  * @memberof Pixel
*/

class Texture {
  
  /**
    * Create new texture object
    *
    * @constructor
    * @param {string} src - Image to be loaded
  */
  
  constructor(src) {
    var self = this;
    
    /**
      * Where the image is stored once loaded
      *
      * @name Pixel.Texture#image
      * @type {HTMLImageElement}
    */
    
    this.image = new Image();
    
    /**
      * Records whether or not the image is renderable
      *
      * @name Pixel.Texture#renderable
      * @type {boolean}
    */
    
    this.renderable = false;
    
    
    
    this.image.onload = function () {
      self.renderable = true;
    };
    
    
    
    this.image.src = src;
  }
}

/**
  * Text class
  *
  * @class
  * @memberof Pixel
  * @extends Pixel.EXPORTS.SpriteBase
*/

class Text extends SpriteBase {
  
  /**
    * Create new text object
    *
    * @constructor
    * @param {string|number} txt - Text to be printed
    * @param {number} size - Size of the text
    * @param {string} [c="#000000"] - Color of the text
  */
  
  constructor(txt, size, c = "#000000") {
    super();
    
    /**
      * The text that will be printed
      *
      * @name Pixel.Text#text
      * @type {string}
    */
    
    this.text = txt;
    
    /**
      * The size of the text
      *
      * @name Pixel.Text#size
      * @type {number}
    */
    
    this.size = size;
    
    /**
      * The color of the text
      *
      * @name Pixel.Text#color
      * @type {string}
    */
    
    this.color = c;
  }

  /**
    * Renders text
    *
    * @method Pixel.Text#render
    * @param {CanvasRenderingContext2d} ctx - The Canvas to print to
  */

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

/**
  * TODO: SOUND ENGINE
  *
  * @class
  * @memberof Pixel
*/

class Sound {

  /**
    * Create new sound element
    *
    * @constructor
  */

  constructor() {}
}

/**
  * Color/Transparency element for graphics
  *
  * @class
  * @memberof Pixel.EXPORTS
*/

class FillStyle {

  /**
    * Initiates new FillStyle element
    *
    * @constructor
  */

  constructor() {

    /**
      * The color of the fill element
      *
      * @name Pixel.EXPORTS.FillStyle#color
      * @type {number}
    */

    this.color;

    /**
      * Alpha (transparency) of element
      *
      * @name Pixel.EXPORTS.FillStyle#alpha
      * @type {number}
    */

    this.alpha;

    this.reset();
  }

  /**
    * Resets color and alpha
    * 
    * @method Pixel.EXPORTS.FillStyle#reset
  */

  reset() {
    this.color = 0xFFFFFF;
    this.alpha = 1;
  }

  /**
    * Clones this fill iteration into new one
    *
    * @method Pixel.EXPORTS.FillStyle#clone
    * @return {Pixel.EXPORTS.FillStyle}
  */

  clone() {
    var f = new FillStyle();
    f.color = this.color;
    f.alpha = this.alpha;
    
    return f;
  }

  /**
    * Fills color to new color
    *
    * @method Pixel.EXPORTS.FillStyle#fill
    * @param {number} c - Color to be set, Hex or RGB
    * @return {number}
  */

  fill(c) {
    this.color = c;

    return this.color;
  }
}

/**
  * ImageGraphics class
  *
  * @class
  * @memberof Pixel.EXPORTS
*/

class ImageGraphics {

  /**
    * Iterates a new "ImageGraphics" Element
    *
    * @constructor
  */

  constructor() {

    /**
      * Storage for a backup rendering context element
      *
      * @name Pixel.EXPORTS.ImageGraphics#cctx
      * @type {CanvasRenderingContext2d}
      * @private
    */

    this.cctx;

    /**
      * Storage for a backup canvas element
      *
      * @name Pixel.EXPORTS.ImageGraphics#canvas
      * @type {HTMLCanvasElement}
      * @private
    */

    this.canvas;

    /**
      * Stores the image modified
      *
      * @name Pixel.EXPORTS.ImageGraphics#image
      * @type {HTMLImageElement}
      * @private
    */

    this.image = new Image();

    /**
      * Determines whether or not the image is renderable
      *
      * @name Pixel.EXPORTS.ImageGraphics#renderable
      * @type {boolean}
      * @private
    */

    this.renderable = false;

    /**
      * Internal width of the canvas
      *
      * @name Pixel.EXPORTS.ImageGraphics#width
      * @type {number}
      * @private
    */

    this.width = 0;

    /**
      * Internal height of the canvas
      *
      * @name Pixel.EXPORTS.ImageGraphics#height
      * @type {number}
      * @private
    */

    this.height = 0;
  }

  /**
    * Loads image based on url
    *
    * @method Pixel.EXPORTS.ImageGraphics#loadImage
    * @return {Promise}
    * @param {string} url - URL of Image Element
  */

  loadImage(url) {
    var self = this;

    return new Promise(function (resolve, reject) {
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

  /**
    * Crops image based on x, y, width, and height
    *
    * @method Pixel.EXPORTS.ImageGraphics#cropRect
    * @return {Pixel.Sprite}
    * @param {number} x - X position of crop
    * @param {number} y - Y position of crop
    * @param {number} w - Width of crop
    * @param {number} h - Height of crop
  */

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

    return new Sprite$1({renderable: true, image: self.canvas});
  }
}

/**
  * Pixel Graphics Element
  *
  * @class
  * @memberof Pixel
  * @extends Pixel.EXPORTS.ImageGraphics
*/

class Graphics extends ImageGraphics {

  /**
    * Iterates new Graphic element
    *
    * @constructor
    * @param {CanvasRenderingContext2d} canvas - Canvas rendering context (usually Pixel.Stage#draw)
  */

  constructor(canvas) {
    super();

    /**
      * Stores canvas element
      *
      * @private
      * @name Pixel.Graphics#ctx
      * @type {CanvasRenderingContext2d}
    */

    this.ctx = canvas;

    /**
      * Stores original shadow color element value
      *
      * @private
      * @name Pixel.Graphics#dsc
      * @type {number}
    */

    this.dsc = this.ctx.shadowColor;

    /**
      * The filling style element
      *
      * @private
      * @name Pixel.Graphics#_fillStyle
      * @type {Pixel.EXPORTS.FillStyle}
    */

    this._fillStyle = new FillStyle();
  }

  /**
    * Sets transparency
    *
    * @method Pixel.Graphics#transparency
    * @param {number} value - Value of alpha level
    * @return {Pixel.Graphics}
  */

  transparency(value) {
    this.ctx.globalAlpha = value;

    return this;
  }

  /**
    * Sets shadows
    *
    * @method Pixel.Graphics#shadow
    * @param {number} blur - Blur of shadow
    * @param {string} color - Color of shadow
    * @param {number} offsetx - X offset of shadow
    * @param {number} offsety - Y offset of shadow
    * @return {Pixel.Graphics}
  */

  shadow(blur, color, offsetx, offsety) {
    this.ctx.shadowBlur = blur;
    this.ctx.shadowColor = color;
    this.ctx.shadowOffsetX = offsetx;
    this.ctx.shadowOffsetY = offsety;

    return this;
  }

  /**
    * Sets fill color
    *
    * @method Pixel.Graphics#fill
    * @param {string} c - Color used, RGB or Hex
    * @return {Pixel.Graphics}
  */

  fill(c) {
    this.ctx.fillStyle = this._fillStyle.fill(c);
    
    return this;
  }

  /**
    * Resets all values and terminates a chain
    * 
    * @method Pixel.Graphics#end
  */

  end() {
    this._fillStyle.reset();
    this.ctx.fillStyle = "#000000";
    this.ctx.shadowBlur = 0;
    this.ctx.shadowColor = this.dsc;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;
    this.ctx.globalAlpha = 1.0;
  }

  /**
    * Draws rectangle
    *
    * @method Pixel.Graphics#drawRect
    * @param {number} a - X position
    * @param {number} b - Y position
    * @param {number} c - Width
    * @param {number} d - Height
    * @return {Pixel.Graphics}
  */

  drawRect(a, b, c, d) {
    this.ctx.fillRect(a, b, c, d);

    return this;
  }

  /**
    * Draws arc
    *
    * @method Pixel.Graphics#arc
    * @param {number} a - X position
    * @param {number} b - Y position
    * @param {number} c - Radius
    * @param {number} d - Start angle
    * @param {number} e - End angle
    * @param {boolean} [f=false] - Anti-clockwise
    * @return {Pixel.Graphics}
  */

  arc(a, b, c, d, e, f=false) {
    this.ctx.beginPath();
    this.ctx.arc(a, b, c, d, e, f);
    this.ctx.fill();

    return this;
  }

  /**
    * Draws arc
    *
    * @deprecated
    * @method Pixel.Graphics#arcTo
    * @param {number} a - X position
    * @param {number} b - Y position
    * @param {number} c - Radius
    * @param {number} d - Start angle
    * @param {number} e - End angle
    * @return {Pixel.Graphics}
  */

  arcTo(a, b, c, d, e) {
    this.ctx.beginPath();
    this.ctx.arcTo(a, b, c, d, e);
    this.ctx.fill();

    return this;
  }

  /**
    * Move to X, Y
    *
    * @method Pixel.Graphics#move
    * @param {number} a - X position
    * @param {number} b - Y position
    * @return {Pixel.Graphics}
  */

  move(a, b) {
    this.ctx.moveTo(a, b);

    return this;
  }

  /**
    * Clears rectangular area on screen
    *
    * @method Pixel.Graphics#clearRect
    * @param {number} x - X position
    * @param {number} y - Y position
    * @param {number} w - Width
    * @param {number} h - Height
    * @return {Pixel.Graphics}
  */

  clearRect(x, y, w, h) {
    this.ctx.clearRect(x, y, w, h);

    return this;
  }

  /**
    * Clears circular area
    *
    * @method Pixel.Graphics#clearCircle
    * @param {number} x - X position
    * @param {number} y - Y position
    * @param {number} radius - Radius of circle
    * @return {Pixel.Graphics}
  */

  clearCircle(x, y, radius) {
    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.globalCompositeOperation = "source-over";
  }
}

/**
  * TileMap element
  *
  * @class
  * @memberof Pixel
  * @extends Pixel.EXPORTS.SpriteBase
*/

class Map extends SpriteBase {

  /**
    * Initiates new Tilemap
    *
    * @constructor
    * @param {Pixel.SpriteSheet#sheet|Pixel.SpriteSheet#generateSheet} sheet - The spritesheet used for the tilemap
    * @param {object} data - The data object for the tilemap
    * @param {number} data.width - The width of the spritesheet (in tile numbers)
    * @param {number} data.height - The height of the spritesheet (in tile numbers)
    * @param {number} data.tileHeight - Height of a tile
    * @param {number} data.tileWidth - Width of a tile
  */

  constructor(sheet, data) {
    super();

    /**
      * Stores the sheet
      *
      * @private
      * @name Pixel.Map#sheet
      * @type {Pixel.SpriteSheet#sheet|Pixel.SpriteSheet#generateSheet}
    */

    this.sheet = sheet;

    /**
      * Stores the data
      *
      * @private
      * @name Pixel.Map#data
      * @type {object}
    */

    this.data = data;

    /**
      * Tilemap array
      *
      * @name Pixel.Map#tiles
      * @type {number[][]}
    */

    this.tiles = [];

    /**
      * Tiles excluded from collisions
      * 
      * @private
      * @name Pixel.Map#exclude
      * @type {number[]}
    */

    this.exclude;

    /**
      * Tile IDS that can collide
      * 
      * @private
      * @name Pixel.Map#colliders
      * @type {number[]}
    */

    this.colliders = [];
  }

  /**
    * Checks if tile should be added to collide list
    *
    * @private
    * @method Pixel.Map#_includeCollider
    * @param {number} id - ID of tile
    * @param {HTMLCanvasElement} sprite - Canvas element (sprite) to be either added or excluded
  */

  _includeCollider(id, sprite) {
    if (this.exclude) {
      let shouldInclude = this.exclude.indexOf(id) > -1 ? false : true;
      if (shouldInclude) {this.colliders.push(sprite);}
    }
  }

  /**
    * Applies a pre-determined tileset to the tilemap
    *
    * @method Pixel.Map#applyTileset
    * @param {number[][]} tiles - Array of tiles
  */

  applyTileset(tiles) {
    let layers = this.data.height;
    let cols = this.data.width;
    let self = this;
    for (var lay = 0; lay < layers; lay++) {
      for (var col = 0; col < cols; col++) {
        let tile = tiles[lay][col];
        let sprite = this.sheet[tile] ? new Sprite$1({image: self.sheet[tile], renderable: true}) : false;
        this.tiles.push(sprite);
        if (sprite) {this._includeCollider(tile, sprite);}
      }
      col = 0;
    }
  }

  /**
    * Generates a blank tilemap
    * 
    * @method Pixel.Map#generateBlankMap
  */

  generateBlankMap() {
    for (var lay = 0; lay < this.data.height; lay++) {
      for (var col = 0; col < this.data.width; col++) {
        this.tiles.push(false);
      }
    }
  }

  /**
    * Sets collisions by excluding x ids
    *
    * @method Pixel.Map#collideByExclusion
    * @param {number[]} ids - IDs of every tile that cannot collide
  */

  collideByExclusion(ids) {
    this.exclude = ids;
  }

  /**
    * Checks collisions with a sprite
    *
    * @method Pixel.Map#checkCollisions
    * @param {Pixel.Sprite} rect2 - Sprite that tilemap checks to see if it is colliding with
  */

  checkCollisions(rect2) {
    let ret = {body: false, top: false, bottom: false, left: false, right: false};

    for (let i = 0; i < this.colliders.length; i++) {
      let rect1 = this.colliders[i];

      let col = rect1.checkCollisions(rect2);
      ret.body = col.body === true || ret.body === true ? true : false;
      ret.left = col.left === true || ret.left === true ? true : false;
      ret.right = col.right === true || ret.right === true ? true : false;
      ret.bottom = col.bottom === true || ret.bottom === true ? true : false;
      ret.top = col.top === true || ret.top === true ? true : false;
    }
    return ret;
  }

  /**
    * Gives random item in array based on each weight
    *
    * @method Pixel.Map#_match
    * @private
    * @param {number} max - The total weight
    * @param {object[]} array - Every item
    * @return {object[]}
    * 
    * @example
    *     _match(10, [{id: 10, weight: 5}, {id: 20, weight: 5}]);
  */

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

  /**
    * Randomly places tiles based on weight
    *
    * @method Pixel.Map#weightedRandomize
    * @param {number} gx - Starting tile x
    * @param {number} gy - Starting tile y
    * @param {number} w - Tile width (amount going across)
    * @param {number} h - Tile height (amount going down)
    * @param {object[]} index - All indexes + weights of ids to place
    * 
    * @example
    *     Pixel.Map.weightedRandomize(10, 10, 10, 10, [{index: 4, weight: 3}, {index: 10, weight: 0.5}]);
  */

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

        this.tiles[x + y * this.data.height] = new Sprite$1({image: self.sheet[til], renderable: true});
        this._includeCollider(til, this.tiles[x + y * this.data.height]);
      }
    }
  }

  /**
    * Places single tile at TileX and TileY
    *
    * @method Pixel.Map#placeTile
    * @param {number} id - ID of tile
    * @param {number} x - TileX of tile
    * @param {number} y - TileY of tile
  */

  placeTile(id, x, y) {
    let self = this;
    this.tiles[x + y * this.data.height] = new Sprite$1({image: self.sheet[id], renderable: true});
    this._includeCollider(id, this.tiles[x + y * this.data.height]);
  }

  /**
    * Converts tile to world x
    *
    * @method Pixel.Map#tileToWorldX
    * @param {number} x - TileX
  */

  tileToWorldX(x) {
    return (((this.data.width * this.data.tileWidth) / 2) * -1) + x * this.data.tileWidth;
  }

  /**
    * Converts tile to world y
    *
    * @method Pixel.Map#tileToWorldY
    * @param {number} y - TileY
  */

  tileToWorldY(y) {
    return (((this.data.height * this.data.tileHeight) / 2) * -1) + y * this.data.tileHeight;
  }

  /**
    * Places multiple tiles horizontally + vertically based on array
    *
    * @method Pixel.Map#placeTiles
    * @param {number[]|number[][]} tilesArray - Array of tiles to be placed
    * @param {number} x - X position of first tile
    * @param {number} y - Y position of first tile
    * 
    * @example
    *   Pixel.Map.placeTiles([ [10], [50], [32] ], 5, 5);  // Is vertically, starting at tile index 5, 5
    *   Pixel.Map.placeTiles([ 10, 50, 32 ], 5, 5); // Is horizontally, starting at tile index 5, 5
  */

  placeTiles(tilesArray, x, y) {
    if (!Array.isArray(tilesArray[0])) {
      tilesArray = [tilesArray];
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

  /**
    * Fills area with 1 tile
    *
    * @method Pixel.Map#fill
    * @param {number} id - ID of tile
    * @param {number} gx - Start x of fill
    * @param {number} gy - Start y of fill
    * @param {number} w - Width of fill
    * @param {number} h - Height of fill
  */

  fill(id, gx, gy, w, h) {
    for (let y = gy; y < gy + h; y++) {
      for (let x = gx; x < gx + w; x++) {
        this.placeTile(id, x, y);
      }
    }
  }

  /**
    * Renders the tilemap
    *
    * @method Pixel.Map#render
    * @param {CanvasRenderingContext2d} ctx - The Canvas to print to
  */

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

/**
  * The main namespace, contains all of Pixel's functions
  *
  * @namespace Pixel
  * @property {object} Keys - Stores all keys that can be pressed, along with methods to tell if they are being pressed
  * @example
  *   Pixel.Stage.on("keydown", function (e) {
  *     if (e.key === Pixel.Keys.SHIFT) {} // If shift is pressed, this triggers
  *   });
  *   
  *   Pixel.Stage.tick = function () {
  *     if (Pixel.Keys.down.SHIFT) {} // If shift is pressed, this also triggers, and runs quicker (prefered)
  *   }
*/

window.Pixel = {
  Stage: Stage,
  Sprite: Sprite$1,
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
  Keys: {
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
  },
  Map: Map,

  /**
   * All of the cores and bases used by various sprites
   * 
   * @namespace Pixel.EXPORTS
  */

  EXPORTS: {
    SpriteBase: SpriteBase,
    AnimationCore: AnimationCore,
    FillStyle: FillStyle,
    ImageGraphics: ImageGraphics
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

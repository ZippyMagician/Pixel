import Container from "./container";
import Physics from "../physics";

/**
 * The stage controls all things that run in Pixel.
 *
 * @class
 * @memberof Pixel
 */

class Stage {

    /**
     * Takes an options object, contains the width and height.
     *
     * @class
     * @param {object} options - The options rendering parameter.
     * @param {number} options.width - The width of the canvas.
     * @param {number} options.height - The height of the canvas.
     * @param {boolean} [options.ticker=true] - Whether or not the canvas automatically renders every tick.
     */

    constructor(options) {
        var canvas = document.createElement("canvas");
        canvas.height = options.height;
        canvas.width = options.width;
        var ctx = canvas.getContext("2d");

        /**
         * The canvas element.
         * 
         * @name Pixel.Stage#view
         * @type {HTMLCanvasElement}
         */

        this.view = ctx.canvas;

        /**
         * The primitive drawing function.
         * 
         * @name Pixel.Stage#draw
         * @type {CanvasRenderingContext2d}
         */

        this.draw = ctx;

        /**
         * Records whether or not the canvas renders every tick.
         * 
         * @private
         * @name Pixel.Stage#tick
         * @type {boolean}
         */

        this.tick = options.ticker === undefined|null ? true : options.ticker;

        /**
         * Current cursor displayed.
         * 
         * @private
         * @name Pixel.Stage#cursor
         */

        this.cursor = canvas.style.cursor;

        /**
         * Stores all preloaded textures.
         * 
         * @namespace Pixel.Stage.resources
         */

        this.resources = {};

        /**
         * The current stage object.
         * 
         * @type {Pixel.Container}
         * @name Pixel.Stage#stage
         */

        this.stage = new Container(this.draw);

        /**
         * The physics storage object.
         * 
         * @name {Pixel.Stage#physics}
         * @type {Pixel.Physics}
         */

        this.physics = new Physics(this);

        /**
         * Checks if the mouse is inside any described click region.
         * 
         * @private
         * @function Pixel.Stage#_checkRegions
         * @param {DocumentEvent} e - The Document Event.
         * @param {boolean} [int=true] - Whether or not it will change the cursor.
         * @returns {boolean} True or False.
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
         * Private onclick function manager.
         * 
         * @function Pixel.Stage.view#onclick
         * @private
         */

        this.view.onclick = (e) => {
            this._checkRegions(e);
            if (this.stage._events.click) {
                return this.stage._events.click(e);
            }
        };

        /**
         * Private onmousemove function manager.
         * 
         * @private
         * @static
         */

        document.onmousemove = (e) => {
            var check = this._checkRegions(e, false);
            if (!check) {
                canvas.style.cursor = this.cursor;
            }
            if (this.stage._events.mousemove) {
                return this.stage._events.mousemove(e);
            }
        };

        /**
         * Private onmousedown function manager.
         * 
         * @private
         * @static
         */

        document.onmousedown = (e) => {
            this.lastClickTarget = e.target;
            if (this.stage._events.mousedown) {
                return this.stage._events.mousedown(e);
            }
        };

        /**
         * Private onkeydown function manager.
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
            if (this.stage._events.keydown) {
                return this.stage._events.keydown(e);
            }
        };

        /**
         * Private onkeyup function manager.
         * 
         * @private
         * @static
         */

        document.onkeyup = (e) => {
            let key = e.key;
            let keys = Pixel.Keys;
            for (var ke in keys) {
                if (key === keys[ke]) {
                    keys.down[ke] = false;
                }
            }
            if (this.stage._events.keyup) {
                return this.stage._events.keyup(e);
            }
        };

        /**
         * Adds and preloads new Texture element to the resources.
         * 
         * @function Pixel.Stage.resources#add
         * @param {string} name - Name this element will refer to.
         * @param {string} url - URL That image is loaded from.
         * @returns {Promise}
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
                image.onload = () => {
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

        if (options.ticker === undefined || options.ticker) {
            window.requestAnimationFrame(this._animFrame.bind(this));
        }
    }

    /**
     * Adds child to stage.
     * 
     * @function Pixel.Stage#addChild
     * @param {Pixel.Sprite} sprite - Sprite to be added.
     */

    addChild(sprite) {
        this.stage.addChild(sprite);
    }

    /**
     * Renders the entire stage.
     * 
     * @function Pixel.Stage#render
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
     * Animation frame loop.
     * 
     * @function Pixel.Stage#_animFrame
     * @private
     */

    _animFrame() {
        this.render();
        window.requestAnimationFrame(this.physics.checkCollisions.bind(this.physics));
        window.requestAnimationFrame(this._tick.bind(this));
        window.requestAnimationFrame(this._animFrame.bind(this));
    }

    /**
     * Ticker manager.
     * 
     * @function Pixel.Stage#_tick
     * @private
     * @param {Pixel.Stage} self - Stage anim frame occurs on.
     */

    _tick() {
        if (this.stage._events.tick) {
            this.stage._events.tick();
        }
    }
}

export {Stage as Stage, Container as Container};

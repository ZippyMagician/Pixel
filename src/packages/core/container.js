import {Point} from "../shape";

/**
 * Container class.
 *
 * @class
 * @memberof Pixel
 */

export default class Container {

    /**
     * Creates a container element.
     *
     * @class
     * @param {CanvasRenderingContext2D} ctx - The screen every object is rendered to.
     */

    constructor(ctx) {
    /**
     * Contains all sprites.
     *
     * @name Pixel.Container#stage
     * @type {Pixel.Sprite[]}
     */

        this.sprites = [];

        /**
         * Stores the background color.
         * 
         * @name Pixel.Container#_backColor
         * @type {string}
         * @private
         */

        this._backColor = "#FFFFFF";

        /**
         * Stores the canvas 2d context.
         * 
         * @name Pixel.Container#ctx
         * @type {CanvasRenderingContext2D}
         */

        this.ctx = ctx;

        /**
         * I forgot what this is for but am to worried to get rid of it.
         *
         * @name Pixel.Container#container
         * @type {boolean}
         */

        this.container = true;
   
        /**
         * Stores all clickable regions on the screen.
         *
         * @name Pixel.Container#regions
         * @type {object}
         */
   
        this.regions = {};
   
        /**
         * All keyboard related functions exist here.
         *
         * @namespace Pixel.Container.keyboard
         */
   
        this.keyboard = {};

        /**
         * Stores all events currently defined.
         * 
         * @name Pixel.Container#_events
         * @type {object}
         * @private
         */

        this._events = {};

        /**
         * Define keyboard event triggers.
         * 
         * @function Pixel.Container.keyboard#on
         * @param {string} name - Name of event.
         * @param {Function} call - Function called whenever event occurs.
         */

        this.keyboard.on = (name, call) => {
            if (name === "keydown" || name === "keyup") {
                this._events[name] = call;
            }
            else {
                document["on" + name] = call;
            }
        };
    }

    /**
     * Adds child to container.
     *
     * @function Pixel.Container#addChild
     * @param {Pixel.Sprite} sprite - Sprite to add.
     */

    addChild(sprite) {
        this.sprites.push(sprite);
    }

    /**
     * Locates and deletes a sprite saved in the container.
     * 
     * @param {number} id - The ID of the sprite to be deleted.
     */

    removeChild(id) {
        for (let index in this.sprites) {
            if (this.sprites[index].id === id) {
                delete this.sprites[index];
            }
        }
    }

    /**
     * Event handler.
     * 
     * @function Pixel.Container#on
     * @param {string} name - Name of event.
     * @param {Function} call - Function called whenever event occurs.
     */

    on(name, call) {
        if (name === "mousemove" || name === "mousedown" || name === "click") {
            this["on" + name] = call;
        } else {
            this.view.addEventListener(name, call);
        }
    };

    /**
     * Defines a new event that can be called.
     * 
     * @function Pixel.Container#on
     * @param {string} name 
     * @param {Function} func 
     */

    on(name, func) {
        if (name === "mousemove" || name === "mousedown" || name === "click") {
            this._events[name] = func;
        } else {
            this.view.addEventListener(name, call);
        }
    }

    /**
     * Gets the current mouse position.
     * 
     * @private
     * @function Pixel.Container#mousePos
     * @param {DocumentEvent} event - The Document Event element.
     * @param {HTMLCanvasElement} canvas - The canvas it gets the mouse position on.
     * @returns {object} Returns the x and y in an object.
     */

    mousePos(canvas, event) {
        var rect = canvas.getBoundingClientRect(),
            scaleX = canvas.width / rect.width,
            scaleY = canvas.height / rect.height;

        return {
            x: (event.clientX - rect.left) * scaleX,
            y: (event.clientY - rect.top) * scaleY
        };
    }

    /**
     * Changes the background color.
     * 
     * @function Pixel.Container#background
     * @param {string} color - The color, in hexidecimal or rgb.
     */

    background(color) {
        this._backColor = color;
    }

    /**
     * Auto renders sprite.
     * 
     * @function Pixel.Container#add
     * @param {Pixel.Sprite|Pixel.SpriteSheet|Pixel.AnimatedSprite|Pixel.Map|Pixel.Rectangle|Pixel.Circle|Pixel.Text} sprite - Sprite to be rendered.
     */

    add(sprite) {
        return sprite.render(this.ctx);
    }

    /**
     * Clears the screen.
     * 
     * @private
     * @function Pixel.Container#clear
     */

    clear() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    }

    /**
     * Adds clickable region to the stage.
     * 
     * @function Pixel.Container#addHitRegion
     * @param {object} opts - Options for hit region.
     * @param {string} opts.name - Name of hit region.
     * @param {Pixel.Point} opts.start - Start point of hit region.
     * @param {Pixel.Point} opts.end - End point of hit region.
     * @param {Function} call - Function called when region clicked.
     */

    addHitRegion(opts, call) {
        this.regions[opts.name] = new Object(Object.assign({call: call}, opts));
    }

    /**
     * Moves all children into a Pixel.Stage element.
     *
     * @function Pixel.Container#cloneChildren
     * @param {Pixel.Stage} base - Stage contents are moved to.
     */

    cloneChildren(base) {
        var con = this.contents;
        for (var i in con) {
            base.addChild(con[i]);
        }
    }

    /**
     * Renders all elements in container.
     *
     * @function Pixel.Container#render
     */

    render() {
        var con = this.sprites;
        for (var i in con) {
            con[i].render(this.ctx);
        }
    }
}

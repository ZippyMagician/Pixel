import SpriteBase from "../sprite/base";

/**
 * New rectangle class.
 *
 * @class
 * @memberof Pixel
 * @augments Pixel.EXPORTS.SpriteBase
 */

export default class Rectangle extends SpriteBase {

    /**
     * Create new rectangle.
     *
     * @class
     * @param {number} w - Width of rectangle.
     * @param {number} h - Height of rectangle.
     * @param {string} [c="#000000"] - Color of rectangle.
     */

    constructor(w, h, c = "#000000") {
        super(true);

        /**
         * Stores width of rectangle.
         *
         * @readonly
         * @name Pixel.Rectangle#width
         * @type {number}
         */

        this.width = w;

        /**
         * Stores height of rectangle.
         *
         * @readonly
         * @name Pixel.Rectangle#height
         * @type {number}
         */

        this.height = h;

        /**
         * Stores color of rectangle.
         *
         * @readonly
         * @name Pixel.Rectangle#color
         * @type {string}
         */

        this.color = c;
    }

    /**
     * Renders rectangle.
     *
     * @function Pixel.Rectangle#render
     * @param {CanvasRenderingContext2d} ctx - The Canvas to print to.
     */

    render(canvas) {
        this.settings(canvas);
        if (this.deg > 0 || this.flipX || this.flipY) {this.rotation_render(canvas);}
        else {
            canvas.fillStyle = this.color;
            canvas.fillRect(this.x - this.width * this.anchor.x,
                this.y - this.height * this.anchor.y,
                this.width,
                this.height);
            canvas.fill();
        }
        this.reset(canvas);
    }

    /**
     * Renders the rectangle at an angle, if necessary.
     *
     * @private
     * @function Pixel.Rectangle#rotation_render
     * @param {CanvasRenderingContext2d} ctx - Rendering context drawn on.
     */

    rotation_render(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        if (this.flipX) {ctx.scale(-1, 1);}
        if (this.flipY) {ctx.scale(1, -1);}
        ctx.rotate((Math.PI / 180) * this.deg);
        ctx.fillStyle = this.color;
        ctx.fillRect(0 - this.width * this.anchor.x,
            0 - this.height * this.anchor.y,
            this.width,
            this.height);
        ctx.fill();
        ctx.restore();
    }
}

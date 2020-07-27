import SpriteBase from "../sprite/base";

/**
 * Circle class.
 *
 * @class
 * @memberof Pixel
 * @augments {Pixel.EXPORTS.SpriteBase}
 */

export default class Circle extends SpriteBase {

    /**
     * Create new Circle element.
     *
     * @class
     * @param {number} r - Radius of circle.
     * @param {string} [c="#000000"] - Color of circle.
     */

    constructor(r, c = "#000000") {
        super(true);

        /**
         * The radius of the circle.
         *
         * @readonly
         * @name Pixel.Circle#radius
         * @type {number}
         */

        this.radius = r;

        /**
         * The color of the circle.
         *
         * @readonly
         * @name Pixel.Circle#color
         * @type {string}
         */

        this.color = c;
    }

    /**
     * Renders circle.
     *
     * @member Pixel.Circle#render
     * @param {CanvasRenderingContext2d} ctx - The Canvas to print to.
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

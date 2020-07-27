/**
 * New Point on the stage.
 *
 * @class
 * @memberof Pixel
 */

export default class Point {

    /**
     * Create new point.
     *
     * @param {number} [x=0] - X position.
     * @param {number} [y=0] - Y position.
     */

    constructor(x = 0, y = 0) {

        /**
         * Current X Coordinate.
         *
         * @name Pixel.Point#x
         * @type {number}
         */

        this.x = x;

        /**
         * Current Y Coordinate.
         *
         * @name Pixel.Point#y
         * @type {number}
         */

        this.y = y;
    }

    /**
     * Clones the point.
     *
     * @function Pixel.Point#clone
     * @returns {Pixel.Point}
     */

    clone() {
        return new Point(this.x, this.y);
    }
}

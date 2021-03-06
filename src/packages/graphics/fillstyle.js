/**
 * Color/Transparency element for graphics.
 *
 * @class
 * @memberof Pixel.EXPORTS
 */

export default class FillStyle {

    /**
     * Initiates new FillStyle element.
     *
     * @class
     */

    constructor() {

        /**
         * The color of the fill element.
         *
         * @name Pixel.EXPORTS.FillStyle#color
         * @type {number}
         */

        this.color;

        /**
         * Alpha (transparency) of element.
         *
         * @name Pixel.EXPORTS.FillStyle#alpha
         * @type {number}
         */

        this.alpha;

        this.reset();
    }

    /**
     * Resets color and alpha.
     * 
     * @function Pixel.EXPORTS.FillStyle#reset
     */

    reset() {
        this.color = 0xFFFFFF;
        this.alpha = 1;
    }

    /**
     * Clones this fill iteration into new one.
     *
     * @function Pixel.EXPORTS.FillStyle#clone
     * @returns {Pixel.EXPORTS.FillStyle}
     */

    clone() {
        var f = new FillStyle();
        f.color = this.color;
        f.alpha = this.alpha;
    
        return f;
    }

    /**
     * Fills color to new color.
     *
     * @function Pixel.EXPORTS.FillStyle#fill
     * @param {number} c - Color to be set, Hex or RGB.
     * @returns {number}
     */

    fill(c) {
        this.color = c;

        return this.color;
    }
}

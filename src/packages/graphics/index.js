import FillStyle from "./fillstyle";
import ImageGraphics from "./image";

/**
 * Pixel Graphics Element.
 *
 * @class
 * @memberof Pixel
 * @augments Pixel.EXPORTS.ImageGraphics
 */

export default class Graphics extends ImageGraphics {

    /**
     * Iterates new Graphic element.
     *
     * @class
     * @param {CanvasRenderingContext2d} canvas - Canvas rendering context (usually Pixel.Stage#draw).
     */

    constructor(canvas) {
        super();

        /**
         * Stores canvas element.
         *
         * @private
         * @name Pixel.Graphics#ctx
         * @type {CanvasRenderingContext2d}
         */

        this.ctx = canvas;

        /**
         * Stores original shadow color element value.
         *
         * @private
         * @name Pixel.Graphics#dsc
         * @type {number}
         */

        this.dsc = this.ctx.shadowColor;

        /**
         * The filling style element.
         *
         * @private
         * @name Pixel.Graphics#_fillStyle
         * @type {Pixel.EXPORTS.FillStyle}
         */

        this._fillStyle = new FillStyle();
    }

    /**
     * Sets transparency.
     *
     * @function Pixel.Graphics#transparency
     * @param {number} value - Value of alpha level.
     * @returns {Pixel.Graphics}
     */

    transparency(value) {
        this.ctx.globalAlpha = value;

        return this;
    }

    /**
     * Sets shadows.
     *
     * @function Pixel.Graphics#shadow
     * @param {number} blur - Blur of shadow.
     * @param {string} color - Color of shadow.
     * @param {number} offsetx - X offset of shadow.
     * @param {number} offsety - Y offset of shadow.
     * @returns {Pixel.Graphics}
     */

    shadow(blur, color, offsetx, offsety) {
        this.ctx.shadowBlur = blur;
        this.ctx.shadowColor = color;
        this.ctx.shadowOffsetX = offsetx;
        this.ctx.shadowOffsetY = offsety;

        return this;
    }

    /**
     * Sets fill color.
     *
     * @function Pixel.Graphics#fill
     * @param {string} c - Color used, RGB or Hex.
     * @returns {Pixel.Graphics}
     */

    fill(c) {
        this.ctx.fillStyle = this._fillStyle.fill(c);
    
        return this;
    }

    /**
     * Resets all values and terminates a chain.
     * 
     * @function Pixel.Graphics#end
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
     * Draws rectangle.
     *
     * @function Pixel.Graphics#drawRect
     * @param {number} a - X position.
     * @param {number} b - Y position.
     * @param {number} c - Width.
     * @param {number} d - Height.
     * @returns {Pixel.Graphics}
     */

    drawRect(a, b, c, d) {
        this.ctx.fillRect(a, b, c, d);

        return this;
    }

    /**
     * Draws arc.
     *
     * @function Pixel.Graphics#arc
     * @param {number} a - X position.
     * @param {number} b - Y position.
     * @param {number} c - Radius.
     * @param {number} d - Start angle.
     * @param {number} e - End angle.
     * @param {boolean} [f=false] - Anti-clockwise.
     * @returns {Pixel.Graphics}
     */

    arc(a, b, c, d, e, f=false) {
        this.ctx.beginPath();
        this.ctx.arc(a, b, c, d, e, f);
        this.ctx.fill();

        return this;
    }

    /**
     * Draws arc.
     *
     * @deprecated
     * @function Pixel.Graphics#arcTo
     * @param {number} a - X position.
     * @param {number} b - Y position.
     * @param {number} c - Radius.
     * @param {number} d - Start angle.
     * @param {number} e - End angle.
     * @returns {Pixel.Graphics}
     */

    arcTo(a, b, c, d, e) {
        this.ctx.beginPath();
        this.ctx.arcTo(a, b, c, d, e);
        this.ctx.fill();

        return this;
    }

    /**
     * Move to X, Y.
     *
     * @function Pixel.Graphics#move
     * @param {number} a - X position.
     * @param {number} b - Y position.
     * @returns {Pixel.Graphics}
     */

    move(a, b) {
        this.ctx.moveTo(a, b);

        return this;
    }

    /**
     * Clears rectangular area on screen.
     *
     * @function Pixel.Graphics#clearRect
     * @param {number} x - X position.
     * @param {number} y - Y position.
     * @param {number} w - Width.
     * @param {number} h - Height.
     * @returns {Pixel.Graphics}
     */

    clearRect(x, y, w, h) {
        this.ctx.clearRect(x, y, w, h);

        return this;
    }

    /**
     * Clears circular area.
     *
     * @function Pixel.Graphics#clearCircle
     * @param {number} x - X position.
     * @param {number} y - Y position.
     * @param {number} radius - Radius of circle.
     * @returns {Pixel.Graphics}
     */

    clearCircle(x, y, radius) {
        this.ctx.globalCompositeOperation = "destination-out";
        this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.globalCompositeOperation = "source-over";
    }
}

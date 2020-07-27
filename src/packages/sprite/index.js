import SpriteBase from "./base";
import AnimatedSprite from "./animation";
import SpriteSheet from "./sheet";

/**
 * Sprite class.
 *
 * @class
 * @memberof Pixel
 * @augments Pixel.EXPORTS.SpriteBase
 */

class Sprite extends SpriteBase {

    /**
     * Create new Sprite.
     *
     * @class
     * @param {Pixel.Texture} texture - Pass a texture to be used by the sprite.
     */

    constructor(texture) {
        super();

        /**
         * Store the texture for later use.
         * 
         * @name Pixel.Sprite#texture
         * @type {Pixel.Texture}
         */

        this.texture = texture;
    }

    /**
     * Renders sprite.
     *
     * @function Pixel.Sprite#render
     * @param {CanvasRenderingContext2d} ctx - The Canvas to print to.
     */

    render(canvas) {
        if (this.texture.renderable) {
            this.settings(canvas);
            if (this.deg > 0 || this.flipX || this.flipY)
            {this.rotation_render(canvas);}
            else
            {canvas.drawImage(this.texture.image,
                this.x / this.scale - this.texture.image.width * this.anchor.x,
                this.y / this.scale - this.texture.image.height * this.anchor.y);}
            this.reset(canvas);
        }
    }

    /**
     * Renders the sprite at an angle.
     *
     * @function Pixel.Sprite#rotation_render
     * @param {CanvasRenderingContext2d} ctx - The Canvas to print to.
     */

    rotation_render(ctx) {
        var image = this.texture.image;

        ctx.save();
        ctx.translate(this.x / this.scale, this.y / this.scale);
        if (this.flipX) {ctx.scale(-1, 1);}
        if (this.flipY) {ctx.scale(1, -1);}
        ctx.fillStyle = "#000000";
        ctx.rotate((Math.PI / 180) * this.deg);
        ctx.drawImage(image,
            -image.width * this.anchor.x,
            -image.height * this.anchor.y);
        ctx.restore();
    }

    /**
     * Check if object is colliding with another object.
     *
     * Ported from https://www.w3schools.com/graphics/game_obstacles.asp.
     * 
     * @function Pixel.Sprite#checkCollisions
     * @param {Pixel.Sprite} otherobj - The other sprite.
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

        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
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
     * Clones the sprite.
     *
     * @function Pixel.Sprite#clone
     * @returns {Pixel.Sprite}
     */

    clone() {
        let sprite = new Sprite(this.texture);
        sprite.copy(this);
        return sprite;
    }
}

export {Sprite as Sprite, AnimatedSprite as AnimatedSprite, SpriteSheet as SpriteSheet};

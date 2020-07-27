/**
 * Physics class.
 * 
 * @class
 * @memberof Pixel
 */

export default class Physics {

    /**
     * Creates a physics instance.
     * 
     * @class
     * @param {Pixel.Stage} parent - The parent stage this physics runs off of.
     */

    constructor(parent) {
        /**
         * Contains the parent instance.
         * 
         * @name Pixel.Physics#parent
         * @type {Pixel.Stage}
         * @private
         */

        this.parent = parent;

        /**
         * Stores all collision data.
         *
         * @name Pixel.Physics#collisions
         * @type {object[]}
         */

        this.collisions = [];

        /**
         * Holds date telling the user if the sprite is colliding.
         * 
         * @name Pixel.Physics#colliding
         * @type {object}
         */
        
        this.colliding = {};
    }

    /**
     * Adds new collider.
     * 
     * @function Pixel.Physics#add
     * @param {string} name - The name of the collision.
     * @param {Pixel.Sprite[]|Pixel.Map[]|Pixel.AnimatedSprite[]} sprite1 - The first sprite(s) that will collide with the second.
     * @param {Pixel.Sprite|Pixel.Map|Pixel.AnimatedSprite} sprite2 - The second sprite that collides with the first.
     */

    add(name, sprite1, sprite2) {
        this.collisions.push({name, parent: sprite1, child: sprite2});
        this.colliding[name] = {left: false, right: false, up: false, down: false};
    }

    /**
     * Checks through all collisions.
     * 
     * @private
     * @function Pixel.Physics#_checkCollisions
     */

    _checkCollisions() {
        for (let i in this.collisions) {
            let collision = this.collisions[i];
            let name = collision.name;
            let sprite = collision.parent;
            let ret = {top: false, bottom: false, left: false, right: false, body: false};


            if (Array.isArray(sprite)) {
                for (let x in sprite) {
                    let spr = sprite[x];
                    let col = spr.checkCollisions(collision.child);

                    ret.body = col.body || ret.body;
                    ret.left = col.left || ret.left;
                    ret.right = col.right || ret.right;
                    ret.bottom = col.bottom || ret.bottom;
                    ret.top = col.top || ret.top;
                }
            } else {
                ret = sprite.checkCollisions(collision.child);
            }

            this.colliding[name] = ret;
        }
    }
}
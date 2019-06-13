import { Point } from "../shape";

/**
  * Container class
  *
  * @class
  * @memberof Pixel
*/

export default class Container {

  /**
    * Creates a container element
    *
    * @constructor
  */

  constructor() {

    /**
      * Contains all sprites
      *
      * @name Pixel.Container#contents
      * @type {Pixel.Sprite[]}
    */

    this.contents = [];

    /**
      * I forgot what this is for but am to worried to get rid of it
      *
      * @name Pixel.Container#container
      * @type {boolean}
    */

    this.container = true;

    /**
      * Position of this container
      *
      * @name Pixel.Container#point
      * @type {Pixel.Point}
    */

    this.point = new Point();
  }

  /**
    * Adds child to container
    *
    * @method Pixel.Container#addChild
    * @param {Pixel.Sprite} sprite - Sprite to add
  */

  addChild(sprite) {
    this.contents.push(sprite);
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
    * X position
    *
    * @name Pixel.Container#x
    * @type {number}
  */

  get x() {
    return this.point.x;
  }

  /**
    * Y position
    *
    * @name Pixel.Container#y
    * @type {number}
  */

  get y() {
    return this.point.y;
  }

  set x(v) {
    var con = this.contents;
    for (var i in con) {
      var c = con[i];
      c.x = c.x + (v - this.x);
    }
    this.point.x = v;
  }

  set y(v) {
    var con = this.contents;
    for (var i in con) {
      var c = con[i];
      c.y = c.y + (v - this.y);
    }
    this.point.y = v;
  }

  /**
    * Renders all elements in container
    *
    * @method Pixel.Container#render
    * @param {CanvasRenderingContext2d} ctx - The Canvas to print to
  */

  render(ctx) {
    var con = this.contents;
    for (var i in con) {
      con[i].render(ctx);
    }
  }
}

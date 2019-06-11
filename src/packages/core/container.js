import { Point } from '../shape';

/*
  * Container class
  *
  * @class
*/

export default class Container {

  /*
    * Creates a container element
    *
    * @constructor
  */

  constructor() {

    /*
      * Contains all sprites
      *
      * @member {Pixel.Sprite[]}
    */

    this.contents = [];

    /*
      * I forgot what this is for but am to worried to get rid of it
      *
      * @member {boolean}
    */

    this.container = true;

    /*
      * Position of this container
      *
      * @member {Pixel.Point}
    */

    this.point = new Point();
  }

  /*
    * Adds child to container
    *
    * @param {Pixel.Sprite} [sprite] - Sprite to add
  */

  addChild(sprite) {
    this.contents.push(sprite);
  }

  /*
    * Moves all children into a Pixel.Stage element
    *
    * @param {Pixel.Stage} [base] - Stage contents are moved to
  */

  cloneChildren(base) {
    var con = this.contents;
    for(var i in con) {
      base.addChild(con[i]);
    }
  }

  /*
    * X position
    *
    * @member {number}
  */

  get x() {
    return this.point.x;
  }

  /*
    * Y position
    *
    * @member {number}
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

  /*
    * Renders all elements in container
    *
    * @param {CanvasRenderingContext2d} [ctx] - The Canvas to print to
  */

  render(ctx) {
    var con = this.contents;
    for (var i in con) {
      con[i].render(ctx);
    }
  }
}

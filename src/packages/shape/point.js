/*
  * New Point on the stage
  *
  * @class
  * @memberof Pixel
*/

export default class Point {

  /*
    * Create new point
    *
    * @param {number} [x=0] - X position
    * @param {number} [y=0] - Y position
  */

  constructor(x = 0, y = 0) {

    /*
      * Current X Coordinate
      *
      * @member {number}
    */

    this.x = x;

    /*
      * Current Y Coordinate
      *
      * @member {number}
    */

    this.y = y;
  }

  /*
    * Clones the point
    *
    * @return {Pixel.Point}
  */

  clone() {
    return new Point(this.x, this.y);
  }
}
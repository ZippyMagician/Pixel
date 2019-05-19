var Point = require('../shape/point');

class Container {
  constructor() {
    this.contents = [];
    this.container = true;
    this.point = new Point();
  }

  addChild(sprite) {
    this.contents.push(sprite);
  }

  cloneChildren(base) {
    var con = this.contents;
    for(var i in con) {
      base.addChild(con[i]);
    }
  }

  get x() {
    return this.point.x;
  }

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

  render(ctx) {
    var con = this.contents;
    for (var i in con) {
      con[i].render(ctx);
    }
  }
}

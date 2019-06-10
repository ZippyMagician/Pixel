export default class Texture {
  constructor(src) {
    var self = this;
    this.image = new Image();
    this.renderable = false;
    this.image.onload = function () {
      self.renderable = true;
    }
    this.image.src = src;
  }
}

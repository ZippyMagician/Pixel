class ImageGraphics {
  constructor(canvas) {
    this.ctx = canvas;
    this.cctx;
    this.canvas;
    this.image = new Image();
    this.renderabe = false;

    this.width = 0;
    this.height = 0;
    this.math = false;
  }

  loadImage(url) {
    var self = this;

    return new Promise(function (resolve, reject) {
      self.image.onload = function() {
        self.renderable = true;
        self.math = true;
        self.width = self.image.width;
        self.height = self.image.height;

        return resolve(self);
      }
      self.image.src = url;
    });
  }

  cropRect(x, y, w, h) {
    var self = this;
    this.canvas = document.createElement("canvas");
    this.cctx = this.canvas.getContext("2d");

    this.cctx.canvas.width = this.width;
    this.cctx.canvas.height = this.height;
    this.cctx.drawImage(this.image, 0, 0);

    var data = this.cctx.getImageData(x, y, w, h);
    this.cctx.clearRect(0, 0, this.width, this.height);
    this.canvas.width = w;
    this.canvas.height = h;
    this.cctx.putImageData(data, 0, 0);

    return {
      x: 0,
      y: 0,
      image: self.canvas,
      render: function (c) {
        c.drawImage(this.image, this.x, this.y);
      },
      clone: function () {
        var s = this;
        return {
          x: s.x,
          y: s.y,
          image: s.image,
          render: s.render
        };
      }
    }
  }
}

module.exports = ImageGraphics

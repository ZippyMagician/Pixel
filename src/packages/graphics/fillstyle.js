export default class FillStyle {
  constructor() {
    this.reset();
  }

  reset() {
    this.color = 0xFFFFFF;
    this.alpha = 1;
  }

  clone() {
    var f = new FillStyle();
    f.color = this.color;
    f.alpha = this.alpha;
    
    return f;
  }

  fill(c) {
    this.color = c;

    return this.color;
  }
}

import SpriteBase from '../sprite/base';
import { Sprite } from '../sprite';

export default class Map extends SpriteBase {
  constructor(sheet, data) {
    super();
    this.sheet = sheet;
    this.data = data;
    this.tiles = [];
    this.exclude;
    this.colliders = [];
  }

  _includeCollider(id, sprite) {
    if (this.exclude) {
      let shouldInclude = this.exclude.indexOf(id) > -1 ? false : true;
      if (shouldInclude) this.colliders.push(sprite);
    }
  }

  applyTileset(tiles) {
    let layers = this.data.height;
    let cols = this.data.width;
    let self = this;
    for (var lay = 0; lay < layers; lay++) {
      for (var col = 0; col < cols; col++) {
        let tile = tiles[lay][col];
        let sprite = this.sheet[tile] ? new Sprite({ image: self.sheet[tile], renderable: true }) : false;
        this.tiles.push(sprite);
        if (sprite) this._includeCollider(tile, sprite);
      }
      col = 0;
    }
  }

  generateBlankMap() {
    for (var lay = 0; lay < this.data.height; lay++) {
      for (var col = 0; col < this.data.width; col++) {
        this.tiles.push(false);
      }
    }
  }

  collideByExclusion(ids) {
    this.exclude = ids;
  }

  checkCollisions(rect2) {
    let ret = {body: false, top: false, bottom: false, left: false, right: false};

    for (let i = 0; i < this.colliders.length; i++) {
      let rect1 = this.colliders[i];

      //rect1.x += this.x;
      //rect1.y += this.y;
      let col = rect1.checkCollisions(rect2);
      //console.log(col);
      ret.body = col.body === true || ret.body === true ? true : false;
      ret.left = col.left === true || ret.left === true ? true : false;
      ret.right = col.right === true || ret.right === true ? true : false;
      ret.bottom = col.bottom === true || ret.bottom === true ? true : false;
      ret.top = col.top === true || ret.top === true ? true : false;
      //rect1.x -= this.x;
      //rect1.y -= this.y;
    }
    return ret;
  }

  _match(max, array) {
    let rand = Math.random() * max;
    
    var sum = 0;
    var randomIndex = -1;
    for (var j = 0; j < array.length; j++) {
      sum += array[j].weight;
      if (rand <= sum) {
        var chosen = array[j].index;
        randomIndex = Array.isArray(chosen)
        ? chosen[Math.floor(Math.random() * chosen.length)]
        : chosen;
        break;
      }
    }
    return randomIndex;
  }

  weightedRandomize(gx, gy, w, h, index) {
    let bias = index.map(a => {
      return a.weight;
    });
    let max = 0;
    bias.forEach(r => {
      max += r;
    });
    
    let self = this;
    
    for (let y = gy; y <= gy + h; y++) {
      for (let x = gx; x <= gx + w; x++) {
        let til = this._match(max, index);

        this.tiles[x + y * this.data.height] = new Sprite({image: self.sheet[til], renderable: true});
        this._includeCollider(til, this.tiles[x + y * this.data.height]); // Include in others
      }
    }
  }

  placeTile(id, x, y) {
    let self = this;
    this.tiles[x + y * this.data.height] = new Sprite({image: self.sheet[id], renderable: true});
    this._includeCollider(id, this.tiles[x + y * this.data.height]);
  }

  tileToWorldX(x) {
    return (((this.data.width * this.data.tileWidth) / 2) * -1) + x * this.data.tileWidth;
  }

  tileToWorldY(y) {
    return (((this.data.height * this.data.tileHeight) / 2) * -1) + y * this.data.tileHeight;
  }

  placeTiles(tilesArray, x, y, w, h) { // Used from Phaser's 3.0.0 PutTilesAt method
    if (!Array.isArray(tilesArray[0])) {
      tilesArray = [ tilesArray ];
    }

    var height = tilesArray.length;
    var width = tilesArray[0].length;

    for (var ty = 0; ty < height; ty++) {
      for (var tx = 0; tx < width; tx++) {
        var tile = tilesArray[ty][tx];
        this.placeTile(tile, x + tx, y + ty);
      }
    }
  }

  fill(id, gx, gy, w, h) {
    let self = this;
    
    for (let y = gy; y < gy + h; y++) {
      for (let x = gx; x < gx + w; x++) {
        this.placeTile(id, x, y);
      }
    }
  }

  render(ctx) {
    let x = ((this.data.width * this.data.tileWidth) / 2) * -1;
    let y = ((this.data.height * this.data.tileHeight) / 2) * -1;
    for (var til in this.tiles) {
      let tile = this.tiles[til];
      if (tile) {
        tile.x = x + this.x;
        tile.y = y + this.y;
        tile.render(ctx);
      }
      x += this.data.tileWidth;
      if (x > this.data.tileWidth * this.data.width / 2 - this.data.tileWidth) {
        x = ((this.data.width * this.data.tileWidth) / 2) * -1;
        y += this.data.tileHeight;
      }
    }
  }
}

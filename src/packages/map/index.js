import SpriteBase from '../sprite/base';
import { Sprite } from '../sprite';

/**
  * TileMap element
  *
  * @class
  * @memberof Pixel
  * @extends Pixel.EXPORTS.SpriteBase
*/

export default class Map extends SpriteBase {

  /**
    * Initiates new Tilemap
    *
    * @constructor
    * @param {Pixel.SpriteSheet#sheet|Pixel.SpriteSheet#generateSheet} [sheet] - The spritesheet used for the tilemap
    * @param {object} [data] - The data object for the tilemap
    * @param {number} [data.width] - The width of the spritesheet (in tile numbers)
    * @param {number} [data.height] - The height of the spritesheet (in tile numbers)
    * @param {number} [data.tileHeight] - Height of a tile
    * @param {number} [data.tileWidth] - Width of a tile
  */

  constructor(sheet, data) {
    super();

    /**
      * Stores the sheet
      *
      * @private
      * @member {Pixel.SpriteSheet#sheet|Pixel.SpriteSheet#generateSheet}
    */

    this.sheet = sheet;

    /**
      * Stores the data
      *
      * @private
      * @member {object}
    */

    this.data = data;

    /**
      * Tilemap array
      *
      * @member {number[][]}
    */

    this.tiles = [];

    /**
      * Tiles excluded from collisions
      * 
      * @private
      * @member {number[]}
    */

    this.exclude;

    /**
      * Tile IDS that can collide
      * 
      * @private
      * @member {number[]}
    */

    this.colliders = [];
  }

  /**
    * Checks if tile should be added to collide list
    *
    * @private
    * @param {number} [id] - ID of tile
    * @param {HTMLCanvasElement} [sprite] - Canvas element (sprite) to be either added or excluded
  */

  _includeCollider(id, sprite) {
    if (this.exclude) {
      let shouldInclude = this.exclude.indexOf(id) > -1 ? false : true;
      if (shouldInclude) this.colliders.push(sprite);
    }
  }

  /**
    * Applies a pre-determined tileset to the tilemap
    *
    * @param {number[][]} [tiles] - Array of tiles
  */

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

  /**
    * Generates a blank tilemap
  */

  generateBlankMap() {
    for (var lay = 0; lay < this.data.height; lay++) {
      for (var col = 0; col < this.data.width; col++) {
        this.tiles.push(false);
      }
    }
  }

  /**
    * Sets collisions by excluding x ids
    *
    * @param {number[]} [ids] - IDs of every tile that cannot collide
  */

  collideByExclusion(ids) {
    this.exclude = ids;
  }

  /**
    * Checks collisions with a sprite
    *
    * @param {Pixel.Sprite} [rect2] - Sprite that tilemap checks to see if it is colliding with
  */

  checkCollisions(rect2) {
    let ret = {body: false, top: false, bottom: false, left: false, right: false};

    for (let i = 0; i < this.colliders.length; i++) {
      let rect1 = this.colliders[i];

      let col = rect1.checkCollisions(rect2);
      ret.body = col.body === true || ret.body === true ? true : false;
      ret.left = col.left === true || ret.left === true ? true : false;
      ret.right = col.right === true || ret.right === true ? true : false;
      ret.bottom = col.bottom === true || ret.bottom === true ? true : false;
      ret.top = col.top === true || ret.top === true ? true : false;
    }
    return ret;
  }

  /**
    * Gives random item in array based on each weight
    *
    * @private
    * @param {number} [max] - The total weight
    * @param {object[]} [array] - Every item
    * @return {object[]}
    * 
    * @example
    *     _match(10, [{id: 10, weight: 5}, {id: 20, weight: 5}]);
  */

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

  /**
    * Randomly places tiles based on weight
    *
    * @param {number} [gx] - Starting tile x
    * @param {number} [gy] - Starting tile y
    * @param {number} [w] - Tile width (amount going across)
    * @param {number} [h] - Tile height (amount going down)
    * @param {object[]} [index] - All indexes + weights of ids to place
  */

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

  /**
    * Places single tile at TileX and TileY
    *
    * @param {number} [id] - ID of tile
    * @param {number} [x] - TileX of tile
    * @param {number} [y] - TileY of tile
  */

  placeTile(id, x, y) {
    let self = this;
    this.tiles[x + y * this.data.height] = new Sprite({image: self.sheet[id], renderable: true});
    this._includeCollider(id, this.tiles[x + y * this.data.height]);
  }

  /**
    * Converts tile to world x
    *
    * @param {number} [x] - TileX
  */

  tileToWorldX(x) {
    return (((this.data.width * this.data.tileWidth) / 2) * -1) + x * this.data.tileWidth;
  }

  /**
    * Converts tile to world y
    *
    * @param {number} [y] - TileY
  */

  tileToWorldY(y) {
    return (((this.data.height * this.data.tileHeight) / 2) * -1) + y * this.data.tileHeight;
  }

  /**
    * Places multiple tiles horizontally + vertically based on array
    *
    * @param {number[]|number[][]} [tilesArray] - Array of tiles to be placed
    * @param {number} [x] - X position of first tile
    * @param {number} [y] - Y position of first tile
    * @param {number} [w] - Width of the tile placement
    * @param {number} [h] - Height of the tile placement
    * 
    * @example
    *   [ [10], [50], [32] ] // Is vertically
    *   [ 10, 50, 32 ] // Is horizontally
  */

  placeTiles(tilesArray, x, y, w, h) {
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

  /**
    * Fills area with 1 tile
    *
    * @param {number} [id] - ID of tile
    * @param {number} [gx] - Start x of fill
    * @param {number} [gy] - Start y of fill
    * @param {number} [w] - Width of fill
    * @param {number} [h] - Height of fill
  */

  fill(id, gx, gy, w, h) {
    for (let y = gy; y < gy + h; y++) {
      for (let x = gx; x < gx + w; x++) {
        this.placeTile(id, x, y);
      }
    }
  }

  /**
    * Renders the tilemap
    *
    * @param {CanvasRenderingContext2d} [ctx] - The Canvas to print to
  */

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

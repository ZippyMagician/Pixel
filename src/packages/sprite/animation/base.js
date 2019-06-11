/*
  * Animation core class
  *
  * @class
  * @memberof Pixel.EXPORTS
*/

export default class AnimationCore {

  /*
    * Create new Animation Core element
    *
    * @constructor
    * @param {Pixel.AnimatedSprite} [parent] - Parent of Animation Core
  */

  constructor(parent) {

    /*
      * Stores parent of this core
      *
      * @private
      * @member {Pixel.AnimatedSprite}
    */

    this.parent = parent;

    /*
      * Current frame this core is on
      *
      * @member {number}
    */

    this.frame = 0;

    /*
      * Stores spritesheet
      *
      * @member {Pixel.Sprite}
    */

    this.cache = [];

    /*
      * All tracks created that can be played
      *
      * @member {object}
    */

    this.tracks = {};

    /*
      * Current track being played
      *
      * @member {boolean|Pixel.Sprite[]}
    */

    this.current = false;

    /*
      * Current name of the track being played
      *
      * @member {string}
    */

    this.track = "";
  }

  /*
    * Stops the current animation and plays 1 item in the cache on continous loop
    *
    * @param {number} [num] - ID of image being played continously
  */

  stop(num) {
    let dummy = new Sprite({
      renderable: true,
      image: this.cache[num - 1].image
    });
    this.current = [dummy];
    this.frame = 0;
  }

  /*
    * Plays an animation saved in the cache
    *
    * @param {string} [name] - Name of track to be played
  */

  play(name) {
    if (this.track !== name) this.frame = 0;
    this.current = this.tracks[name];
    this.track = name;
  }

  /*
    * Add track when cached spritesheet is defined through a json file
    *
    * @param {string} [name] - Name of track
    * @param {string} [prefix] - Name every item in track begins with
    * @param {number} [delay=0] - How many items to skip before they are added
  */

  add(name, prefix, delay = 0) {
    var cur_delay = delay;
    var frames = this.cache;
    var storage = [];

    for (var frame in frames) {
      var fram = frames[frame];

      if (fram.name.startsWith(prefix) && cur_delay === 0) {
        var dummy = new Sprite({ renderable: true, image: fram.image });
        storage.push(dummy);
      } else if (cur_delay > 0) cur_delay--;
    }
    if (storage.length > 0) this.tracks[name] = storage;
  }

  /*
    * Create a new track if there is no json file
    *
    * @param {object} [data] - Data for the creation
    * @param {string} [data.name] - Name of track
    * @param {number[]} [data.positions] - Array of start and end id of animation
  */

  create(data) {
    let name = data.name;
    let start = data.positions[0];
    let end = data.positions[1];
    let frames = this.cache;
    let storage = [];

    for (var i = start - 1; i < end; i++) {
      var dummy = new Sprite({ renderable: true, image: frames[i].image });
      storage.push(dummy);
    }
    this.tracks[name] = storage;
  }

  /*
    * Add multiple animation tracks at once (with json file)
    *
    * @param {object[]} [groups] - Data of every group to be added
    * 
    * @example
    *   data = { name: 'name', filter: 'prefix', offset: 'delay' }
    *   multiAdd([data]) // Adds just one, but you get the idea
  */

  multiAdd(groups) {
    for (var g in groups) {
      let group = groups[g];
      let name = group.name;
      let prefix = group.filter;
      let delay = group.offset;
      this.add(name, prefix, delay);
    }
  }
}

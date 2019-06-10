export class AnimationCore {
  constructor(parent) {
    this.parent = parent;
    this.frame = 0;
    this.cache = [];
    this.tracks = {};
    this.current = false;
    this.track;
  }

  stop(num) {
    let dummy = new Sprite({
      renderable: true,
      image: this.cache[num - 1].image
    });
    this.current = [dummy];
    this.frame = 0;
  }

  play(name) {
    if (this.track !== name) this.frame = 0;
    this.current = this.tracks[name];
    this.track = name;
  }

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

  multiAdd(groups) {
    for (var g in groups) {
      let group = groups[g];
      let name = group.name;
      let prefix = group.filter;
      let delay = group.offset;
      this.add(name, prefix, delay);
    }
  }

  group(name, prefix, delay = 0) {
    return {
      name: name,
      filter: prefix,
      offset: delay
    };
  }
}

import { Stage, Container } from './packages/core';
import { Sprite, AnimatedSprite, SpriteSheet } from './packages/sprite';
import Texture from './packages/texture';
import { Rectangle, Circle, Point } from './packages/shape';
import Text from './packages/text';
import Sound from './packages/sound';
import Graphics from './packages/graphics';
import Map from './packages/map';
import SpriteBase from './packages/sprite/base';
import AnimationCore from './packages/sprite/animation/base';

window.Pixel = {
  App: Stage,
  Sprite: Sprite,
  AnimatedSprite: AnimatedSprite,
  Texture: Texture,
  Rectangle: Rectangle,
  Circle: Circle,
  Text: Text,
  Sound: Sound,
  Point: Point,
  Container: Container,
  Graphics: Graphics,
  SpriteSheet: SpriteSheet,
  Keys: {
    1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6", 7: "7", 8: "8", 9: "9", 0: "0",
    TAB: "Tab", SHIFT: "Shift", COMMA: ",", PERIOD: ".", BACKSLASH: "/", TILDE: "~", EXCLAMATION: "!", ATSIGN: "@", HASHTAG: "#", DOLLARSIGN: "$", PERCENT: "%", DASH: "-", UNDERSCORE: "_", PLUS: "+", QUESTIONMARK: "?",
    A: "a", B: "b", C: "c", D: "d", E: "e", F: "f", G: "g", H: "h", I: "i", J: "j", K: "k", L: "l", M: "m", N: "n", O: "o", P: "p", Q: "q", R: "r", S: "s", T: "t", U: "u", V: "v", W: "w", X: "x", Y: "y", Z: "z",
    UP: "ArrowUp", DOWN: "ArrowDown", LEFT: "ArrowLeft", RIGHT: "ArrowRight",
    down: {
      1: false,2: false,3: false,4: false,5: false,6: false,7: false,8: false,9: false,0: false,
      TAB: false,SHIFT: false,COMMA: false,PERIOD: false,BACKSLASH: false,TILDE: false,EXCLAMATION: false,ATSIGN: false,HASHTAG: false,DOLLARSIGN: false,PERCENT: false,DASH: false,UNDERSCORE: false,PLUS: false,QUESTIONMARK: false,
      A: false,B: false,C: false,D: false,E: false,F: false,G: false,H: false,I: false,J: false,K: false,L: false,M: false,N: false,O: false,P: false,Q: false,R: false,S: false,T: false,U: false,V: false,W: false,X: false,Y: false,Z: false,
      UP: false,DOWN: false,LEFT: false,RIGHT: false
    }
  },
  Map: Map,
  EXPORTS: {
    SpriteBase: SpriteBase,
    AnimationCore: AnimationCore
  }
};

window.requestAnimationFrame =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function(f) {
    return setTimeout(f, 1000 / 60);
  };

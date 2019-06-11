/**
  * Texture class for loading images
  *
  * @class
  * @memberof Pixel
*/

export default class Texture {
  
  /**
    * Create new texture object
    *
    * @constructor
    * @param {string} [src] - Image to be loaded
  */
  
  constructor(src) {
    var self = this;
    
    /**
      * Where the image is stored once loaded
      *
      * @member {HTMLImageElement}
    */
    
    this.image = new Image();
    
    /**
      * Records whether or not the image is renderable
      *
      * @member {boolean}
    */
    
    this.renderable = false;
    
    
    
    this.image.onload = function () {
      self.renderable = true;
    }
    
    
    
    this.image.src = src;
  }
}

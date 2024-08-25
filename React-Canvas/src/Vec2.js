class Vec2 {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
  
    add(vec) {
      return new Vec2(vec.x + this.x, vec.y + this.y);
    }
  
    subtract(vec) {
      return new Vec2(this.x - vec.x, this.y - vec.y);
    }
  
    scale(n) {
      return new Vec2(this.x * n, this.y * n);
    }
  
    dot(vec) {
      return (this.x * vec.x + this.y * vec.y);
    }
  
    cross(vec) {
      return (this.x * vec.y - this.y * vec.x);
    }
  
    rotate(center, angle) {
      const x = this.x - center.x;
      const y = this.y - center.y;
      const rX = x * Math.cos(angle) - y * Math.sin(angle) + center.x;
      const rY = x * Math.sin(angle) + y * Math.cos(angle) + center.y;
      return new Vec2(rX, rY);
    }
  
    normalize() {
      const len = this.length();
      if (len > 0) {
        return new Vec2(this.x / len, this.y / len);
      }
      return new Vec2(0, 0);
    }
  
    distance(vec) {
      const x = this.x - vec.x;
      const y = this.y - vec.y;
      return Math.sqrt(x * x + y * y);
    }
  }
  
  export default Vec2;
  
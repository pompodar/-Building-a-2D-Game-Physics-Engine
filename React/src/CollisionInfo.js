import Vec2 from './Vec2'; // Assuming Vec2 is imported

class CollisionInfo {
  constructor() {
    this.mDepth = 0;
    this.mNormal = new Vec2(0, 0);
    this.mStart = new Vec2(0, 0);
    this.mEnd = new Vec2(0, 0);
  }

  setNormal(s) {
    this.mNormal = s;
  }

  getDepth() {
    return this.mDepth;
  }

  getNormal() {
    return this.mNormal;
  }

  setInfo(d, n, s) {
    this.mDepth = d;
    this.mNormal = n;
    this.mStart = s;
    this.mEnd = s.add(n.scale(d));
  }

  changeDir() {
    this.mNormal = this.mNormal.scale(-1);
    [this.mStart, this.mEnd] = [this.mEnd, this.mStart];
  }
}

export default CollisionInfo;
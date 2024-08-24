import Vec2 from './Vec2';

class RigidShape {
  constructor(center) {
    this.mCenter = center;
    this.mAngle = 0;
    this.mFix = 0;
    this.mFaceNormal = [];
  }

  update(canvasDimensions) {
    if (canvasDimensions && this.mCenter.y < canvasDimensions.height && this.mFix !== 0) {
      //this.move(new Vec2(0, .1));
      //this.rotate(.01);
    }
  }

  move(vec) {
    this.mCenter = this.mCenter.add(vec);
  }

  rotate(angle) {
    this.mAngle += angle;
  }

  boundTest (otherShape) {    
    var vFrom1to2 = otherShape.mCenter.subtract(this.mCenter);
    var rSum = this.mBoundRadius + otherShape.mBoundRadius;
    var dist = vFrom1to2.length();

    if (dist > rSum) {
       return false; //not overlapping
    }
    
    return true;
};
}

export default RigidShape;

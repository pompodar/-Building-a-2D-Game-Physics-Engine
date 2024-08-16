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
      this.rotate(.01);
    }
  }

  move(vec) {
    this.mCenter = this.mCenter.add(vec);
  }

  rotate(angle) {
    this.mAngle += angle;
  }
}

export default RigidShape;

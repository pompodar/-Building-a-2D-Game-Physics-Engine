import Vec2 from './Vec2';

class RigidShape {
  constructor(center, width = 40, height = 40) {    
    this.mCenter = center;
    this.width = width;
    this.height = height;
    this.mAngle = 0;
    this.mFix = 0;
    this.mVertex = [];
    this.mFaceNormal = [];

    // 0--TopLeft; 1--TopRight; 2--BottomRight; 3--BottomLeft
    this.mVertex[0] = new Vec2(center.x - width / 2, center.y - height / 2);
    this.mVertex[1] = new Vec2(center.x + width / 2, center.y - height / 2);
    this.mVertex[2] = new Vec2(center.x + width / 2, center.y + height / 2);
    this.mVertex[3] = new Vec2(center.x - width / 2, center.y + height / 2);

    // 0--Top;1--Right;2--Bottom;3--Left
    // mFaceNormal is normal of face toward outside of rectangle
    // SV - The face normal vectors will be used later for determining collisions.

    this.mFaceNormal[0] = this.mVertex[1].subtract(this.mVertex[2]);
    this.mFaceNormal[0] = this.mFaceNormal[0].normalize();
    this.mFaceNormal[1] = this.mVertex[2].subtract(this.mVertex[3]);
    this.mFaceNormal[1] = this.mFaceNormal[1].normalize();
    this.mFaceNormal[2] = this.mVertex[3].subtract(this.mVertex[0]);
    this.mFaceNormal[2] = this.mFaceNormal[2].normalize();
    this.mFaceNormal[3] = this.mVertex[0].subtract(this.mVertex[1]);
    this.mFaceNormal[3] = this.mFaceNormal[3].normalize();

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

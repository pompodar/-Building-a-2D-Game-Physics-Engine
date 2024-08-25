import Vec2 from './Vec2';

class RigidShape {
  constructor(center, mass, friction, restitution) {    
    this.mCenter = center;
    const width = 40;
    const height = 40;
    this.width = 40;
    this.height = 40;
    this.mAngle = 0;
    this.mFix = 0;

    this.mVelocity = new Vec2(0, 0);
    this.mAcceleration = new Vec2(0, 10); // Gravity had to come in here - SV
    //angle
    this.mAngle = 0;
    //negetive-- clockwise
    //positive-- counterclockwise
    this.mAngularVelocity = 0;
    this.mAngularAcceleration = 0;

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

    this.mCenter = center;
    this.mInertia = 0;
    if (mass !== undefined)
    this.mInvMass = mass;
    else
    this.mInvMass = 1;
    if (friction !== undefined)
    this.mFriction = friction;
    else
    this.mFriction = 0.8;
    if (restitution !== undefined)
    this.mRestitution = restitution;
    else

    this.mRestitution = 0.2;
 this.mVelocity = new Vec2(0, 0);
 if (this.mInvMass !== 0) {
 this.mInvMass = 1 / this.mInvMass;
 this.mAcceleration = new Vec2(0, 10);
 } else {
 this.mAcceleration = new Vec2(0, 0);
 }
 //angle
 this.mAngle = 0;
 //negetive-- clockwise
 //positive-- counterclockwise
 this.mAngularVelocity = 0;
 this.mAngularAcceleration = 0;
 this.mBoundRadius = 0;

 this.updateInertia();
  }

  update(canvasDimensions) {    
    // if (canvasDimensions && this.mCenter.y < canvasDimensions.height && this.mFix !== 0) {
    //   //this.move(new Vec2(0, .1));
    //   //this.rotate(.01);
    // }
    if (false) { // mMovement comes in - SV
      //var dt = gEngine.Core.mUpdateIntervalInSeconds;
      const dt = 200;
      //v += a*t
      this.mVelocity = this.mVelocity.add(this.mAcceleration.scale(dt));
      //s += v*t
      this.move(this.mVelocity.scale(dt));
      this.mAngularVelocity += this.mAngularAcceleration * dt;
      this.rotate(this.mAngularVelocity * dt);
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
updateMass (delta) {
  var mass;
  if (this.mInvMass !== 0)
  mass = 1 / this.mInvMass;
  else
  mass = 0;
  mass += delta;
  if (mass <= 0) {
  this.mInvMass = 0;
  this.mVelocity = new Vec2(0, 0);
  this.mAcceleration = new Vec2(0, 0);
  this.mAngularVelocity = 0;
  this.mAngularAcceleration = 0;
  } else {
  this.mInvMass = 1 / mass;
  this.mAcceleration = new Vec2(0, 10);
  }
  this.updateInertia();
}

updateInertia = function () {
      // Expect this.mInvMass to be already inverted!
 if (this.mInvMass === 0)
  this.mInertia = 0;
  else {
  //inertia=mass*width^2+height^2
  this.mInertia = (1 / this.mInvMass) * (this.mWidth *
 this.mWidth + this.mHeight * this.mHeight) / 12;
  this.mInertia = 1 / this.mInertia;
  }
 };
}

export default RigidShape;

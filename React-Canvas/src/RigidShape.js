import Vec2 from './Vec2';

class RigidShape {
  constructor(center, mass = 1, friction = 0.8, restitution = 0.2) {
    this.mCenter = center;
    const width = 40;
    const height = 40;
    this.width = 40;
    this.height = 40;
    this.mAngle = 0;
    this.mFix = 0;

    this.mVelocity = new Vec2(0, 0);
    this.mAcceleration = new Vec2(0, 10); // Gravity
    this.mAngle = 0; // Angle of rotation
    this.mAngularVelocity = 0;
    this.mAngularAcceleration = 0;

    this.mVertex = [];
    this.mFaceNormal = [];

    // 0--TopLeft; 1--TopRight; 2--BottomRight; 3--BottomLeft
    this.mVertex[0] = new Vec2(center.x - width / 2, center.y - height / 2);
    this.mVertex[1] = new Vec2(center.x + width / 2, center.y - height / 2);
    this.mVertex[2] = new Vec2(center.x + width / 2, center.y + height / 2);
    this.mVertex[3] = new Vec2(center.x - width / 2, center.y + height / 2);

    // 0--Top; 1--Right; 2--Bottom; 3--Left
    // mFaceNormal is the normal of the face towards the outside of the rectangle
    this.mFaceNormal[0] = this.mVertex[1].subtract(this.mVertex[2]).normalize();
    this.mFaceNormal[1] = this.mVertex[2].subtract(this.mVertex[3]).normalize();
    this.mFaceNormal[2] = this.mVertex[3].subtract(this.mVertex[0]).normalize();
    this.mFaceNormal[3] = this.mVertex[0].subtract(this.mVertex[1]).normalize();

    this.mCenter = center;
    this.mInertia = 0;

    this.mInvMass = mass !== undefined ? mass : 1;
    this.mFriction = friction !== undefined ? friction : 0.8;
    this.mRestitution = restitution !== undefined ? restitution : 0.2;

    this.mVelocity = new Vec2(0, 0);
    if (this.mInvMass !== 0) {
      this.mInvMass = 1 / this.mInvMass;
      this.mAcceleration = new Vec2(0, 10);
    } else {
      this.mAcceleration = new Vec2(0, 0);
    }

    this.mAngle = 0;
    this.mAngularVelocity = 0;
    this.mAngularAcceleration = 0;
    this.mBoundRadius = 0;

    this.updateInertia();
  }

  update() {
    if (true) {
      const dt = 200;
      this.mVelocity = this.mVelocity.add(this.mAcceleration.scale(dt));
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

  boundTest(otherShape) {
    const vFrom1to2 = otherShape.mCenter.subtract(this.mCenter);
    const rSum = this.mBoundRadius + otherShape.mBoundRadius;
    const dist = vFrom1to2.length();

    return dist <= rSum;
  }

  updateMass(delta) {
    let mass = this.mInvMass !== 0 ? 1 / this.mInvMass : 0;
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

  updateInertia() {
    if (this.mInvMass === 0) {
      this.mInertia = 0;
    } else {
      this.mInertia = (1 / this.mInvMass) * (this.width ** 2 + this.height ** 2) / 12;
      this.mInertia = 1 / this.mInertia;
    }
  }
}

export default RigidShape;

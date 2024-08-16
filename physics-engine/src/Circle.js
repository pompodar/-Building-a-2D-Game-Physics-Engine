// Circle.js
import RigidShape from './RigidShape';
import Vec2 from './Vec2';

class Circle extends RigidShape {
  constructor(center, radius) {
    super(center);
    this.mType = 'Circle';
    this.mRadius = radius;
  }

  draw(context) {
    context.save();
    context.translate(this.mCenter.x, this.mCenter.y);
    context.rotate(this.mAngle);
    context.beginPath();
    context.arc(0, 0, this.mRadius, 0, 2 * Math.PI);
    context.stroke();
    context.restore();
  }
}

export default Circle;

// Rectangle.js
import RigidShape from './RigidShape';
import Vec2 from './Vec2';

class Rectangle extends RigidShape {
  constructor(center, width, height, fix) {
    super(center);
    this.mType = 'Rectangle';
    this.mWidth = width;
    this.mHeight = height;
    this.mVertex = [];
    this.mFix = fix;

    this.mVertex[0] = new Vec2(center.x - width / 2, center.y - height / 2);
    this.mVertex[1] = new Vec2(center.x + width / 2, center.y - height / 2);
    this.mVertex[2] = new Vec2(center.x + width / 2, center.y + height / 2);
    this.mVertex[3] = new Vec2(center.x - width / 2, center.y + height / 2);
  }

  draw(context) {
    context.save();
    context.translate(this.mCenter.x, this.mCenter.y);
    context.rotate(this.mAngle);
    context.strokeRect(-this.mWidth / 2, -this.mHeight / 2, this.mWidth, this.mHeight);
    context.restore();
  }

  move(v) {
    super.move(v);    
    this.mVertex = this.mVertex.map(vertex => vertex.add(v));
  }

  rotate(angle) {
    super.rotate(angle);
    this.mVertex = this.mVertex.map(vertex => vertex.rotate(this.mCenter, angle));
  }
}

export default Rectangle;

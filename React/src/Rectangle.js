import RigidShape from './RigidShape';
import Vec2 from './Vec2';
import CollisionInfo from './CollisionInfo';

class Rectangle extends RigidShape {
  constructor(center, width, height) {
    super(center);
    this.mType = 'Rectangle';
    this.mWidth = width;
    this.mHeight = height;
    this.mVertex = [];
    this.mBoundRadius = Math.sqrt(width * width + height * height) / 2;

    this.mVertex[0] = new Vec2(center.x - width / 2, center.y - height / 2);
    this.mVertex[1] = new Vec2(center.x + width / 2, center.y - height / 2);
    this.mVertex[2] = new Vec2(center.x + width / 2, center.y + height / 2);
    this.mVertex[3] = new Vec2(center.x - width / 2, center.y + height / 2);

    // Create a div element to represent this rectangle
    this.div = document.createElement('div');
    this.div.style.position = 'absolute';
    this.div.style.width = `${width}px`;
    this.div.style.height = `${height}px`;
    this.div.style.backgroundColor = 'rgba(0, 0, 255, 0.5)'; // Semi-transparent blue
    this.div.style.border = '1px solid black';
    document.body.appendChild(this.div);
  }

  update() {
    // Update the position and rotation of the div
    this.div.style.left = `${this.mCenter.x - this.mWidth / 2}px`;
    this.div.style.top = `${this.mCenter.y - this.mHeight / 2}px`;
    this.div.style.transform = `rotate(${this.mAngle}rad)`;
  }

  move(v) {
    super.move(v);
    this.mVertex = this.mVertex.map((vertex) => vertex.add(v));
    this.update(); // Update div position after moving
  }
  

  rotate(angle) {
    super.rotate(angle);
    this.mVertex = this.mVertex.map((vertex) => vertex.rotate(this.mCenter, angle));
    this.update(); // Update div rotation after rotating
  }

  collisionTest(otherShape, collisionInfo) {
    let status = false;
    if (otherShape.mType === 'Circle') {
      status = this.collidedRectCirc(otherShape, collisionInfo);
    } else {
      status = this.collidedRectRect(this, otherShape, collisionInfo);
    }
    return status;
  }

  findSupportPoint(dir, ptOnEdge) {
    let tmpSupport = {
      mSupportPoint: null,
      mSupportPointDist: -9999999,
    };

    let vToEdge;
    let projection;

    for (let i = 0; i < this.mVertex.length; i++) {
      vToEdge = this.mVertex[i].subtract(ptOnEdge);
      projection = vToEdge.dot(dir);

      if (projection > 0 && projection > tmpSupport.mSupportPointDist) {
        tmpSupport.mSupportPoint = this.mVertex[i];
        tmpSupport.mSupportPointDist = projection;
      }
    }

    return tmpSupport;
  }

  findAxisLeastPenetration(otherRect, collisionInfo) {
    let n;
    let supportPoint = null;
    let bestDistance = Infinity;
    let bestIndex = null;
    let hasSupport = true;
    let i = 0;

    while (hasSupport && i < this.mFaceNormal.length) {
      n = this.mFaceNormal[i];

      const dir = n.scale(-1);
      const ptOnEdge = this.mVertex[i];

      const tmpSupport = otherRect.findSupportPoint(dir, ptOnEdge);
      hasSupport = tmpSupport && tmpSupport.mSupportPoint !== null;

      if (hasSupport && tmpSupport.mSupportPointDist < bestDistance) {
        bestDistance = tmpSupport.mSupportPointDist;
        bestIndex = i;
        supportPoint = tmpSupport.mSupportPoint;
      }
      i++;
    }

    if (hasSupport && bestIndex !== null && supportPoint !== null) {
      const bestVec = this.mFaceNormal[bestIndex].scale(bestDistance);
      collisionInfo.setInfo(bestDistance, this.mFaceNormal[bestIndex], supportPoint.add(bestVec));
    }

    return hasSupport;
  }

  collidedRectRect(r1, r2, collisionInfo) {
    let status1 = false;
    let status2 = false;
    const collisionInfoR1 = new CollisionInfo();
    const collisionInfoR2 = new CollisionInfo();

    status1 = r1.findAxisLeastPenetration(r2, collisionInfoR1);
    if (status1) {
      status2 = r2.findAxisLeastPenetration(r1, collisionInfoR2);
      if (status2) {
        if (collisionInfoR1.getDepth() < collisionInfoR2.getDepth()) {
          const depthVec = collisionInfoR1.getNormal().scale(collisionInfoR1.getDepth());
          collisionInfo.setInfo(
            collisionInfoR1.getDepth(),
            collisionInfoR1.getNormal(),
            collisionInfoR1.mStart.subtract(depthVec)
          );
        } else {
          collisionInfo.setInfo(
            collisionInfoR2.getDepth(),
            collisionInfoR2.getNormal().scale(-1),
            collisionInfoR2.mStart
          );
        }
      }
    }
    return status1 && status2;
  }

  collidedRectCirc(otherCir, collisionInfo) {
    let circ2Pos,
      v,
      projection,
      bestDistance,
      nearestEdge,
      inside;

    for (let i = 0; i < 4; ++i) {
      circ2Pos = otherCir.mCenter;
      v = circ2Pos.subtract(this.mVertex[i]);
      projection = v.dot(this.mFaceNormal[i]);

      if (projection > 0) {
        bestDistance = projection;
        nearestEdge = i;
        inside = false;
        break;
      }

      if (projection > bestDistance) {
        bestDistance = projection;
        nearestEdge = i;
      }
    }

    if (!inside) {
      let v1 = circ2Pos.subtract(this.mVertex[nearestEdge]);
      let v2 = this.mVertex[(nearestEdge + 1) % 4].subtract(this.mVertex[nearestEdge]);
      let dot = v1.dot(v2);

      if (dot < 0) {
        const dis = v1.length();
        if (dis > otherCir.mRadius) return false;

        const normal = v1.normalize();
        const radiusVec = normal.scale(-otherCir.mRadius);
        collisionInfo.setInfo(otherCir.mRadius - dis, normal, circ2Pos.add(radiusVec));
      } else {
        v1 = circ2Pos.subtract(this.mVertex[(nearestEdge + 1) % 4]);
        v2 = v2.scale(-1);
        dot = v1.dot(v2);

        if (dot < 0) {
          const dis = v1.length();
          if (dis > otherCir.mRadius) return false;

          const normal = v1.normalize();
          const radiusVec = normal.scale(-otherCir.mRadius);
          collisionInfo.setInfo(otherCir.mRadius - dis, normal, circ2Pos.add(radiusVec));
        } else {
          if (bestDistance < otherCir.mRadius) {
            const radiusVec = this.mFaceNormal[nearestEdge].scale(otherCir.mRadius);
            collisionInfo.setInfo(otherCir.mRadius - bestDistance, this.mFaceNormal[nearestEdge], circ2Pos.subtract(radiusVec));
          } else {
            return false;
          }
        }
      }
    } else {
      const radiusVec = this.mFaceNormal[nearestEdge].scale(otherCir.mRadius);
      collisionInfo.setInfo(otherCir.mRadius - bestDistance, this.mFaceNormal[nearestEdge], circ2Pos.subtract(radiusVec));
    }

    return true;
  }
}

export default Rectangle;

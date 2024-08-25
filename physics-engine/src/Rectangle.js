// Rectangle.js
import RigidShape from './RigidShape';
import Vec2 from './Vec2';
import CollisionInfo from './CollisionInfo';

class Rectangle extends RigidShape {
  constructor(center, width, height, fix) {
    super(center);
    this.mType = 'Rectangle';
    this.mWidth = width;
    this.mHeight = height;
    this.mVertex = [];
    this.mBoundRadius = Math.sqrt(width*width + height*height)/2;

    //this.mFix = fix;

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

  collisionTest (otherShape, collisionInfo) {    
    var status = false;
    if (otherShape.mType === "Circle") {
    status = this.collidedRectCirc(otherShape, collisionInfo);
    } else {
    status = this.collidedRectRect(this, otherShape, collisionInfo);
    }
    return status;
   };
   
   findSupportPoint (dir, ptOnEdge) {
       // Об'єкт для збереження результатів
       var tmpSupport = {
           mSupportPoint: null,
           mSupportPointDist: -9999999
       };
   
       var vToEdge;
       var projection;
   
       // Перевірка кожної вершини іншого об'єкта
       for (var i = 0; i < this.mVertex.length; i++) {
           vToEdge = this.mVertex[i].subtract(ptOnEdge);
           projection = vToEdge.dot(dir);
   
           // Знаходження найдовшої дистанції з певним ребром
           // Напрямок -n, тому дистанція повинна бути додатною
           if ((projection > 0) && (projection > tmpSupport.mSupportPointDist)) {
               tmpSupport.mSupportPoint = this.mVertex[i];
               tmpSupport.mSupportPointDist = projection;
           }
       }
   
       return tmpSupport; // Повернення результату для подальшого використання
   };
   
   
   findAxisLeastPenetration (otherRect, collisionInfo) {
       var n;
       var supportPoint = null;
       var bestDistance = Infinity;
       var bestIndex = null;
       var hasSupport = true;
       var i = 0;              
   
       // Loop through all face normals
       while (hasSupport && i < this.mFaceNormal.length) {
           // Retrieve the face normal from this rectangle
           n = this.mFaceNormal[i];
   
           // Calculate the opposite direction and a point on the edge
           var dir = n.scale(-1);
           var ptOnEdge = this.mVertex[i];
   
           // Find the support point on the other rectangle
           var tmpSupport = otherRect.findSupportPoint(dir, ptOnEdge);
           hasSupport = (tmpSupport && tmpSupport.mSupportPoint !== null);
   
           // Check if the support point has the shortest distance
           if (hasSupport && tmpSupport.mSupportPointDist < bestDistance) {
               bestDistance = tmpSupport.mSupportPointDist;
               bestIndex = i;
               supportPoint = tmpSupport.mSupportPoint;
           }
           i++;
       }
   
       // If support points exist for all directions, set the collision information
       if (hasSupport && bestIndex !== null && supportPoint !== null) {
           var bestVec = this.mFaceNormal[bestIndex].scale(bestDistance);
           collisionInfo.setInfo(bestDistance, this.mFaceNormal[bestIndex], supportPoint.add(bestVec));
       }
   
       return hasSupport;
   };
   
   collidedRectRect (r1, r2, collisionInfo) {
       var status1 = false;
       var status2 = false;
       var collisionInfoR1 = new CollisionInfo();
       var collisionInfoR2 = new CollisionInfo();
   
       // Find Axis of Least Penetration for both rectangles
       status1 = r1.findAxisLeastPenetration(r2, collisionInfoR1);
       if (status1) {
           status2 = r2.findAxisLeastPenetration(r1, collisionInfoR2);
           if (status2) {
               // Choose the shorter normal as the normal
               if (collisionInfoR1.getDepth() < collisionInfoR2.getDepth()) {
                   var depthVec = collisionInfoR1.getNormal().scale(collisionInfoR1.getDepth());
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
   };

   collidedRectCirc (otherCir, collisionInfo) {
    let circ2Pos, v, projection, bestDistance, nearestEdge, inside;

     // Step A: Compute the nearest edge
     for (let i = 0; i < 4; ++i) {
       // Find the nearest face for the center of the circle
       circ2Pos = otherCir.mCenter;
       v = circ2Pos.subtract(this.mVertex[i]);
       projection = v.dot(this.mFaceNormal[i]);
       
       if (projection > 0) {
         // If the center of the circle is outside the rectangle
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
   
     if (!inside) { // The center of the circle is outside the rectangle
       // Step B1: If the center is in Region R1
       var v1 = circ2Pos.subtract(this.mVertex[nearestEdge]);
       var v2 = this.mVertex[(nearestEdge + 1) % 4].subtract(this.mVertex[nearestEdge]);
       var dot = v1.dot(v2);
   
       if (dot < 0) { // Region R1
         var dis = v1.length();
         if (dis > otherCir.mRadius) return false;
   
         var normal = v1.normalize();
         var radiusVec = normal.scale(-otherCir.mRadius);
         collisionInfo.setInfo(otherCir.mRadius - dis, normal, circ2Pos.add(radiusVec));
   
       } else { 
         // Step B2: If the center is in Region B2
         var v1 = circ2Pos.subtract(this.mVertex[(nearestEdge + 1) % 4]);
         var v2 = v2.scale(-1);
         var dot = v1.dot(v2);
   
         if (dot < 0) { // Region R2
           var dis = v1.length();
           if (dis > otherCir.mRadius) return false;
   
           var normal = v1.normalize();
           var radiusVec = normal.scale(-otherCir.mRadius);
           collisionInfo.setInfo(otherCir.mRadius - dis, normal, circ2Pos.add(radiusVec));
   
         } else { 
           // Step B3: If the center is in Region B3
           if (bestDistance < otherCir.mRadius) {
             var radiusVec = this.mFaceNormal[nearestEdge].scale(otherCir.mRadius);
             collisionInfo.setInfo(otherCir.mRadius - bestDistance, this.mFaceNormal[nearestEdge], circ2Pos.subtract(radiusVec));
           } else {
             return false;
           }
         }
       }
     } else { 
       // Step C: If the center is inside the rectangle
       var radiusVec = this.mFaceNormal[nearestEdge].scale(otherCir.mRadius);
       collisionInfo.setInfo(otherCir.mRadius - bestDistance, this.mFaceNormal[nearestEdge], circ2Pos.subtract(radiusVec));
     }
   
     return true;
   };
   
}

export default Rectangle;

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Vec2 from './Vec2';
import Rectangle from './Rectangle';
import Circle from './Circle';
import CollisionInfo from './CollisionInfo';

const App = () => {
  let mGravity = new Vec2(0, 10);
  let mMovement = true;

  var mPositionalCorrectionFlag = true;
 // number of relaxation iteration
 var mRelaxationCount = 15;
 // percentage of separation to project objects
 var mPosCorrectionRate = 0.8;

  const canvasRef = useRef(null);
  const allObjectsRef = useRef([]);
  const gObjectNumRef = useRef(0);
  const [mainContext, setMaincontext] = useState();

  const updateGameObjects = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    context.clearRect(0, 0, width, height);

    setMaincontext(context);

    allObjectsRef.current.forEach(obj => {
      obj.update(canvas);
      obj.draw(context);
    });

    var collisionInfo = new CollisionInfo();

    // Функція для малювання інформації про зіткнення
    var drawCollisionInfo = function (collisionInfo, context) {        
      context.beginPath();
      context.moveTo(collisionInfo.mStart.x, collisionInfo.mStart.y);
      context.lineTo(collisionInfo.mEnd.x, collisionInfo.mEnd.y);
      context.closePath();
      context.strokeStyle = "green";
      context.stroke();
    };

    var positionalCorrection = function (s1, s2, collisionInfo) {
      var s1InvMass = s1.mInvMass;
      var s2InvMass = s2.mInvMass;
      var num = collisionInfo.getDepth() /
     (s1InvMass + s2InvMass) * mPosCorrectionRate;
      var correctionAmount = collisionInfo.getNormal().scale(num);
      s1.move(correctionAmount.scale(-s1InvMass));
      s2.move(correctionAmount.scale(s2InvMass));
     };

     var resolveCollision = function (s1, s2, collisionInfo) {
      if ((s1.mInvMass === 0) && (s2.mInvMass === 0))
        return;
        // correct positions
        if (mPositionalCorrectionFlag)
        positionalCorrection(s1, s2, collisionInfo);
        var n = collisionInfo.getNormal();
        var v1 = s1.mVelocity;
        var v2 = s2.mVelocity;
        var relativeVelocity = v2.subtract(v1);
        // Relative velocity in normal direction
        var rVelocityInNormal = relativeVelocity.dot(n);
        // if objects moving apart ignore
        if (rVelocityInNormal > 0)
        return;
        // compute and apply response impulses for each object
        var newRestituion = Math.min(s1.mRestitution, s2.mRestitution);
        var newFriction = Math.min(s1.mFriction, s2.mFriction);
        // Calc impulse scalar
        var jN = -(1 + newRestituion) * rVelocityInNormal;
        jN = jN / (s1.mInvMass + s2.mInvMass);
        //impulse is in direction of normal ( from s1 to s2)
        var impulse = n.scale(jN);
        // impulse = F dt = m * v
        // v = impulse / m
        s1.mVelocity = s1.mVelocity.subtract(impulse.scale(s1.mInvMass));
        s2.mVelocity = s2.mVelocity.add(impulse.scale(s2.mInvMass));
        var tangent = relativeVelocity.subtract(n.scale(relativeVelocity.dot(n)));
            // relativeVelocity.dot(tangent) should less than 0
        tangent = tangent.normalize().scale(-1);
        var jT = -(1 + newRestituion) *
        relativeVelocity.dot(tangent) * newFriction;
        jT = jT / (s1.mInvMass + s2.mInvMass);
        // friction should be less than force in normal direction
        if (jT > jN) jT = jN;
        //impulse is from s1 to s2 (in opposite direction of velocity)
        impulse = tangent.scale(jT);
        s1.mVelocity = s1.mVelocity.subtract(impulse.scale(s1.mInvMass));
        s2.mVelocity = s2.mVelocity.add(impulse.scale(s2.mInvMass));
     };

    for (let k = 0; k < mRelaxationCount; k++) {
    for (let i = 0; i < allObjectsRef.current.length; i++) {
      for (let j = i + 1; j < allObjectsRef.current.length; j++) {
        // if (allObjectsRef.current[i].boundTest(allObjectsRef.current[j])) {  
                  
        //   context.strokeStyle = 'green';
        //   allObjectsRef.current[i].draw(context);
        //   allObjectsRef.current[j].draw(context);
        // } else {
        //   context.strokeStyle = 'blue';
        // }

        if (allObjectsRef.current[i].boundTest(allObjectsRef.current[j])) {  
          if (allObjectsRef.current[i].collisionTest(allObjectsRef.current[j], collisionInfo)) {               
            // Перевірка та зміна напряму нормалі
            if (collisionInfo.getNormal().dot(allObjectsRef.current[j].mCenter.subtract(allObjectsRef.current[i].mCenter)) < 0) {
                collisionInfo.changeDir();

            }

            
            
            // Малювання інформації про зіткнення
            drawCollisionInfo(collisionInfo, context);

            resolveCollision(allObjectsRef.current[i],
              allObjectsRef.current[j],
              collisionInfo);
          }
        }
      }
      }

      
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 450;

    // Initial objects setup
    let r1 = new Rectangle(new Vec2(200, 200), 40, 40, false);
    allObjectsRef.current = [r1];

    const runGameLoop = () => {
      updateGameObjects();
      requestAnimationFrame(runGameLoop);
    };

    runGameLoop();

    // Add new rectangles at random positions every 5 seconds
    const intervalId = setInterval(() => {
      const canvas = canvasRef.current;
      const width = canvas.width;
      const height = canvas.height;

      const randomX = Math.random() * width;
      const randomY = Math.random() * height;

      //let r1 = new Rectangle(new Vec2(randomX, randomY), 40, 40, false);
      //allObjectsRef.current = [...allObjectsRef.current, r1];
    }, 500);

    return () => {
      clearInterval(intervalId);  // Clean up the interval on component unmount
    };
  }, []);

  const handleKeyDown = useCallback((event) => {
    const keycode = event.keyCode || event.which;
    const allObjects = allObjectsRef.current;
    const gObjectNum = gObjectNumRef.current;

    if (keycode === 70) { // F
      let r1 = new Rectangle(
        new Vec2(allObjects[gObjectNum].mCenter.x + 200, allObjects[gObjectNum].mCenter.y + 20),
        Math.random() * 30 + 10,
        Math.random() * 30 + 10
      );
      var r5 = new Rectangle(new Vec2(500, 200), 400, 20, 0, 0.3, 0);
    r5.rotate(2.8);
    var r6 = new Rectangle(new Vec2(200, 400), 400, 20, 20, 1, 0.5);
      allObjectsRef.current = [...allObjects, r1, r5, r6];
    }

    if (keycode === 71) { // G
      let r1 = new Circle(
        new Vec2(allObjects[gObjectNum].mCenter.x, allObjects[gObjectNum].mCenter.y),
        Math.random() * 10 + 20
      );
      allObjectsRef.current = [...allObjects, r1];
    }

    if (keycode >= 48 && keycode <= 57) { // Number keys
      const index = keycode - 48;
      if (index < allObjects.length) {
        gObjectNumRef.current = index;
      }
    }

    if (keycode === 38) { // Up arrow
      if (gObjectNumRef.current > 0) {
        gObjectNumRef.current--;
      }
    }

    if (keycode === 40) { // Down arrow
      if (gObjectNumRef.current < allObjects.length - 1) {
        gObjectNumRef.current++;
      }
    }

    // Move with WASD keys
    if (keycode === 87) { // W
      allObjects[gObjectNum].move(new Vec2(0, -10));
    }

    if (keycode === 83) { // S
      allObjects[gObjectNum].move(new Vec2(0, 10));
    }

    if (keycode === 65) { // A
      allObjects[gObjectNum].move(new Vec2(-10, 0));
    }

    if (keycode === 68) { // D
      allObjects[gObjectNum].move(new Vec2(10, 0));
    }

    // Rotate with QE keys
    if (keycode === 81) { // Q
      allObjects[gObjectNum].rotate(-0.1);
    }

    if (keycode === 69) { // E
      allObjects[gObjectNum].rotate(0.1);
    }

    // Toggle gravity with the H key
    if (keycode === 72) { // H
      const currentObj = allObjects[gObjectNum];
      currentObj.mFix = currentObj.mFix === 0 ? 1 : 0;
    }

    // Reset with the R key
    if (keycode === 82) { // R
      allObjectsRef.current.splice(1, allObjects.length - 1); // Keep only the first object
      gObjectNumRef.current = 0;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div>
      <canvas ref={canvasRef} style={{ border: '1px solid black' }}></canvas>
    </div>
  );
};

export default App;

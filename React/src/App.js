import React, { useEffect, useRef } from 'react';
import Vec2 from './Vec2';
import Rectangle from './Rectangle';
import CollisionInfo from './CollisionInfo';
import KeyHandler from './KeyHandler';

const App = () => {
  const containerRef = useRef(null); // Use this ref for appending div elements
  const allObjectsRef = useRef([]);
  const gObjectNumRef = useRef(0);

  const positionalCorrectionFlag = true;
  const relaxationCount = 15;
  const mPosCorrectionRate = 0.8;

  const updateGameObjects = () => {
    allObjectsRef.current.forEach((obj) => {

      if (obj.mass !== 1000) {
        obj.move(new Vec2(0, 0.2)); //gravitation
      }  
        
      obj.update(); // Update the position and style of div elements

    });

    const collisionInfo = new CollisionInfo();

    const drawCollisionInfo = (collisionInfo) => {
      // Handle collision visualization if needed
    };

    const positionalCorrection = (s1, s2, collisionInfo) => {
      const s1InvMass = s1.mInvMass;
      const s2InvMass = s2.mInvMass;
      const num =
        (collisionInfo.getDepth() / (s1InvMass + s2InvMass)) *
        mPosCorrectionRate;
      const correctionAmount = collisionInfo.getNormal().scale(num);
      s1.move(correctionAmount.scale(-s1InvMass));
      s2.move(correctionAmount.scale(s2InvMass));
    };

    const resolveCollision = (s1, s2, collisionInfo) => {
      if (s1.mInvMass === 0 || s2.mInvMass === 0) return; // check if either of two objects don't have mass

      console.log(s1.mInvMass, s2.mInvMass);
      
      if (positionalCorrectionFlag) positionalCorrection(s1, s2, collisionInfo);
      
      const n = collisionInfo.getNormal();
      const v1 = s1.mVelocity;
      const v2 = s2.mVelocity;
      const relativeVelocity = v2.subtract(v1);
      const rVelocityInNormal = relativeVelocity.dot(n);

      if (rVelocityInNormal > 0) return;

      const newRestitution = Math.min(s1.mRestitution, s2.mRestitution);
      const newFriction = Math.min(s1.mFriction, s2.mFriction);

      let jN = -(1 + newRestitution) * rVelocityInNormal;
      jN = jN / (s1.mInvMass + s2.mInvMass);

      let impulse = n.scale(jN);

      s1.mVelocity = s1.mVelocity.subtract(impulse.scale(s1.mInvMass));
      s2.mVelocity = s2.mVelocity.add(impulse.scale(s2.mInvMass));

      let tangent = relativeVelocity.subtract(
        n.scale(relativeVelocity.dot(n))
      );

      tangent = tangent.normalize().scale(-1);
      let jT =
        -(1 + newRestitution) * relativeVelocity.dot(tangent) * newFriction;
      jT = jT / (s1.mInvMass + s2.mInvMass);

      if (jT > jN) jT = jN;

      impulse = tangent.scale(jT);
      s1.mVelocity = s1.mVelocity.subtract(impulse.scale(s1.mInvMass));
      s2.mVelocity = s2.mVelocity.add(impulse.scale(s2.mInvMass));
    };

    for (let k = 0; k < relaxationCount; k++) {
      for (let i = 0; i < allObjectsRef.current.length; i++) {
        for (let j = i + 1; j < allObjectsRef.current.length; j++) {
          if (
            allObjectsRef.current[i].boundTest(allObjectsRef.current[j])
          ) {
            if (
              allObjectsRef.current[i].collisionTest(
                allObjectsRef.current[j],
                collisionInfo
              )
            ) {
              if (
                collisionInfo
                  .getNormal()
                  .dot(
                    allObjectsRef.current[j].mCenter.subtract(
                      allObjectsRef.current[i].mCenter
                    )
                  ) < 0
              ) {
                collisionInfo.changeDir();
              }

              drawCollisionInfo(collisionInfo);
              resolveCollision(
                allObjectsRef.current[i],
                allObjectsRef.current[j],
                collisionInfo
              );
            }
          }
        }
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    container.style.position = 'relative'; // Make sure container is positioned relatively

    let r1 = new Rectangle(new Vec2(200, 200), 40, 40, 1, 1, 1, 1);
    allObjectsRef.current = [r1];

    const runGameLoop = () => {
      updateGameObjects();
      requestAnimationFrame(runGameLoop);
    };

    runGameLoop();

    const intervalId = setInterval(() => {
      const width = container.clientWidth;
      const height = container.clientHeight;

      const randomX = Math.random() * width;
      const randomY = Math.random() * height;

      //let r1 = new Rectangle(new Vec2(randomX, randomY), 40, 40);
      //allObjectsRef.current = [...allObjectsRef.current, r1];
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100vh', border: '1px solid black' }}>
      <KeyHandler allObjectsRef={allObjectsRef} gObjectNumRef={gObjectNumRef} />
    </div>
  );
};

export default App;

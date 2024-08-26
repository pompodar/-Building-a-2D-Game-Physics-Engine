import { useEffect, useCallback } from 'react';
import Vec2 from './Vec2';
import Rectangle from './Rectangle';
import Circle from './Circle';

const KeyHandler = ({ allObjectsRef, gObjectNumRef }) => {
  const GRAVITY = new Vec2(0, 10);

  const handleKeyDown = useCallback(
    (event) => {
      const keycode = event.keyCode || event.which;
      const allObjects = allObjectsRef.current;
      const gObjectNum = gObjectNumRef.current;

      if (keycode === 70) { // F
        const r1 = new Rectangle(
          new Vec2(allObjects[gObjectNum].mCenter.x + 200, allObjects[gObjectNum].mCenter.y + 20),
          Math.random() * 30 + 10,
          Math.random() * 30 + 10, 1000, 100, 1, 1
        );

        const r5 = new Rectangle(new Vec2(500, 200), 400, 20, 100, 1, 1);
        r5.rotate(2.8);

        const r6 = new Rectangle(new Vec2(200, 400), 490, 20, 1000, 1, 1, 0);
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
        allObjects[gObjectNum].move(GRAVITY);
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
    },
    [allObjectsRef, gObjectNumRef]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return null;
};

export default KeyHandler;

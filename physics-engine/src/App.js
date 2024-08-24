import React, { useState, useEffect, useRef, useCallback } from 'react';
import Vec2 from './Vec2';
import Rectangle from './Rectangle';
import Circle from './Circle';

const App = () => {
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

    for (let i = 0; i < allObjectsRef.current.length; i++) {
      for (let j = i + 1; j < allObjectsRef.current.length; j++) {
        if (allObjectsRef.current[i].boundTest(allObjectsRef.current[j])) {          
          context.strokeStyle = 'green';
          allObjectsRef.current[i].draw(context);
          allObjectsRef.current[j].draw(context);
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
    // const intervalId = setInterval(() => {
    //   const canvas = canvasRef.current;
    //   const width = canvas.width;
    //   const height = canvas.height;

    //   const randomX = Math.random() * width;
    //   const randomY = Math.random() * height;

    //   let r1 = new Rectangle(new Vec2(randomX, randomY), 40, 40, false);
    //   allObjectsRef.current = [...allObjectsRef.current, r1];
    // }, 5000);

    // return () => {
    //   clearInterval(intervalId);  // Clean up the interval on component unmount
    // };
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
      allObjectsRef.current = [...allObjects, r1];
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

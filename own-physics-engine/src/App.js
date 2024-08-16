import React, { useEffect, useState } from 'react';

const RandomDivs = () => {
  const [divs, setDivs] = useState([]);

  useEffect(() => {
    const createDivs = () => {
      const newDivs = Array.from({ length: 3 }).map(() => ({
        id: Date.now() + Math.random(),  // Unique ID for each div
        left: `${Math.random() * 100}%`,
        top: `-${Math.random() * 100 + 50}px`,  // Random start above the screen with extra space
        opacity: Math.random().toFixed(1),
      }));

      setDivs((prevDivs) => [...prevDivs, ...newDivs]);
    };

    createDivs();  // Create initial divs

    const interval = setInterval(createDivs, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleAnimationEnd = (event) => {
    const element = event.target;

    // Get the computed transform style to keep the current rotation state
    const computedStyle = window.getComputedStyle(element);
    const transformValue = computedStyle.getPropertyValue('transform');

    // Remove all animations and set the final position and rotation
    element.style.animation = 'none';
    element.style.transform = transformValue; // Apply the final rotation
    element.style.top = 'calc(100vh - 50px)'; // Set the position at the bottom
  };

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      {divs.map((div, index) => {
        const animationName = `fall-${index}`;
        const style = `
          @keyframes ${animationName} {
            from {
              top: ${div.top}; /* Dynamic start position */
            }
            to {
              top: calc(100vh - 50px); /* Stop 50px above the bottom of the viewport */
            }
          }
        `;
        return (
          <div
            key={div.id}
            className="leaf"
            style={{
              position: 'absolute',
              left: div.left,
              top: div.top,
              width: '50px',
              height: '50px',
              boxShadow: '10px 10px 5px 0px rgba(0,0,0,0.75)',
              backgroundColor: 'red',
              opacity: div.opacity,
              animation: `rotate 8s linear infinite, ${animationName} 9s linear forwards`,
              zIndex: 1,
            }}
            onAnimationEnd={handleAnimationEnd}
          >
            <style>{style}</style>
          </div>
        );
      })}
      <style>{`
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        div:after {
          content: "";
          width: 14px;
          height: 6px;
          background: brown;
          position: absolute;
          bottom: 50px;
          right: -10px;
          transform: rotate(-45deg);
          z-index: -1;
          box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
        }
      `}</style>
    </div>
  );
};

export default RandomDivs;

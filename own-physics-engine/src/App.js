import React, { useEffect, useState } from 'react';

const RandomDivs = () => {
  // Array with manual positions for trees
  const treePositions = [
    { left: '0', top: '10%' },
    { left: '20%', top: '30%' },
    { left: '36%', top: '50%' },
    { left: '40%', top: '70%' },
    { left: '50%', top: '20%' },
    { left: '66%', top: '40%' },
    { left: '70%', top: '60%' },
    { left: '82%', top: '80%' },
    { left: '90%', top: '50%' },
    { left: '15%', top: '85%' },
  ];

  const [trees, setTrees] = useState([]);
  const [divs, setDivs] = useState([]);

  useEffect(() => {
    const generateTrees = () => {
      const newTrees = treePositions.map((position, index) => ({
        id: index,
        left: position.left,
        top: position.top,
        opacity: Math.random().toFixed(1),
      }));

      setTrees(newTrees);
    };

    generateTrees();

    const newDivs = Array.from({ length: 30 }).map(() => ({
      id: Date.now() + Math.random(),
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100 + 50}px`,
      opacity: Math.random().toFixed(1),
      animationLength: 1,
      widthAndHeight: Math.random().toFixed(1) * 30,
      zIndex: Math.random().toFixed(1) * 10,
    }));

    setDivs((prevDivs) => [...prevDivs, ...newDivs]);

    const createDivs = () => {
      const newDivs = Array.from({ length: 3 }).map(() => ({
        id: Date.now() + Math.random(),
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100 + 20}px`,
        opacity: Math.random().toFixed(1),
        animationLength: '9s',
        widthAndHeight: Math.random().toFixed(1) * 30,
        zIndex: Math.random().toFixed(1) * 10,
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
    element.style.top = `calc(100vh - 20px - ${Math.random() * 30}px)`; // Set the position at the bottom with random offset
  };

  return (
    <div style={{ overflow: 'hidden', position: 'relative', width: '100vw', height: '100vh', background: 'linear-gradient(45deg, #40BDFF, #63FFA4, #FFE150)' }}>
      {trees.map((tree) => (
        <div
          key={tree.id}
          className="tree w-24 h-full"
          style={{
            position: 'absolute',
            left: tree.left,
            top: 0,
            opacity: tree.opacity,
          }}
        >
          <div
            className="trunk h-full"
            style={{
              position: 'relative',
              backgroundColor: 'brown',
              boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.75)',
            }}
          >
            <div 
            style={{
              position: 'relative',
              backgroundColor: 'brown',
              boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.75)',
              rotate: '45deg',
            }}

            className="branch absolute w-6 h-96 right-[-156%] top-[-10%] z-[-1]" />
          </div>
        </div>
      ))}
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
          <div className="h-full overflow-hidden">
              <div
                key={div.id}
                className="leaf"
                style={{
                  position: 'absolute',
                  left: div.left,
                  top: div.top,
                  width: (div.widthAndHeight + 40) + 'px',
                  height: (div.widthAndHeight + 40) + 'px',
                  boxShadow: '10px 10px 5px 0px rgba(0,0,0,0.75)',
                  backgroundColor: 'red',
                  opacity: div.opacity,
                  animation: `rotate 8s linear infinite, ${animationName} ${div.animationLength} linear forwards`,
                  zIndex: div.zIndex,
                }}
                onAnimationEnd={handleAnimationEnd}
              >
                <style>{style}</style>
              </div>
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

        .leaf:after {
          content: "";
          width: 14px;
          height: 6px;
          background: brown;
          position: absolute;
          bottom: -20%;
          right: -30%;
          transform: rotate(45deg);
          z-index: -1;
          box-shadow: 10px 0 5px 0px rgba(0, 0, 0, 0.75);
        }
      `}</style>
    </div>
  );
};

export default RandomDivs;

import React, { useEffect, useState } from 'react';

const App = () => {
  const treePositions = [
    { left: '0' },
    { left: '20%' },
    { left: '36%' },
    { left: '40%' },
    { left: '50%' },
    { left: '66%' },
    { left: '70%' },
    { left: '82%' },
    { left: '90%' },
    { left: '15%' },
  ];

  const [trees, setTrees] = useState([]);
  const [leaves, setLeaves] = useState([]);

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

    const newLeaves = Array.from({ length: 30 }).map(() => ({
      id: Date.now() + Math.random(),
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100 + 50}px`,
      opacity: Math.random().toFixed(1),
      animationLength: 1,
      widthAndHeight: Math.random().toFixed(1) * 30,
      zIndex: Math.random().toFixed(1) * 10,
    }));

    setLeaves((prevLeaves) => [...prevLeaves, ...newLeaves]);

    const createLeaves = () => {
      const newLeaves = Array.from({ length: 3 }).map(() => ({
        id: Date.now() + Math.random(),
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100 + 20}px`,
        opacity: Math.random().toFixed(1),
        animationLength: '9s',
        widthAndHeight: Math.random().toFixed(1) * 30,
        zIndex: Math.random().toFixed(1) * 10,
      }));

      setLeaves((prevLeaves) => [...prevLeaves, ...newLeaves]);
    };

    createLeaves();

    const interval = setInterval(createLeaves, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleAnimationEnd = (event) => {
    const element = event.target;

    const computedStyle = window.getComputedStyle(element);
    const transformValue = computedStyle.getPropertyValue('transform');

    element.style.animation = 'none';
    element.style.transform = transformValue; 
    element.style.top = `calc(100vh - ${Math.random() * 30}px)`;
  };

  return (
    <div 
    className="overflow-hidden relative w-screen h-screen"
    style={{ background: 'linear-gradient(45deg, #40BDFF, #63FFA4, #FFE150)' }}>
      {trees.map((tree) => (
        <div
          key={tree.id}
          className="tree absolute top-0 w-24 h-full"
          style={{
            left: tree.left,
            opacity: tree.opacity,
          }}
        >
          <div
            className="top absolute rounded-lg z-10"
            style={{
              top: '-5%',
              bottom: '70%',
              width: '320%',
              backgroundColor: 'brown',
              boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.75)',
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              left: '-110%',
              animation: `wind 4s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,   
              transformOrigin: 'center bottom',
            }}
          ></div>
          <div
            className="trunk relative h-full"
            style={{
              backgroundColor: 'brown',
              boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.75)',
            }}
          >
            <div 
            style={{
              backgroundColor: 'brown',
              boxShadow: '5px 5px 5px rgba(0, 0, 0, 0.75)',
              rotate: '45deg',
              right: '-136%',
              top: '20%',
              zIndex: -1,
            }}

            className="branch relative w-6 h-36" />
          </div>
        </div>
      ))}
      {leaves.map((leaf, index) => {
        const animationName = `fall-${index}`;
        const style = `
          @keyframes ${animationName} {
            from {
              top: ${leaf.top}; 
            }
            to {
              top: calc(100vh - 50px); 
            }
          }
        `;
        return (
          <div className="h-full overflow-hidden">
              <div
                key={leaf.id}
                className="leaf absolute bg-red-600"
                style={{
                  left: leaf.left,
                  top: leaf.top,
                  width: (leaf.widthAndHeight + 20) + 'px',
                  height: (leaf.widthAndHeight + 20) + 'px',
                  boxShadow: '10px 10px 5px 0px rgba(0,0,0,0.75)',
                  opacity: leaf.opacity,
                  animation: `rotate 8s linear infinite, ${animationName} ${leaf.animationLength} linear forwards`,
                  zIndex: leaf.zIndex,
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

        @keyframes wind {
          0% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(2deg); /* Плавне зміщення на 2 градуси */
          }
          100% {
            transform: rotate(0deg);
          }
        }

        .top {
          animation: wind 4s ease-in-out infinite;
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

export default App;

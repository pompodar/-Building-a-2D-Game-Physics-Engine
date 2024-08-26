1. In MyGame.js 
   
    we create an object:

    var up = new Rectangle(new Vec2(pisitionX, positionY), width, height, fix);

    var up = new Rectangle(new Vec2(200, 200), 40, 40, true);

2. in Rectangle.js

    we create a Rigid object:

    RigidShape.call(this, center);

3. In RigidShape.js

    we push this object to and array of objects:

    gEngine.Core.mAllObjects.push(this);

4.In Core.js in runGameLoop function we have:

    requestAnimationFrame(function () {
	   runGameLoop();
     });
     
    which is like a setInterval which a) updates and b) draws: // TODO - clarify how the interval is being calculated

      a) in update function we update each object:

          mAllObjects[i].update(mContext);

       this function is in RapidShape.js:

           RigidShape.prototype.update = function () {
			if (this.mCenter.y < gEngine.Core.mHeight && this.mFix !== 0) // TODO - clarify this condition
			    this.move(new Vec2(0, 1));
		   };

        this function is in Rectangle.js:
        
        Rectangle.prototype.move = function (v) {
			var i; 
			for (i = 0; i < this.mVertex.length; i++) {
			    this.mVertex[i] = this.mVertex[i].add(v);
			}
			
			this.mCenter = this.mCenter.add(v);
			return this;
		  };

            and this one is in Vec2:
			
			Vec2.prototype.add = function (vec) {
			    return new Vec2(vec.x + this.x, vec.y + this.y);
			  };
		b) function draw draws the canvas from scratch:
		
		   var draw = function () {
			mContext.clearRect(0, 0, mWidth, mHeight);
			var i; for (i = 0; i < mAllObjects.length; i++) {
			mContext.strokeStyle = 'blue';
			
			if (i === gObjectNum)
				mContext.strokeStyle = 'red';
				mAllObjects[i].draw(mContext);
			}
		};

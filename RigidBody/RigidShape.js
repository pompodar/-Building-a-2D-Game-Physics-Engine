function RigidShape(center) {
    this.mCenter = center;
    this.mAngle = 0;
    this.mBoundRadius = 0;
    gEngine.Core.mAllObjects.push(this);
}

RigidShape.prototype.update = function () {
    // if (this.mCenter.y < gEngine.Core.mHeight && this.mFix !== 0) 
    //     this.move(new Vec2(0, 1));
    //     this.rotate(0.1);
};

RigidShape.prototype.boundTest = function (otherShape) {
    var vFrom1to2 = otherShape.mCenter.subtract(this.mCenter);
    var rSum = this.mBoundRadius + otherShape.mBoundRadius;
    var dist = vFrom1to2.length();

    if (dist > rSum) {
       return false; //not overlapping
    }
    
    return true;
};
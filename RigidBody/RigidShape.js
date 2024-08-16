function RigidShape(center) {
    this.mCenter = center;
    this.mAngle = 0;
    gEngine.Core.mAllObjects.push(this);
}

RigidShape.prototype.update = function () {
    if (this.mCenter.y < gEngine.Core.mHeight && this.mFix !== 0) 
        this.move(new Vec2(0, 1));
        this.rotate(0.1);
};
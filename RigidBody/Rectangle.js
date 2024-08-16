var Rectangle = function (center, width, height, fix) {
    RigidShape.call(this, center);
    this.mType = "Rectangle";
    this.mWidth = width;
    this.mHeight = height;
    this.mVertex = [];
    this.mFaceNormal = [];
    this.mFix = fix;

    // 0--TopLeft; 1--TopRight; 2--BottomRight; 3--BottomLeft
    this.mVertex[0] = new Vec2(center.x - width / 2, center.y - height / 2);
    this.mVertex[1] = new Vec2(center.x + width / 2, center.y - height / 2);
    this.mVertex[2] = new Vec2(center.x + width / 2, center.y + height / 2);
    this.mVertex[3] = new Vec2(center.x - width / 2, center.y + height / 2);

    // 0--Top;1--Right;2--Bottom;3--Left
    // mFaceNormal is normal of face toward outside of rectangle
    // SV - The face normal vectors will be used later for determining collisions.

    // this.mFaceNormal[0] = this.mVertex[1].subtract(this.mVertex[2]);
    // this.mFaceNormal[0] = this.mFaceNormal[0].normalize();
    // this.mFaceNormal[1] = this.mVertex[2].subtract(this.mVertex[3]);
    // this.mFaceNormal[1] = this.mFaceNormal[1].normalize();
    // this.mFaceNormal[2] = this.mVertex[3].subtract(this.mVertex[0]);
    // this.mFaceNormal[2] = this.mFaceNormal[2].normalize();
    // this.mFaceNormal[3] = this.mVertex[0].subtract(this.mVertex[1]);
    // this.mFaceNormal[3] = this.mFaceNormal[3].normalize();

};

var prototype = Object.create(RigidShape.prototype);
prototype.constructor = Rectangle;
Rectangle.prototype = prototype;

Rectangle.prototype.draw = function (context) {
    context.save();
    context.translate(this.mVertex[0].x, this.mVertex[0].y); // SV - how an object falls by default
    context.rotate(this.mAngle);
    context.strokeRect(0, 0, this.mWidth, this.mHeight);
    context.restore();

};

Rectangle.prototype.move = function (v) {
    console.log("Rectangle move");
    
    var i; 
    for (i = 0; i < this.mVertex.length; i++) {
        this.mVertex[i] = this.mVertex[i].add(v);
    }

    this.mCenter = this.mCenter.add(v);
    return this;
};

Rectangle.prototype.rotate = function (angle) { 
    this.mAngle += angle; var i; 
    for (i = 0; i < this.mVertex.length; i++) {
        this.mVertex[i] = this.mVertex[i].rotate(this.mCenter, angle);
    }
    this.mFaceNormal[0] = this.mVertex[1].subtract(this.mVertex[2]);
    this.mFaceNormal[0] = this.mFaceNormal[0].normalize();
    this.mFaceNormal[1] = this.mVertex[2].subtract(this.mVertex[3]);
    this.mFaceNormal[1] = this.mFaceNormal[1].normalize();
    this.mFaceNormal[2] = this.mVertex[3].subtract(this.mVertex[0]);
    this.mFaceNormal[2] = this.mFaceNormal[2].normalize();
    this.mFaceNormal[3] = this.mVertex[0].subtract(this.mVertex[1]);
    this.mFaceNormal[3] = this.mFaceNormal[3].normalize();
    return this;
};
function MyGame() {
    var width = gEngine.Core.mWidth;
    var height = gEngine.Core.mHeight;
    // var r1 = new Rectangle(new Vec2(width / 2, height / 2), 3, 3, 0); // SV - creating an object by default
    
    // SV - var up = new Rectangle(new Vec2(pisitionX, positionY), width, height, fix);

    var r2 = new Rectangle(new Vec2(40, 40), 20, 20, 10, 1, 0);

    var r3 = new Rectangle(new Vec2(80, 80), 20, 20, 1, 1, 0);

    var r5 = new Rectangle(new Vec2(500, 200), 400, 20, 0, 0.3, 0);
r5.rotate(2.8);
var r6 = new Rectangle(new Vec2(200, 400), 400, 20, 0, 1, 0.5);
var r7 = new Rectangle(new Vec2(100, 200), 200, 20, 0);
var r8 = new Rectangle(new Vec2(10, 360), 20, 100, 0, 0, 1);


    // var up = new Rectangle(new Vec2(200, 200), 40, 40, false);
    // var down = new Rectangle(new Vec2(width / 2, height), width, 3);
    // var left = new Rectangle(new Vec2(0, height / 2), 3, height);
    // var right = new Rectangle(new Vec2(width, height / 2), 3, height);

}
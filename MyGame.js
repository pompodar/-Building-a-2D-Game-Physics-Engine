function MyGame() {
    var width = gEngine.Core.mWidth;
    var height = gEngine.Core.mHeight;
    var r1 = new Rectangle(new Vec2(width / 2, height / 2), 3, 3, 0);
    
    var up = new Rectangle(new Vec2(width / 2, 0), width, 3);
    var down = new Rectangle(new Vec2(width / 2, height), width, 3);
    var left = new Rectangle(new Vec2(0, height / 2), 3, height);
    var right = new Rectangle(new Vec2(width, height / 2), 3, height);

}
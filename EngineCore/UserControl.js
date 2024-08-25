var gObjectNum = 0;

function userControl(event) {
    var keycode;

    if (window.event) { // IE    
        keycode = event.keyCode;
    } else if (event.which) { // Netscape/Firefox/Opera
        keycode = event.which;
    }

    if (keycode === 70) { // f - SV - here we create a new falling object
        var r1 = new Rectangle(new Vec2(gEngine.Core.mAllObjects[gObjectNum].mCenter.x + 200,
        gEngine.Core.mAllObjects[gObjectNum].mCenter.y + 20),
        Math.random() * 30 + 10, Math.random() * 30 + 10);
    }
        
    if (keycode === 71) { //g    
        var r1 = new Circle(new Vec2(gEngine.Core.mAllObjects[gObjectNum].mCenter.x,
        gEngine.Core.mAllObjects[gObjectNum].mCenter.y),
        Math.random() * 10 + 20);
    }

    if (keycode >= 48 && keycode <= 57) { //number    
        if (keycode - 48 < gEngine.Core.mAllObjects.length)
            gObjectNum = keycode - 48;
    }

    if (keycode === 38) { //up arrow    
        if (gObjectNum > 0)
            gObjectNum--;
    }
    
    if (keycode === 40) { // down arrow    
        if (gObjectNum < gEngine.Core.mAllObjects.length-1)
            gObjectNum++;
    }

    // move with WASD keys
    if (keycode === 87) { //W    
        gEngine.Core.mAllObjects[gObjectNum].move(new Vec2(0, -10));
    
    }
    if (keycode === 83) { // S    
        gEngine.Core.mAllObjects[gObjectNum].move(new Vec2(0, +10));
    
    }
    
    if (keycode === 65) { //A    

        gEngine.Core.mAllObjects[gObjectNum].move(new Vec2(-10, 0));
        
    }

    if (keycode === 68) { //D    
        gEngine.Core.mAllObjects[gObjectNum].move(new Vec2(10, 0)); // SV - how we move an object to the right
    }

    // Rotate with QE keys
    if (keycode === 81) { //Q    
        gEngine.Core.mAllObjects[gObjectNum].rotate(-0.1);
    }
    
    if (keycode === 69) { //E    
        gEngine.Core.mAllObjects[gObjectNum].rotate(0.1);
    }
    
    // Toggle gravity with the H key
    if (keycode === 72) { //H    
        if(gEngine.Core.mAllObjects[gObjectNum].mFix === 0)
            gEngine.Core.mAllObjects[gObjectNum].mFix = 1;
        else gEngine.Core.mAllObjects[gObjectNum].mFix = 0
    ;}

    if (keycode === 82) { //R    
        gEngine.Core.mAllObjects.splice(5, gEngine.Core.mAllObjects.length);
        gObjectNum = 0;
    }   
    
    if (keycode === 73) //I
 gEngine.Core.mAllObject[gObjectNum].mVelocity.y -= 1;
if (keycode === 75) //k
 gEngine.Core.mAllObject[gObjectNum].mVelocity.y += 1;
if (keycode === 74) //j
 gEngine.Core.mAllObject[gObjectNum].mVelocity.x -= 1;
if (keycode === 76) //l
 gEngine.Core.mAllObject[gObjectNum].mVelocity.x += 1;
if (keycode === 85) //U
 gEngine.Core.mAllObject[gObjectNum].mAngularVelocity -= 0.1;
if (keycode === 79) //O
 gEngine.Core.mAllObject[gObjectNum].mAngularVelocity += 0.1;
if (keycode === 90) //Z
 gEngine.Core.mAllObject[gObjectNum].updateMass(-1);
if (keycode === 88) //X
 gEngine.Core.mAllObject[gObjectNum].updateMass(1);
if (keycode === 67) //C
 gEngine.Core.mAllObject[gObjectNum].mFriction -= 0.01;
 if (keycode === 86) //V
 gEngine.Core.mAllObject[gObjectNum].mFriction += 0.01;
if (keycode === 66) //B
 gEngine.Core.mAllObject[gObjectNum].mRestitution -= 0.01;
if (keycode === 78) //N
 gEngine.Core.mAllObject[gObjectNum].mRestitution += 0.01;
if (keycode === 188) //’
 gEngine.Core.mMovement = !gEngine.Core.mMovement;
if (keycode === 70) //f
 var r1 = new Rectangle(new Vec2(gEngine.Core.mAllObjects[gObjectNum].mCenter.x,
 gEngine.Core.mAllObjects[gObjectNum].mCenter.y),
 Math.random() * 30 + 10, Math.random() * 30 + 10,
 Math.random() * 30, Math.random(), Math.random());
if (keycode === 71) //g
 var r1 = new Circle(new Vec2(gEngine.Core.mAllObjects[gObjectNum].mCenter.x,
 gEngine.Core.mAllObjects[gObjectNum].mCenter.y),
 Math.random() * 10 + 20, Math.random() * 30,
 Math.random(), Math.random());
if (keycode === 72) { //H
 var i;
 for (i = 0; i < gEngine.Core.mAllObject.length; i++) {
    if (gEngine.Core.mAllObject[i].mInvMass !== 0)
        gEngine.Core.mAllObject[i].mVelocity =
        new Vec2(Math.random() * 20 - 10, Math.random() * 20 - 10);
        }
       }
}
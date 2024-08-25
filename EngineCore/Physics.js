var gEngine = gEngine || {};
gEngine.Physics = (function () {
    var mPositionalCorrectionFlag = true;
    // number of relaxation iteration
    var mRelaxationCount = 15;
    // percentage of separation to project objects
    var mPosCorrectionRate = 0.8;

    var collision = function () {
        var k, i, j;
        var collisionInfo = new CollisionInfo();

        for (k = 0; k < mRelaxationCount; k++) {
            for (i = 0; i < gEngine.Core.mAllObjects.length; i++) {
                for (j = i + 1; j < gEngine.Core.mAllObjects.length; j++) {
                    // Перевірка меж зіткнення
                    if (gEngine.Core.mAllObjects[i].boundTest(gEngine.Core.mAllObjects[j])) {
                        // Перевірка на зіткнення
                        if (gEngine.Core.mAllObjects[i].collisionTest(gEngine.Core.mAllObjects[j], collisionInfo)) {                        
                            // Перевірка та зміна напряму нормалі
                            if (collisionInfo.getNormal().dot(gEngine.Core.mAllObjects[j].mCenter.subtract(gEngine.Core.mAllObjects[i].mCenter)) < 0) {
                                collisionInfo.changeDir();
                            }
                            
                            // Малювання інформації про зіткнення
                            drawCollisionInfo(collisionInfo, gEngine.Core.mContext);
                            
                            resolveCollision(gEngine.Core.mAllObjects[i],
                                gEngine.Core.mAllObjects[j],
                                collisionInfo);
                        }
                    }
                }
            }
        }
    };

    // Функція для малювання інформації про зіткнення
    var drawCollisionInfo = function (collisionInfo, context) {        
        context.beginPath();
        context.moveTo(collisionInfo.mStart.x, collisionInfo.mStart.y);
        context.lineTo(collisionInfo.mEnd.x, collisionInfo.mEnd.y);
        context.closePath();
        context.strokeStyle = "green";
        context.stroke();
    };

    var positionalCorrection = function (s1, s2, collisionInfo) {
        var s1InvMass = s1.mInvMass;
        var s2InvMass = s2.mInvMass;
        var num = collisionInfo.getDepth() /
       (s1InvMass + s2InvMass) * mPosCorrectionRate;
        var correctionAmount = collisionInfo.getNormal().scale(num);
        s1.move(correctionAmount.scale(-s1InvMass));
        s2.move(correctionAmount.scale(s2InvMass));
    };

    var resolveCollision = function (s1, s2, collisionInfo) {
        if ((s1.mInvMass === 0) && (s2.mInvMass === 0))
        return;
        // correct positions
        if (gEngine.Physics.mPositionalCorrectionFlag)
        positionalCorrection(s1, s2, collisionInfo);
        var n = collisionInfo.getNormal();
        var v1 = s1.mVelocity;
        var v2 = s2.mVelocity;
        var relativeVelocity = v2.subtract(v1);
        // Relative velocity in normal direction
        var rVelocityInNormal = relativeVelocity.dot(n);
        // if objects moving apart ignore
        if (rVelocityInNormal > 0)
        return;
        // compute and apply response impulses for each object
        var newRestituion = Math.min(s1.mRestitution, s2.mRestitution);
        var newFriction = Math.min(s1.mFriction, s2.mFriction);
        // Calc impulse scalar
        var jN = -(1 + newRestituion) * rVelocityInNormal;
        jN = jN / (s1.mInvMass + s2.mInvMass);
        //impulse is in direction of normal ( from s1 to s2)
        var impulse = n.scale(jN);
        // impulse = F dt = m * v
        // v = impulse / m
        s1.mVelocity = s1.mVelocity.subtract(impulse.scale(s1.mInvMass));
        s2.mVelocity = s2.mVelocity.add(impulse.scale(s2.mInvMass));
        var tangent = relativeVelocity.subtract(n.scale(relativeVelocity.dot(n)));
            // relativeVelocity.dot(tangent) should less than 0
        tangent = tangent.normalize().scale(-1);
        var jT = -(1 + newRestituion) *
        relativeVelocity.dot(tangent) * newFriction;
        jT = jT / (s1.mInvMass + s2.mInvMass);
        // friction should be less than force in normal direction
        if (jT > jN) jT = jN;
        //impulse is from s1 to s2 (in opposite direction of velocity)
        impulse = tangent.scale(jT);
        s1.mVelocity = s1.mVelocity.subtract(impulse.scale(s1.mInvMass));
        s2.mVelocity = s2.mVelocity.add(impulse.scale(s2.mInvMass));
};

    // Публічний інтерфейс
    var mPublic = {
        collision: collision,
        mPositionalCorrectionFlag: mPositionalCorrectionFlag
    };
    
    return mPublic;
}());

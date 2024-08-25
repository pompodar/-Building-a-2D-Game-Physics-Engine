var gEngine = gEngine || {};
gEngine.Physics = (function () {
    var collision = function () {
        var i, j;
        var collisionInfo = new CollisionInfo();
        

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

    // Публічний інтерфейс
    var mPublic = {
        collision: collision
    };
    
    return mPublic;
}());

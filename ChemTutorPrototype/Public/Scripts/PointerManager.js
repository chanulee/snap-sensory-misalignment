//@input Component.ScriptComponent[] items

var threshold = 3;

global.pointerActive = false;

function onUpdate() {
    var hand = global.handTracking.getHand();
    
    if (hand === undefined) {
        untargetAll();
        return;
    }   
    
    if (global.pinchActive) {
        return;
    }    
    
    detectPointer(hand);
    
    if (global.pointerActive) {
        targetItem(hand);
    }
}

function untargetAll() {
    for (var i = 0; i < script.items.length; i++) {
        script.items[i].untarget();
    }
}

function detectPointer(hand) {
    var thumb = hand.thumb.tip.position;
    var middle = hand.middleFinger.getJoint(3).position;
    var distance = thumb.distance(middle);
    
    if (distance < threshold) {
        print("Pointer active");
        global.pointerActive = true;
    } else {
        global.pointerActive = false;
    }
}

function targetItem (hand) {
    var bestDot = -1; 
    var bestIndex = -1;
    
    for (var i = 0; i < script.items.length; i++) {
        var dot = script.items[i].getDotProduct(hand);
        if (dot > bestDot) {
            bestDot = dot;
            bestIndex = i;
        }
    } 
    
    for (var j = 0; j < script.items.length; j++) {
        if (j === bestIndex) {
            script.items[j].target();
        } else {
            script.items[j].untarget();
        }
    }     
}

script.createEvent("UpdateEvent").bind(onUpdate);

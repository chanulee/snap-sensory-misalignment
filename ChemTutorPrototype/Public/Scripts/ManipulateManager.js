//@input float maxScale = 1.5
//@input float minScale = 0.5
//@input float maxDistance = 30

global.pinchActive = false;

var threshold = 3;
var startPos = new vec3(0,0,0);
var startPosSet = false;

var transform = script.getSceneObject().getTransform();

function onUpdate() {
    var hand = global.handTracking.getHand();
    
    if (hand === undefined) {
        return;
    }
    
    if (global.pointerActive) {
        return;
    }    
    
    detectPinch(hand);    
    
    if (global.pinchActive) {
        scale(hand);
    } else {
        rotate(hand);       
    }

}

function detectPinch(hand) {
    var thumb = hand.thumb.tip.position;
    var finger = hand.indexFinger.tip.position;
    var distance = thumb.distance(finger);
    
    if (distance < threshold) {
        print("Pinch active");
        global.pinchActive = true;
    } else {
        global.pinchActive = false;
    }
}

function scale(hand) {
    if (!startPosSet) {
        startPos = hand.indexFinger.tip.position;
        startPosSet = true;
    }
    
    var pos = hand.indexFinger.tip.position;
    var distance = startPos.distance(pos);
    var range = script.maxScale - script.minScale;
    var multiplier = range * (distance / script.maxDistance) + script.minScale;
    var scale = new vec3(1,1,1).uniformScale(multiplier);
    transform.setWorldScale(scale);
}

function rotate(hand) {
    print("Rotating");
    transform.setWorldRotation(hand.rotation);
}

script.createEvent("UpdateEvent").bind(onUpdate);
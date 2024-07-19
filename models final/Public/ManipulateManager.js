// -----JS CODE-----
//@input float maxDistance = 30
//@input SceneObject model
//@input float grabThreshold = 5 // Adjust this value to fine-tune grab sensitivity

global.grabActive = false;
var lastGrabPosition = new vec3(0,0,0);
var lastRotation = new quat(0,0,0,1); // New: Store the last rotation
var transform = script.getSceneObject().getTransform();


////@input SceneObject manipulatedObject // The object to be manipulated
//var transform = script.manipulatedObject.getTransform();

function onUpdate() {
    var hand = global.handTracking.getHand();
    
    if (hand === undefined) {
        return;
    }
    
    if (global.pointerActive) {
        return;
    }    
    
    detectGrab(hand);    
    
    if (global.grabActive) {
        moveObject(hand);
        rotate(hand);
    } else {
        return;
    }
}

function detectGrab(hand) {
    var thumb = hand.thumb.tip.position;
    var indexFinger = hand.indexFinger.tip.position;
    var middleFinger = hand.middleFinger.tip.position;
    var ringFinger = hand.ringFinger.tip.position;
    var applePosition = (thumb + indexFinger + middleFinger + ringFinger)/4;
    
    
    var distanceIndex = thumb.distance(indexFinger);
    var distanceMiddle = thumb.distance(middleFinger);
    var distanceRing = thumb.distance(ringFinger);
    
    var averageDistance = (distanceIndex + distanceMiddle + distanceRing) / 3;
    
    if (averageDistance < script.grabThreshold) {
        if (!global.grabActive) {
            // Just started grabbing, record the position
            lastGrabPosition = hand.thumb.tip.position;
        }
        global.grabActive = true;
    } else {
        global.grabActive = false;
    }
}

function moveObject(hand) {
    var currentPosition = hand.thumb.tip.position;
    var delta = currentPosition.sub(lastGrabPosition);
    
    // Apply the movement to the object
    var currentObjectPosition = transform.getWorldPosition();
    var newPosition = currentObjectPosition.add(delta);
    transform.setWorldPosition(newPosition);
    
    // Update the last grab position for the next frame
    lastGrabPosition = currentPosition;
}

function rotate(hand) {
    transform.setWorldRotation(hand.rotation);
}

//function toggleModelVisibility() {
//    script.model.enabled = !script.model.enabled;
//}

script.createEvent("UpdateEvent").bind(onUpdate);

//@input float maxDistance = 30
//@input SceneObject model
//@input float grabThreshold = 3

global.grabActive = false;
global.rotationLogged = false;
var lastGrabPosition = new vec3(0, 0, 0);
var applePosition = new vec3(0, 0, 0);

var initialHandRotation = new quat(0, 0, 0, 1);


var transform = script.getSceneObject().getTransform();
//script.model.enabled = false; // Initially hide the SceneObject
//print("false");

function onUpdate() {
    print("onupdate");
    var hand = global.handTracking.getHand();

    if (hand === undefined) {
        return;
    }

    detectGrab(hand);

    if (global.grabActive) {
//        if (!script.model.enabled) {
//            script.model.enabled = true; // Show the model when the first grab is detected
//            transform.setWorldPosition(applePosition); // Set initial position
//        }
        moveObject(hand);
        rotate(hand);
    } else {
        global.rotationLogged = false;
        // print("Grab is not active"); // Debug statement to check if grab is not active
        // script.model.enabled = false;
    }
}

function detectGrab(hand) {
    var thumb = hand.thumb.tip.position;
    var indexFinger = hand.indexFinger.tip.position;
    var middleFinger = hand.middleFinger.tip.position;
    var ringFinger = hand.ringFinger.tip.position;

    applePosition = new vec3(
        (thumb.x + indexFinger.x + middleFinger.x + ringFinger.x) / 4,
        (thumb.y + indexFinger.y + middleFinger.y + ringFinger.y) / 4,
        (thumb.z + indexFinger.z + middleFinger.z + ringFinger.z) / 4
    );

    var distanceIndex = thumb.distance(indexFinger);
    var distanceMiddle = thumb.distance(middleFinger);
    var distanceRing = thumb.distance(ringFinger);

    var averageDistance = (distanceIndex + distanceMiddle + distanceRing) / 3;

    if (averageDistance < script.grabThreshold) {
        if (!global.grabActive) {
            // Just started grabbing, record the position
            lastGrabPosition = applePosition;
        }
        global.grabActive = true;
    } else {
        global.grabActive = false;
    }
}

function moveObject(hand) {
    var currentPosition = applePosition;
    var delta = currentPosition.sub(lastGrabPosition);

    // Apply the movement to the object
    var currentObjectPosition = transform.getWorldPosition();
    var newPosition = currentObjectPosition.add(delta);
    transform.setWorldPosition(newPosition);

    // Update the last grab position for the next frame
    lastGrabPosition = currentPosition;
}

function rotate(hand) {
    if (!global.rotationLogged) {
        global.initialHandRotation = hand.rotation;
        global.rotationLogged = true;
    } else {
        // Calculate the rotation of the hand relative to the initial hand rotation
        var deltaRotation = hand.rotation.multiply(global.initialHandRotation.invert());

        // Apply the rotation to the object
        var objectRotation = transform.getWorldRotation();
        var newRotation = deltaRotation.multiply(objectRotation);
        transform.setWorldRotation(newRotation);

        // Update the last orientation for the next frame
        global.initialHandRotation = hand.rotation;
    }
}

script.createEvent("UpdateEvent").bind(onUpdate);
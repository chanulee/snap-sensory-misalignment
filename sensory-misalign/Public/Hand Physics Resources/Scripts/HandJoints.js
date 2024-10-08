// HandJoints.js
// Version: 0.1.0
// Event: On Awake
// Description: Creates sphere objects that match hand pose.
// Subscribes to hand tracking events to hide/show objects.
// NOTE: This is a basic example, and has not been tested on range of hand sizes and types.

// @input SceneObject handJoint
// @input bool isLeftHand
// @ui {"widget":"separator"}
// @input bool startVisible = true
// @input bool showMesh = true

if (script.handJoint === undefined) {
    print("ERROR: Missing reference to joint object");
    script.getSceneObject().destroy();
    return;
}

script.fingerJoints = [];
script.palmBones = [];
script.handJoints = [];
script.renderMeshes = [];
script.bodyComponents = [];

script.isVisible = undefined;

//////////////////////////////////////////////////////////////////////////////////
//
// FINGER Joint
// A sphere that sits either on one joint or between two joints
//

global.fingerJoint = function(jointObj, baseJoint, parent, endJoint) {
    this.baseJoint = baseJoint;
    this.endJoint = endJoint;
    this.object = parent.copyWholeHierarchy(jointObj);
    this.objectTransform = this.object.getTransform();
    this.update();
};

global.fingerJoint.prototype.update = function() {

    this.position = this.baseJoint.position;
    this.rotation = this.baseJoint.rotation;
    this.objectTransform.setWorldPosition(this.position);
    this.objectTransform.setWorldRotation(this.rotation);
};

//////////////////////////////////////////////////////////////////////////////////
//
// PALM BONE
// A collection of spheres that connect the wrist to the base of a finger.
// There is no palm bone for the thumb.
//

global.palmBone = function(jointObj, hand, baseFingerJoint, parent) {
    this.objects = [];    
    this.objectTransforms = [];
    this.hand = hand;
    this.baseFingerJoint = baseFingerJoint;
    var obj = parent.copyWholeHierarchy(jointObj);
    this.objects.push(obj);
    this.objectTransforms.push(obj.getTransform());

};

global.palmBone.prototype.update = function() {
    var baseFingerPosition = this.baseFingerJoint.position;
    var basePalmPosition = this.hand.wrist.position.add(this.hand.up);
    var len = this.objectTransforms.length;
    for (var i = 0; i < len; i++) {
        this.objectTransforms[i].setWorldPosition(vec3.lerp(basePalmPosition, baseFingerPosition, i / len));
    }
};

//////////////////////////////////////////////////////////////////////////////////
//
// PUBLIC METHODS - API
//

script.setVisible = function(value) {
    script.isVisible = value;
    for (var i = 0; i < script.renderMeshes.length; i++) {
        script.renderMeshes[i].enabled = script.isVisible && script.showMesh;
    }
};

//////////////////////////////////////////////////////////////////////////////////
//
// "PRIVATE" METHODS
// Doesn't make any sense to call this from another script.
//

// Called on start for each finger
script.createBones = function(prefix, isThumb) {
    for (var i = 0; i < 4; i++) {
        var current = prefix + "-" + i.toFixed(0);
        var joint = new global.fingerJoint(script.handJoint, script.hand.getJoint(current), script.getSceneObject());
        script.fingerJoints.push(joint);        
        script.handJoints.push(joint.object);
        script.renderMeshes.push(joint.object.getComponent("Component.RenderMeshVisual"));
        script.bodyComponents.push(joint.object.getComponent("Physics.BodyComponent"));
        
        var next = prefix + "-" + (i+1).toFixed(0);
        var midJoint = new global.fingerJoint(script.handJoint, script.hand.getJoint(current), script.getSceneObject(), script.hand.getJoint(next));
        script.fingerJoints.push(midJoint);
        script.handJoints.push(midJoint.object);
        script.renderMeshes.push(midJoint.object.getComponent("Component.RenderMeshVisual"));
        script.bodyComponents.push(midJoint.object.getComponent("Physics.BodyComponent"));
    }


    if (isThumb === true) {
        return;
    }
    
    var baseJoint = prefix + "-0";
    var bone = new global.palmBone(script.handJoint, script.hand, script.hand.getJoint(baseJoint), script.getSceneObject());
    script.palmBones.push(bone);
    
    for (var j = 0; j < bone.objects.length; j++) {
        script.handJoints.push(bone.objects[j]);
        script.renderMeshes.push(bone.objects[j].getComponent("Component.RenderMeshVisual"));
        script.bodyComponents.push(bone.objects[j].getComponent("Physics.BodyComponent"));
    }
};

// Called after a delay during onTrackingStart
script.enableObjects = function() {
    for (var i = 0; i < script.handJoints.length; i++) {
        script.handJoints[i].enabled = true;
    }
};

script.handleTrackingStart = function() {
    script.onUpdate = script.createEvent("UpdateEvent");
    script.onUpdate.bind(script.handleUpdate);
    
    // Show the hand after a one frame delay so that objects don't draw in the old position.
    // This issue can persist even if the positions are updated prior to enabling the objects.
    if (script.trackingStartEvent) {
        script.removeEvent(script.trackingStartEvent);
    }
    
    script.trackingStartEvent = script.createEvent("DelayedCallbackEvent");
    script.trackingStartEvent.bind(script.enableObjects);
    script.trackingStartEvent.reset(0.0001);
};

script.handleTrackingStop = function() {
    script.removeEvent(script.onUpdate);
    for (var i = 0; i < script.handJoints.length; i++) {
        script.handJoints[i].enabled = false;
    }
    // Cancel the tracking start event. Otherwise, it may re-enable itself while untracked.
    if (script.trackingStartEvent) {
        script.removeEvent(script.trackingStartEvent);
    }
};

script.handleUpdate = function() {
    for (var i =0 ; i < script.fingerJoints.length; i++) {
        script.fingerJoints[i].update();
    }

    for (var j =0 ; j < script.palmBones.length; j++) {
        script.palmBones[j].update();
    }
};

//////////////////////////////////////////////////////////////////////////////////
//
// INITIALIZATION
//

script.hand = script.isLeftHand ? global.handTracking.getHand(global.handTracking.HAND_ID.left) : global.handTracking.getHand(global.handTracking.HAND_ID.right);

script.hand.subscribeOnTrackingStart(script.handleTrackingStart);
script.hand.subscribeOnTrackingStop(script.handleTrackingStop);

script.handJoint.enabled = true;

script.createBones("index", false);
script.createBones("mid", false);
script.createBones("ring", false);
script.createBones("pinky", false);
script.createBones("thumb", true);

script.handJoint.enabled = false;

script.setVisible(script.startVisible);

// Disable all objects until the hand is tracked
for (var i = 0; i < script.handJoints.length; i++) {
    script.handJoints[i].enabled = false;
}

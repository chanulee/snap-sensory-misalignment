//@input SceneObject model

var targetScale = new vec3(1.2, 1.2, 1.2);
var untargetScale = new vec3(1, 1, 1);
var transform = script.getSceneObject().getTransform();

script.target = function() {
    transform.setWorldScale(targetScale);  
    script.model.enabled = true;
}

script.untarget = function() {
    transform.setWorldScale(untargetScale);
    script.model.enabled = false;
}

script.getDotProduct = function(hand) {
    var pos = transform.getWorldPosition();
    var fingerTip = hand.indexFinger.tip.position;
    var dirToFinger = pos.sub(fingerTip).normalize();
    var fingerDir = hand.indexFinger.getRay();
    var dot = dirToFinger.dot(fingerDir);
    return dot;
}

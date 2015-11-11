function PlayerControls(player, domElement)
{
  var self = this;

  this.player = player;
  this.domElement = domElement;

  this.velocity = new THREE.Vector3;
  this.targetVelocity = new THREE.Vector3;

  this.moveForward = false;
  this.moveBackward = false;
  this.moveLeft = false;
  this.moveRight = false;
  this.moveUp = false;
  this.moveDown = false;
  this.rotateLeft = false;
  this.rotateRight = false;

  this.mouseSpeedX = 0;
  this.mouseSpeedY = 0;

  function onMouseMove(e) {
    self.mouseSpeedX += 4 * (e.movementX || e.mozMovementX || e.webkitMovementX || 0);
    //self.mouseSpeedY += 4 * (e.movementY || e.mozMovementY || e.webkitMovementY || 0);
  }

  function onKeyDown(e) {
    switch (e.keyCode) {
      case 65: self.moveLeft = true; break;
      case 68: self.moveRight = true; break;
      case 87: self.moveForward = true; break;
      case 83: self.moveBackward = true; break;
      case 82: self.moveUp = true; break;
      case 70: self.moveDown = true; break;
      case 81: self.rotateLeft = true; break;
      case 69: self.rotateRight = true; break;
    }
  }

  function onKeyUp(e) {
    switch (e.keyCode) {
      case 65: self.moveLeft = false; break;
      case 68: self.moveRight = false; break;
      case 87: self.moveForward = false; break;
      case 83: self.moveBackward = false; break;
      case 82: self.moveUp = false; break;
      case 70: self.moveDown = false; break;
      case 81: self.rotateLeft = false; break;
      case 69: self.rotateRight = false; break;
    }
  }

  domElement.onclick = function() {
    domElement.requestPointerLock = domElement.requestPointerLock ||
                            domElement.mozRequestPointerLock ||
                            domElement.webkitRequestPointerLock;

    domElement.requestPointerLock();
  };

  // Hook pointer lock state change events for different browsers
  document.addEventListener('pointerlockchange', lockChange, false);
  document.addEventListener('mozpointerlockchange', lockChange, false);
  document.addEventListener('webkitpointerlockchange', lockChange, false);

  function lockChange() {
    if (document.pointerLockElement === domElement ||
        document.mozPointerLockElement === domElement ||
        document.webkitPointerLockElement === domElement) {
      document.addEventListener('mousemove', onMouseMove, false);
    }
    else {
      document.removeEventListener('mousemove', onMouseMove, false);
    }
  }

  document.addEventListener('keydown', onKeyDown, false);
  document.addEventListener('keyup', onKeyUp, false);
}

PlayerControls.prototype = {

  update: (function() {
    var vectorZ = new THREE.Vector3(0, 0, 1);
    var rotation = new THREE.Quaternion();

    return function(delta) {
      var player = this.player;

      // Update camera roll/pitch etc
      this.mouseSpeedX -= 4 * this.mouseSpeedX * delta;
      this.mouseSpeedY -= 4 * this.mouseSpeedY * delta;

      var movementVector = new THREE.Vector3(this.mouseSpeedX * delta, -this.mouseSpeedY * delta, 100.0);
      movementVector.normalize();

      rotation.setFromUnitVectors(vectorZ, movementVector);

      player.quaternion.multiplyQuaternions(player.quaternion, rotation);

      /*if (this.rotateLeft) {
        rotation.setFromAxisAngle(vectorZ, delta);
        player.quaternion.multiplyQuaternions(player.quaternion, rotation);
      }

      if (this.rotateRight) {
        rotation.setFromAxisAngle(vectorZ, -delta);
        player.quaternion.multiplyQuaternions(player.quaternion, rotation);
      }*/

      this.velocity.set(0, 0, 0);

      if (this.moveForward) {
        this.velocity.add(new THREE.Vector3(0, 0, 1));
      }

      if (this.moveBackward) {
        this.velocity.add(new THREE.Vector3(0, 0, -1));
      }

      if (this.moveLeft) {
        this.velocity.add(new THREE.Vector3(-1, 0, 0));
      }

      if (this.moveRight) {
        this.velocity.add(new THREE.Vector3(1, 0, 0));
      }

      /*if (this.moveUp) {
        this.velocity.add(new THREE.Vector3(0, 1, 0));
      }

      if (this.moveDown) {
        this.velocity.add(new THREE.Vector3(0, -1, 0));
      }*/

      if (this.velocity.lengthSq() > 0) {
        this.velocity.normalize().multiplyScalar(delta);

        this.player.move(this.velocity);
      }
    };
  })()

};

module.exports = PlayerControls;
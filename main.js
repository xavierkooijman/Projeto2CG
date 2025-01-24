// Import Three.js and dependencies
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//get ids from buttons
const btnOpen = document.getElementById("btnOpen");
const btnFist = document.getElementById("btnFist");
const btnPeace = document.getElementById("btnPeace");
const btnRock = document.getElementById("btnRock");
const btnMiddleFinger = document.getElementById("btnMiddleFinger");
const btnStarLordMiddleFinger = document.getElementById("btnStarLordMiddleFinger");
const btnET = document.getElementById("btnET");
const btnReset = document.getElementById("btnReset");

import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';



// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Enable shadows in the renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;


// Load HDRI environment map
const pmremGenerator = new THREE.PMREMGenerator( renderer );

const hdriLoader = new RGBELoader()
hdriLoader.load( "/rogland_clear_night_1k.hdr", function ( texture ) {
  const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
  texture.dispose(); 
  scene.environment = envMap
} );

// Add light
const light = new THREE.DirectionalLight(0xffffff, 20);
light.position.set(-25, 4, 40);
light.castShadow = true;
light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;
scene.add(light);


// Plane geometry setup
const planeGeometry = new THREE.PlaneGeometry(200, 200);
const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x020202 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0,0,-3);
plane.receiveShadow = true;
scene.add(plane);



// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Materials
const metallicMaterial = new THREE.MeshPhysicalMaterial({color: 0xfafafa, roughness: 0, metalness: 1});
const sphereMaterial = new THREE.MeshPhysicalMaterial({color: 0x000000, roughness: 0, metalness: 1});

// Palm
const palm = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 0.3), metallicMaterial);
palm.position.set(-3, -1, 0);
palm.castShadow = true;

const thumbpalm = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.3), metallicMaterial);
palm.add(thumbpalm);
thumbpalm.position.set(-1.1, -0.5, 0.2);
thumbpalm.rotateY(0.4);

scene.add(palm);

// Finger parameters
const fingerLength = 0.7;
const fingerWidth = 0.15;
const fingerSpacing = 0.5;
const fingers = [];

// Create fingers
for (let i = 0; i < 4; i++) {
    const fingerGroup = new THREE.Group();

    // Finger base joint
		const baseJoint = new THREE.Group();
    const baseSegment = new THREE.Mesh(new THREE.CylinderGeometry( fingerWidth, fingerWidth, fingerLength, 32 ), metallicMaterial);
		baseSegment.position.y = fingerLength / 2;

		const sphereBase = new THREE.Mesh(new THREE.SphereGeometry(fingerWidth), sphereMaterial);
    sphereBase.add(baseSegment);
		sphereBase.position.y = 0;

		baseJoint.add(sphereBase);
		baseJoint.position.y = fingerLength;
    fingerGroup.add(baseJoint);

    // Finger middle joint
    const middleJoint = new THREE.Group();
    const middleSegment = new THREE.Mesh(new THREE.CylinderGeometry( fingerWidth, fingerWidth, fingerLength, 32 ), metallicMaterial);
    middleSegment.position.y = fingerLength / 2;

		const sphereMiddle1 = new THREE.Mesh(new THREE.SphereGeometry(fingerWidth), sphereMaterial);
    sphereMiddle1.add(middleSegment);
		sphereMiddle1.position.y = 0;

    middleJoint.add(sphereMiddle1);
    middleJoint.position.y = fingerLength;
    sphereBase.add(middleJoint);

    // Finger tip joint
    const tipJoint = new THREE.Group();
    const tipSegment = new THREE.Mesh(new THREE.CylinderGeometry( fingerWidth, fingerWidth, fingerLength, 32 ), metallicMaterial);
    tipSegment.position.y = fingerLength / 2;

		const fingertip = new THREE.Mesh(new THREE.SphereGeometry(fingerWidth), sphereMaterial);
    fingertip.position.y = fingerLength / 2;
    tipSegment.add(fingertip);
		
		const sphereMiddle2 = new THREE.Mesh(new THREE.SphereGeometry(fingerWidth), sphereMaterial);
    sphereMiddle2.add(tipSegment);
		sphereMiddle2.position.y = 0;

    tipJoint.add(sphereMiddle2);
    tipJoint.position.y = fingerLength;
    sphereMiddle1.add(tipJoint);

    //shadows
    sphereBase.castShadow = true;
    sphereMiddle1.castShadow = true;
    sphereMiddle2.castShadow = true;
    tipSegment.castShadow = true;
    middleSegment.castShadow = true;
    baseSegment.castShadow = true;
    tipJoint.castShadow = true;

    // Position finger group relative to palm
    fingerGroup.position.set((i - 1.5) * fingerSpacing, 0, 0);
    palm.add(fingerGroup);
    fingerGroup.position.y = 0.3;
    fingers.push({ fingerGroup, sphereBase, middleJoint, tipJoint });
}

// Thumb base joint
const thumbGroup = new THREE.Group();

const baseJoint = new THREE.Group();
const baseSegment = new THREE.Mesh(new THREE.CylinderGeometry( fingerWidth, fingerWidth, fingerLength, 32 ), metallicMaterial);
baseSegment.position.y = fingerLength / 2;

const sphereBase = new THREE.Mesh(new THREE.SphereGeometry(fingerWidth), sphereMaterial);
sphereBase.add(baseSegment);
sphereBase.position.y = 0;

baseJoint.add(sphereBase);
baseJoint.position.y = fingerLength;
thumbGroup.add(baseJoint);

// Thumb tip joint
const tipJoint = new THREE.Group();
const tipSegment = new THREE.Mesh(new THREE.CylinderGeometry( fingerWidth, fingerWidth, fingerLength, 32 ), metallicMaterial);
tipSegment.position.y = fingerLength / 2;

const fingertip = new THREE.Mesh(new THREE.SphereGeometry(fingerWidth), sphereMaterial);
fingertip.position.y = fingerLength / 2;
tipSegment.add(fingertip);
		
const sphereMiddle2 = new THREE.Mesh(new THREE.SphereGeometry(fingerWidth), sphereMaterial);
sphereMiddle2.add(tipSegment);
sphereMiddle2.position.y = 0;

tipJoint.add(sphereMiddle2);
tipJoint.position.y = fingerLength;
sphereBase.add(tipJoint);

//shadows
sphereBase.castShadow = true;
tipSegment.castShadow = true;
baseSegment.castShadow = true;
tipJoint.castShadow = true;
sphereMiddle2.castShadow = true;

// Position finger group relative to palm
thumbpalm.add(thumbGroup);
thumbpalm.castShadow = true;
thumbGroup.position.set(-0.3, -0.2, 0);
thumbGroup.rotateY(-0.5)

// GUI setup
const gui = new GUI();

const folder2 = gui.addFolder(`Hand`);
folder2.add(palm.rotation, 'y', -Math.PI*2, Math.PI*2, 0.01).name('Hand Rotation Y');
folder2.add(palm.rotation, 'x', -Math.PI*2, Math.PI*2, 0.01).name('Hand Rotation X');

const folder = gui.addFolder(`Finger 1`);

folder.add(sphereBase.rotation, 'z', -1.05, 0,0.01).name('Base Curl');
folder.add(tipJoint.rotation, 'z', -Math.PI / 2, 0, 0.01).name('Tip Curl');
folder.add(thumbGroup.rotation, 'z', -0.02, 0.02, 0.01).name('Side Angle');


fingers.forEach((finger, index) => {
    const folder = gui.addFolder(`Finger ${index + 2}`);
    folder.add(finger.sphereBase.rotation, 'x', 0, 1.05, 0.01).name('Base Curl');
    folder.add(finger.middleJoint.rotation, 'x', 0, Math.PI / 2, 0.01).name('Middle Curl');
    folder.add(finger.tipJoint.rotation, 'x', 0, Math.PI / 2, 0.01).name('Tip Curl');
    folder.add(finger.fingerGroup.rotation, 'z', -0.02, 0.02, 0.01).name('Side Angle');
});


//function for animating finger joints, receives target rotation values and duration and animates from the current joints rotation to target ones 

function animateFingerJoints(targetRotations, duration = 500) {
  const startTime = performance.now();

  // Save the initial rotations for interpolation
  const initialRotations = {
      fingers: fingers.map(finger => ({
          sphereBase: { x: finger.sphereBase.rotation.x, z: finger.sphereBase.rotation.z },
          middleJoint: { x: finger.middleJoint.rotation.x },
          tipJoint: { x: finger.tipJoint.rotation.x },
          fingerGroup: { z: finger.fingerGroup.rotation.z }
      })),
      sphereBase: { z: sphereBase.rotation.z },
      tipJoint: { z: tipJoint.rotation.z },
      thumbGroup: { z: thumbGroup.rotation.z }
  };

  // Animation loop
  function animate(time) {
      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1); // Interpolation factor (0 to 1)

      // Interpolate finger joints
      fingers.forEach((finger, i) => {
          const target = targetRotations.fingers[i];
          const initial = initialRotations.fingers[i];

          finger.sphereBase.rotation.x = THREE.MathUtils.lerp(initial.sphereBase.x, target.sphereBase.x, t);
          finger.sphereBase.rotation.z = THREE.MathUtils.lerp(initial.sphereBase.z, target.sphereBase.z, t);

          finger.middleJoint.rotation.x = THREE.MathUtils.lerp(initial.middleJoint.x, target.middleJoint.x, t);
          finger.tipJoint.rotation.x = THREE.MathUtils.lerp(initial.tipJoint.x, target.tipJoint.x, t);

          finger.fingerGroup.rotation.z = THREE.MathUtils.lerp(initial.fingerGroup.z, target.fingerGroup.z, t);
      });

      // Interpolate thumb joints

      sphereBase.rotation.z = THREE.MathUtils.lerp(initialRotations.sphereBase.z,targetRotations.sphereBase.z,t);

      tipJoint.rotation.z = THREE.MathUtils.lerp(initialRotations.tipJoint.z,targetRotations.tipJoint.z,t);

      thumbGroup.rotation.z = THREE.MathUtils.lerp(initialRotations.thumbGroup.z,targetRotations.thumbGroup.z,t);

      // Continue animation if not finished
      if (t < 1) {
          requestAnimationFrame(animate);
      }
  }

  // Start the animation
  requestAnimationFrame(animate);
}

function animatePalm(targetRotations, duration = 500) {
  const startTime = performance.now();

  // Save the initial rotations for interpolation
  const initialRotations = {
    palm: { x: palm.rotation.x, y: palm.rotation.y }
  };

  // Animation loop
  function animate(time) {
      const elapsed = time - startTime;
      const t = Math.min(elapsed / duration, 1); // Interpolation factor (0 to 1)

      // Interpolate palm rotation
      palm.rotation.x = THREE.MathUtils.lerp(initialRotations.palm.x, targetRotations.palm.x, t);
      palm.rotation.y = THREE.MathUtils.lerp(initialRotations.palm.y, targetRotations.palm.y, t);

      // Continue animation if not finished
      if (t < 1) {
          requestAnimationFrame(animate);
      }
  }

  // Start the animation
  requestAnimationFrame(animate);
}


// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

//button event listeners

btnOpen.addEventListener("click", () =>{

  const targetRotations = {
    fingers: fingers.map(() => ({
        sphereBase: { x: 0, z: 0 },
        middleJoint: { x: 0 },
        tipJoint: { x: 0 },
        fingerGroup: { z: 0 }
    })),
    sphereBase: { z: 0 },
    tipJoint: { z: 0 },
    thumbGroup: { z: 0 }
  };

  animateFingerJoints(targetRotations, 500);
});

btnFist.addEventListener("click", () =>{

  const targetRotations = {
    fingers: fingers.map(() => ({
        sphereBase: { x: 1.05, z: 0 },
        middleJoint: { x: Math.PI / 2 },
        tipJoint: { x: Math.PI / 2 },
        fingerGroup: { z: 0 }
    })),
    sphereBase: { z: 0 },
    tipJoint: { z: -1.35 },
    thumbGroup: { z: 0 }
  };

  animateFingerJoints(targetRotations, 500);
});

btnPeace.addEventListener("click", () =>{

  const targetRotations = {
    fingers: fingers.map((finger,index) => {
      if(index == 0){
        return{
          sphereBase: { x: 0, z: 0 },
          middleJoint: { x: 0 },
          tipJoint: { x: 0 },
          fingerGroup: { z: 0 }
        }
      }
      else if(index == 1){
        return{
          sphereBase: { x: 0, z: 0 },
          middleJoint: { x: 0 },
          tipJoint: { x: 0 },
          fingerGroup: { z: 0 }
        }
      }
      else{
        return{
          sphereBase: { x: 1.05, z: 0 },
          middleJoint: { x: Math.PI / 2 },
          tipJoint: { x: Math.PI / 2 },
          fingerGroup: { z: 0 }
        }
      }
    }),
    sphereBase: { z: -0.3 },
    tipJoint: { z: -1.3 },
    thumbGroup: { z: 0 }
  };

  animateFingerJoints(targetRotations, 500);
});

btnRock.addEventListener("click", () =>{

  const targetRotations = {
    fingers: fingers.map((finger,index) => {
      if(index == 0){
        return{
          sphereBase: { x: 0, z: 0 },
          middleJoint: { x: 0 },
          tipJoint: { x: 0 },
          fingerGroup: { z: 0 }
        }
      }
      else if(index == 3){
        return{
          sphereBase: { x: 0, z: 0 },
          middleJoint: { x: 0 },
          tipJoint: { x: 0 },
          fingerGroup: { z: 0 }
        }
      }
      else{
        return{
          sphereBase: { x: 1.05, z: 0 },
          middleJoint: { x: Math.PI / 2 },
          tipJoint: { x: Math.PI / 2 },
          fingerGroup: { z: 0 }
        }
      }
    }),
    sphereBase: { z: 0 },
    tipJoint: { z: 0 },
    thumbGroup: { z: 0 }
  };

  animateFingerJoints(targetRotations, 500);
});

btnMiddleFinger.addEventListener("click", () =>{

  const targetRotations = {
    fingers: fingers.map((finger,index) => {
      if(index == 1){
        return{
          sphereBase: { x: 0, z: 0 },
          middleJoint: { x: 0 },
          tipJoint: { x: 0 },
          fingerGroup: { z: 0 }
        }
      }
      else{
        return{
          sphereBase: { x: 1.05, z: 0 },
          middleJoint: { x: Math.PI / 2 },
          tipJoint: { x: Math.PI / 2 },
          fingerGroup: { z: 0 }
        }
      }
    }),
    sphereBase: { z: 0 },
    tipJoint: { z: 0 },
    thumbGroup: { z: 0 }
  };

  animateFingerJoints(targetRotations, 500);
});

btnStarLordMiddleFinger.addEventListener("click", () =>{

  const targetRotations = {
    fingers: fingers.map((finger,index) => {
      if(index == 1){
        return{
          sphereBase: { x: 0, z: 0 },
          middleJoint: { x: 0 },
          tipJoint: { x: 0 },
          fingerGroup: { z: 0 }
        }
      }
      else{
        return{
          sphereBase: { x: 1.05, z: 0 },
          middleJoint: { x: Math.PI / 2 },
          tipJoint: { x: Math.PI / 2 },
          fingerGroup: { z: 0 }
        }
      }
    }),
    sphereBase: { z: 0 },
    tipJoint: { z: 0 },
    thumbGroup: { z: 0 }
  };

  animateFingerJoints(targetRotations, 8000);
});

btnET.addEventListener("click", () =>{
  const targetRotations = {
    fingers: fingers.map(() => ({
        sphereBase: { x: 0, z: 0 },
        middleJoint: { x: 0 },
        tipJoint: { x: 0 },
        fingerGroup: { z: 0 }
    })),
    sphereBase: { z: 0 },
    tipJoint: { z: 0 },
    thumbGroup: { z: 0 }
  };

  animateFingerJoints(targetRotations, 500);
  animatePalm({palm: {x: 0, y: 0}}, 500);

  const targetRotations2 = {
    fingers: fingers.map((finger,index) => {
      if(index == 0){
        return{
          sphereBase: { x: 0.3, z: 0 },
          middleJoint: { x: 0.47 },
          tipJoint: { x: 0.24 },
          fingerGroup: { z: 0 }
        }
      }
      else if(index == 1){
        return{
          sphereBase: { x: 0.64, z: 0 },
          middleJoint: { x: 0.88 },
          tipJoint: { x: 0.61 },
          fingerGroup: { z: 0 }
        }
      }
      else if(index == 2){
        return{
          sphereBase: { x: 1.05, z: 0 },
          middleJoint: { x: 0.82 },
          tipJoint: { x: 0.66 },
          fingerGroup: { z: 0 }
        }
      }
      else if(index == 3){
        return{
          sphereBase: { x: 1.05, z: 0 },
          middleJoint: { x: Math.PI / 2 },
          tipJoint: { x: 1.4 },
          fingerGroup: { z: 0 }
        }
      }
    }),
    sphereBase: { z: -0.41 },
    tipJoint: { z: -1.14 },
    thumbGroup: { z: 0 }
  };

  animatePalm({palm: {x: 0, y: 3.04}}, 1000);

  setTimeout(() => {
    animateFingerJoints(targetRotations2, 2000);
    animatePalm({palm: {x: -0.67, y: 3.04}}, 2000);
  }, 1200);
});

btnReset.addEventListener("click", () =>{
  const targetRotations = {
    fingers: fingers.map(() => ({
        sphereBase: { x: 0, z: 0 },
        middleJoint: { x: 0 },
        tipJoint: { x: 0 },
        fingerGroup: { z: 0 }
    })),
    sphereBase: { z: 0 },
    tipJoint: { z: 0 },
    thumbGroup: { z: 0 }
  };

  animateFingerJoints(targetRotations, 500);
  animatePalm({palm: {x: 0, y: 0}}, 500);
});
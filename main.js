// Import Three.js and dependencies
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x4b46b2 );
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 10);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Orbit controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

// Materials
const material = new THREE.MeshBasicMaterial( {color: 0xcfa887} ); 
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x020202 });

// Palm
const palm = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 0.3), material);
palm.position.set(0, -1.5, 0);

const thumbpalm = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 0.3), material);
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
    const baseSegment = new THREE.Mesh(new THREE.CylinderGeometry( fingerWidth, fingerWidth, fingerLength, 32 ), material);
		baseSegment.position.y = fingerLength / 2;

		const sphereBase = new THREE.Mesh(new THREE.SphereGeometry(fingerWidth), sphereMaterial);
    sphereBase.add(baseSegment);
		sphereBase.position.y = 0;

		baseJoint.add(sphereBase);
		baseJoint.position.y = fingerLength;
    fingerGroup.add(baseJoint);

    // Finger middle joint
    const middleJoint = new THREE.Group();
    const middleSegment = new THREE.Mesh(new THREE.CylinderGeometry( fingerWidth, fingerWidth, fingerLength, 32 ), material);
    middleSegment.position.y = fingerLength / 2;

		const sphereMiddle1 = new THREE.Mesh(new THREE.SphereGeometry(fingerWidth), sphereMaterial);
    sphereMiddle1.add(middleSegment);
		sphereMiddle1.position.y = 0;

    middleJoint.add(sphereMiddle1);
    middleJoint.position.y = fingerLength;
    sphereBase.add(middleJoint);

    // Finger tip joint
    const tipJoint = new THREE.Group();
    const tipSegment = new THREE.Mesh(new THREE.CylinderGeometry( fingerWidth, fingerWidth, fingerLength, 32 ), material);
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

    // Position finger group relative to palm
    fingerGroup.position.set((i - 1.5) * fingerSpacing, 0, 0);
    palm.add(fingerGroup);
    fingerGroup.position.y = 0.3;
    fingers.push({ fingerGroup, sphereBase, middleJoint, tipJoint });
}

// Thumb base joint
const thumbGroup = new THREE.Group();

const baseJoint = new THREE.Group();
const baseSegment = new THREE.Mesh(new THREE.CylinderGeometry( fingerWidth, fingerWidth, fingerLength, 32 ), material);
baseSegment.position.y = fingerLength / 2;

const sphereBase = new THREE.Mesh(new THREE.SphereGeometry(fingerWidth), sphereMaterial);
sphereBase.add(baseSegment);
sphereBase.position.y = 0;

baseJoint.add(sphereBase);
baseJoint.position.y = fingerLength;
thumbGroup.add(baseJoint);

// Thumb tip joint
const tipJoint = new THREE.Group();
const tipSegment = new THREE.Mesh(new THREE.CylinderGeometry( fingerWidth, fingerWidth, fingerLength, 32 ), material);
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

// Position finger group relative to palm
thumbpalm.add(thumbGroup);
thumbGroup.position.set(-0.3, -0.2, 0);
thumbGroup.rotateY(-0.5)

// GUI setup
const gui = new GUI();

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
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
const material = new THREE.MeshBasicMaterial( {color: 0xbf9b9b} ); 
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x020202 });

// Palm
const palm = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 0.5), material);
palm.position.set(0, -2, 0);
scene.add(palm);

// Finger parameters
const fingerLength = 0.8;
const fingerWidth = 0.15;
const fingerSpacing = 0.4;
const fingers = [];

// Create fingers
for (let i = 0; i < 5; i++) {
    const fingerGroup = new THREE.Group();

    // Finger base joint
		const baseJoint = new THREE.Group();
    const baseSegment = new THREE.Mesh(new THREE.CylinderGeometry( fingerWidth, fingerWidth, fingerLength, 32 ), material);

		const sphereBase = new THREE.Mesh(new THREE.SphereGeometry(fingerWidth), sphereMaterial);
    sphereBase.position.y = -0.4;
    baseSegment.add(sphereBase);

    baseSegment.position.y = fingerLength / 2;
		baseJoint.add(baseSegment);
		baseJoint.position.y = fingerLength;
    fingerGroup.add(baseJoint);

    // Finger middle joint
    const middleJoint = new THREE.Group();
    const middleSegment = new THREE.Mesh(new THREE.CylinderGeometry( fingerWidth, fingerWidth, fingerLength, 32 ), material);
    middleSegment.position.y = fingerLength / 2;

		const sphereMiddle1 = new THREE.Mesh(new THREE.SphereGeometry(fingerWidth), sphereMaterial);
    sphereMiddle1.position.y = -0.4;
    middleSegment.add(sphereMiddle1);

    middleJoint.add(middleSegment);
    middleJoint.position.y = fingerLength;
    baseSegment.add(middleJoint);

    // Finger tip joint
    const tipJoint = new THREE.Group();
    const tipSegment = new THREE.Mesh(new THREE.CylinderGeometry( fingerWidth, fingerWidth, fingerLength, 32 ), material);
    tipSegment.position.y = fingerLength / 2;

		const fingertip = new THREE.Mesh(new THREE.SphereGeometry(fingerWidth), sphereMaterial);
    fingertip.position.y = fingerLength / 2;
    tipSegment.add(fingertip);
		
		const sphereMiddle2 = new THREE.Mesh(new THREE.SphereGeometry(fingerWidth), sphereMaterial);
    sphereMiddle2.position.y = -0.4;
    tipSegment.add(sphereMiddle2);

    tipJoint.add(tipSegment);
    tipJoint.position.y = fingerLength;
    middleSegment.add(tipJoint);

    // Position finger group relative to palm
    fingerGroup.position.set((i - 2) * fingerSpacing, 0, 0);
    palm.add(fingerGroup);
    fingers.push({ fingerGroup, baseJoint, middleJoint, tipJoint });
}

// GUI setup
const gui = new GUI();
fingers.forEach((finger, index) => {
    const folder = gui.addFolder(`Finger ${index + 1}`);
    folder.add(finger.baseJoint.rotation, 'x', 0, Math.PI / 2, 0.01).name('Base Curl');
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
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
const material = new THREE.MeshStandardMaterial({ color: 0xe7a183 });
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xe7a183 });

// Palm
const palm = new THREE.Mesh(new THREE.BoxGeometry(2, 1, 1), material);
palm.position.set(0, -2, 0);
scene.add(palm);

// Finger parameters
const fingerLength = 1;
const fingerWidth = 0.3;
const numFingers = 5;
const fingerSpacing = 0.4;
const fingers = [];

// Create fingers
for (let i = 0; i < numFingers; i++) {
    const fingerGroup = new THREE.Group();

    // Finger base segment
    const baseSegment = new THREE.Mesh(new THREE.BoxGeometry(fingerWidth, fingerLength, fingerWidth), material);
    baseSegment.position.y = fingerLength / 2;
    fingerGroup.add(baseSegment);

    // Finger middle joint
    const middleJoint = new THREE.Group();
    const middleSegment = new THREE.Mesh(new THREE.BoxGeometry(fingerWidth, fingerLength, fingerWidth), material);
    middleSegment.position.y = fingerLength / 2;
    middleJoint.add(middleSegment);
    middleJoint.position.y = fingerLength;
    baseSegment.add(middleJoint);

    // Finger tip joint
    const tipJoint = new THREE.Group();
    const tipSegment = new THREE.Mesh(new THREE.BoxGeometry(fingerWidth, fingerLength / 2, fingerWidth), material);
    tipSegment.position.y = fingerLength / 4;
    tipJoint.add(tipSegment);
    tipJoint.position.y = fingerLength;
    middleSegment.add(tipJoint);

    // Fingertip (sphere)
    const fingertip = new THREE.Mesh(new THREE.SphereGeometry(fingerWidth / 1.9), sphereMaterial);
    fingertip.position.y = fingerLength / 4;
    tipSegment.add(fingertip);

    // Position finger group relative to palm
    fingerGroup.position.set((i - 2) * fingerSpacing, 0.5, 0);
    palm.add(fingerGroup);
    fingers.push({ fingerGroup, baseSegment, middleJoint, tipJoint });
}

// GUI setup
const gui = new GUI();
fingers.forEach((finger, index) => {
    const folder = gui.addFolder(`Finger ${index + 1}`);
    folder.add(finger.baseSegment.rotation, 'x', -Math.PI / 2, Math.PI / 2, 0.01).name('Base Curl');
    folder.add(finger.middleJoint.rotation, 'x', -Math.PI / 2, Math.PI / 2, 0.01).name('Middle Curl');
    folder.add(finger.tipJoint.rotation, 'x', -Math.PI / 2, Math.PI / 2, 0.01).name('Tip Curl');
    folder.add(finger.fingerGroup.rotation, 'z', -Math.PI / 4, Math.PI / 4, 0.01).name('Side Angle');
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
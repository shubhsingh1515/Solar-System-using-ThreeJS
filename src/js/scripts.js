import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Import textures
import starsTexture from "../img/stars.jpg";
import sunTexture from "../img/sun.jpeg";
import mercuryTexture from "../img/mercury.jpg";
import venusTexture from "../img/venus.jpg";
import earthTexture from "../img/earth.jpg";
import marsTexture from "../img/mars.jpg";
import jupiterTexture from "../img/jupiter.jpg";
import saturnTexture from "../img/saturn.jpg";
import saturnRingTexture from "../img/saturn ring.png";
import uranusTexture from "../img/uranus.jpeg";
import uranusRingTexture from "../img/uranus ring.png";
import neptuneTexture from "../img/neptune.jpg";
import plutoTexture from "../img/pluto.jpg";

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  2000
);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-90, 140, 140);
orbit.update();

// Ambient light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// Point light for the sun glow
const pointLight = new THREE.PointLight(0xffffff, 2, 3000);
pointLight.position.set(0, 0, 0); // Light from the sun's position
scene.add(pointLight);

// Texture loader for stars background
const textureLoader = new THREE.TextureLoader();

// Apply starry background texture (optional)
const starryBackground = textureLoader.load(starsTexture);
scene.background = starryBackground;

// Sun geometry with glow effect
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
  map: textureLoader.load(sunTexture),
});
const sun = new THREE.Mesh(sunGeo, sunMat);
scene.add(sun);

// Add random stars to the background
function createStars(count) {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];

  for (let i = 0; i < count; i++) {
    const x = (Math.random() - 0.5) * 3000;
    const y = (Math.random() - 0.5) * 3000;
    const z = -Math.random() * 3000;
    vertices.push(x, y, z);
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(vertices, 3)
  );

  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 6,
    sizeAttenuation: true,
    transparent: false,
  });

  const stars = new THREE.Points(geometry, starMaterial);
  scene.add(stars);
}

// Create a dense starfield
createStars(8000);

// Function to create planets and rings
function createPlanet(size, texture, position, ring) {
  const geo = new THREE.SphereGeometry(size, 30, 30);
  const mat = new THREE.MeshStandardMaterial({
    map: textureLoader.load(texture),
  });
  const mesh = new THREE.Mesh(geo, mat);
  const obj = new THREE.Object3D();
  obj.add(mesh);

  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: textureLoader.load(ring.texture),
      side: THREE.DoubleSide,
      transparent: true, // Add transparency for realistic rings
      opacity: 0.8,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(position, 0, 0); // Set ring position correctly
    ringMesh.rotation.x = -0.5 * Math.PI;
    obj.add(ringMesh);
  }

  scene.add(obj);
  mesh.position.x = position;
  return { mesh, obj };
}

// Planets
const mercury = createPlanet(4.2, mercuryTexture, 28);
const venus = createPlanet(5.8, venusTexture, 44);
const earth = createPlanet(6, earthTexture, 62);
const mars = createPlanet(5, marsTexture, 78);
const jupiter = createPlanet(12, jupiterTexture, 100);
const saturn = createPlanet(10, saturnTexture, 138, {
  innerRadius: 10,
  outerRadius: 20,
  texture: saturnRingTexture,
});
const uranus = createPlanet(7, uranusTexture, 176, {
  innerRadius: 7,
  outerRadius: 12,
  texture: uranusRingTexture,
});
const neptune = createPlanet(7, neptuneTexture, 200);
const pluto = createPlanet(3.2, plutoTexture, 216);

// Camera auto movement
let angle = 0;
function updateCamera() {
  angle += 0.001;
  camera.position.x = 140 * Math.sin(angle);
  camera.position.z = 140 * Math.cos(angle);
  camera.lookAt(0, 0, 0);
}

// Animation loop
function animate() {
  // Self-rotation
  sun.rotateY(0.004);
  mercury.mesh.rotateY(0.004);
  venus.mesh.rotateY(0.002);
  earth.mesh.rotateY(0.02);
  mars.mesh.rotateY(0.018);
  jupiter.mesh.rotateY(0.04);
  saturn.mesh.rotateY(0.038);
  uranus.mesh.rotateY(0.03);
  neptune.mesh.rotateY(0.032);
  pluto.mesh.rotateY(0.008);

  // Around-sun rotation
  mercury.obj.rotateY(0.04);
  venus.obj.rotateY(0.02);
  earth.obj.rotateY(0.01);
  mars.obj.rotateY(0.008);
  jupiter.obj.rotateY(0.006);
  saturn.obj.rotateY(0.009);
  uranus.obj.rotateY(0.004);
  neptune.obj.rotateY(0.006);
  pluto.obj.rotateY(0.008);

  updateCamera();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// Resize handling
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

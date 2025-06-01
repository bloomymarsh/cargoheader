// header changes
const headerTexts = [
  "Bloomy ✦ Marsh",
  // "Bloomy ☾ Marsh",
  // "Bloomy ✮ Marsh",
  // "Bloomy ☽ Marsh",
  "Bloomy ✧ Marsh"
  //   "Bloody ✦ Mary",
  //   "Broom ✦ Mop",
  //   "Bright ✦ Moon",
  //   "Bulan ✦ Matahari",
  //   "Big ✦ Meteor",
  //   "Butter ✦ Milk",
  //   "Body ✦ Mist",
  //   "Blue ✦ Mountain"
];

let currentIndex = 0;

// Function to update the header text
function updateHeaderText() {
  const headerElement = document.getElementById("dynamic-header");

  // Update the text content
  headerElement.textContent = headerTexts[currentIndex];

  // Move to the next index, loop back if at the end
  currentIndex = (currentIndex + 1) % headerTexts.length;
}

// Call the function every second
setInterval(updateHeaderText, 1000);

// DRAGGABLE OBJECT
const slides = document.querySelectorAll(".avatars img");
const slideText = document.getElementById("avatarText");
let slideIndex = 0;

// Ensure there's at least one slide before applying the class
if (slides.length > 0) {
  slides[slideIndex].classList.add("displaySlide");
  slideText.textContent = slides[slideIndex].alt; // Use the alt attribute from the img element
}

function showSlide(index) {
  if (index >= slides.length) {
    slideIndex = 0;
  } else if (index < 0) {
    slideIndex = slides.length - 1;
  }

  slides.forEach((slide) => {
    slide.classList.remove("displaySlide");
  });
  slides[slideIndex].classList.add("displaySlide");
  slideText.textContent = slides[slideIndex].alt; // Update text to match the current slide's alt attribute
}

function prevSlide() {
  slideIndex--;
  showSlide(slideIndex);
}

function nextSlide() {
  slideIndex++;
  showSlide(slideIndex);
}

function togglePopup() {
  var modal = document.getElementById("modal");
  modal.classList.toggle("show"); /* Toggle visibility of the modal */
}

// Ensure the DOM has loaded before adding event listeners
document.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".prev").addEventListener("touchend", (e) => {
    e.stopPropagation(); // Prevent interference from drag events
    prevSlide();
  });

  document.querySelector(".next").addEventListener("touchend", (e) => {
    e.stopPropagation();
    nextSlide();
  });
});

// START DRAGGING
let draggableElem = document.getElementById("avatars-container");
let initialX = 0,
  initialY = 0;
let moveElement = false;
let translateX = 0,
  translateY = 0;

//Events Object
let events = {
  mouse: {
    down: "mousedown",
    move: "mousemove",
    up: "mouseup"
  },
  touch: {
    down: "touchstart",
    move: "touchmove",
    up: "touchend"
  }
};

// Detect touch device
const isTouchDevice = () =>
  "ontouchstart" in window || navigator.maxTouchPoints;

let deviceType = isTouchDevice() ? "touch" : "mouse";
("use strict");

function main() {
  const canvas = document.querySelector("#c");
  const canvasHover = document.getElementById('canvas-hover');
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true // Enables transparency
  });
  renderer.setClearColor(0x000000, 0);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(1, 0.5, 3); // Move back to avoid distortions

  const controls = new THREE.OrbitControls(camera, canvas);

  const scene = new THREE.Scene();
  scene.background = null;

  // Ambient Lighting
  var light = new THREE.DirectionalLight(0x404040, 15);
  scene.add(light);
  light.castShadows = true;

  const gltfLoader = new THREE.GLTFLoader();
  gltfLoader.load(
    "https://raw.githubusercontent.com/bloomymarsh/bloomymarsh.github.io/refs/heads/main/dino.glb",
    (gltf) => {
      const root = gltf.scene;
      root.position.set(0, 0, 0);
      scene.add(root);

      // === Add after scene.add(root); ===
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let timeoutId = null;

canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(root, true); // 'true' checks all children

  if (intersects.length > 0) {
    canvasHover.style.display = 'block';
    canvasHover.style.left = event.clientX + 10 + 'px';
    canvasHover.style.top = event.clientY + 10 + 'px';

    clearTimeout(timeoutId); // Prevent multiple timers
    timeoutId = setTimeout(() => {
      canvasHover.style.display = 'none';
    }, 2000);
  }
});

      // compute the box that contains all the stuff
      // from root and below
      const box = new THREE.Box3().setFromObject(root);

      const boxSize = box.getSize(new THREE.Vector3()).length();
      const boxCenter = box.getCenter(new THREE.Vector3());

      // update the Trackball controls to handle the new size
      controls.maxDistance = boxSize * 2;
      controls.target.copy(boxCenter);
      controls.update();
    }
  );

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render() {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    controls.autoRotate = true;
    controls.update();

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();

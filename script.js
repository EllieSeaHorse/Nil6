// script.js
let scene, camera, renderer;
let cubes = [];
let scrollPosition = 0;
let currentScroll = window.scrollY
init();

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 20, 0);
    camera.lookAt(new THREE.Vector3(0, 0, camera.position.z)); // Look at the point (0, 0, 0)

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    for (let i = 0; i < 10; i++) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 0, i*10);
        cubes.push(cube);
        scene.add(cube);
    }

    window.addEventListener('wheel', onScroll);

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // const nearestPosition = Math.round(scrollPosition / 1) * 1;
    // camera.position.z = nearestPosition < 0 ? Math.max(nearestPosition, -45) : 0;

    renderer.render(scene, camera);
}

let prevScrollY = 0;
let targetCameraZ = 0; // Initial camera Z position
const cameraSpeed = 0.07; // Adjust the speed of camera movement

function onScroll(event) {
    const halfWindowHeight = window.innerHeight * 0.5;

    if (scrollY-prevScrollY > halfWindowHeight ) {
        prevScrollY += window.innerHeight;
        targetCameraZ += 10;
        console.log('Scroll position exceeded half of the window height.');
    } else if (prevScrollY-scrollY > halfWindowHeight ) {
        prevScrollY -= window.innerHeight;
        targetCameraZ -= 10;
        console.log('Scroll position went back below half of the window height.');
     }

    camera.position.z += (targetCameraZ - camera.position.z) * cameraSpeed;


    // console.log(`currentVar: ${currentScroll}`)
    // console.log(`ScrollY: ${scrollY}`)
    // console.log(`Height: ${window.innerHeight/2}`)
    //
    //
    //
    // if (currentScroll < scrollY && scrollY > (window.innerHeight/2)){
    //     currentScroll += window.innerHeight;
    //     console.log(currentScroll)
    // }
    // else {
    //     currentScroll -= window.innerHeight;
    // }
    scrollPosition += event.deltaY;
}

window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    // Update camera aspect ratio and renderer size
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
});
// script.js
let scene, camera, renderer;
let cubes = [];
let scrollPosition = 0;
let currentScroll = window.scrollY
init();


function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 10, 0);
    camera.lookAt(new THREE.Vector3(0, 0, camera.position.z)); // Look at the point (0, 0, 0)

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // const ambientLight = new THREE.PointLight(0xffffff, 1);
    // scene.add(ambientLight);
    // ambientLight.position.set(0, 10, camera.position.z)
    //
    pointLight = new THREE.PointLight(0xffffff, 3, 60);
    pointLight.position.set(0, 4, 0);
    scene.add(pointLight);

    const directionalLight2 = new THREE.DirectionalLight(0xff00ff, 0.3);
directionalLight2.position.set(2, 2, 0);

scene.add(directionalLight2);


    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('touchmove', onMouseMove);



    for (let i = 0; i < 10; i++) {
        const geometry = new THREE.BoxGeometry(i, 1, 1);
        const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(0, 0, i*10);
        cubes.push(cube);
        scene.add(cube);
    }
    window.addEventListener('scroll', onScroll);
    loadGeometries()
    animate();

}

function onMouseMove(event) {
    // Change light color based on mouse position


    event.preventDefault();
    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    const clientY = event.clientY || (event.touches && event.touches[0].clientY);

    if (clientX !== undefined && clientY !== undefined) {
        const mouseX = (clientX / window.innerWidth) * 2 - 1;
        const mouseY = (clientY / window.innerHeight) * 2 + 1 ;

        // Update light direction based on mouse or touch position
        // const newDirection = new THREE.Vector3(mouseX, 5 , );
        const color = new THREE.Color(mouseX +1, mouseX-1, mouseY +1);
        pointLight.color = color;
        pointLight.position.x = mouseX;
    }
}


function loadGeometries() {


    let materialholo;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load('holo2.png', (texture) => {
        materialholo = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 1,
            roughness: 0.2,
        });
    });

    const torus = new THREE.TorusGeometry(2.3, 0.1, 100, 100);
    const shape = new THREE.Mesh(torus, materialholo);
    shape.position.set (0, 0, 0)
    shape.rotation.set(Math.PI / 2, 0, 0)

    scene.add(shape);
    animate()

    const loader = new THREE.ObjectLoader();
    const geometries = [


        {
            path: 'Models/model(11).json',
            position: new THREE.Vector3(0, 3, 12),
            scale: new THREE.Vector3(1.5, 1.5, 1.5),
            rotation: new THREE.Euler(Math.PI , 0, 0),
            name: 'bill'
        },

        {
            path: 'Models/model(13).json',
            position: new THREE.Vector3(0, 3, 21),
            scale: new THREE.Vector3(2, 2, 2),
            rotation: new THREE.Euler(Math.PI, 0, 0),
            name: 'sofa'
        }

    ];


    geometries.forEach(geo => {
        loader.load(geo.path, (loadedObject) => {
            const mesh = new THREE.Mesh(loadedObject.geometry, materialholo);
            mesh.position.copy(geo.position);
            mesh.scale.copy(geo.scale);
            mesh.rotation.copy(geo.rotation);
            mesh.name = geo.name;

            scene.add(mesh);
        });
    });
}


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);

    scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
            object.rotation.z += Math.random() * 0.01; // Adjust rotation speed as needed
        }

    });
}

let prevScrollY = 0;
let targetCameraZ = 0; // Initial camera Z position
const cameraSpeed = 0.3; // Adjust the speed of camera movement

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
    // else if (scrollY > prevScrollY ){
    //     camera.position.z += (camera.position.z) * 0.01
    //     console.log('Else.');
    // }
    // else if (scrollY < prevScrollY ){
    //     camera.position.z -= (camera.position.z) * 0.01
    //     console.log('Else if.');
    // }


    camera.position.z += (targetCameraZ - camera.position.z) * cameraSpeed;
    pointLight.position.z = (targetCameraZ - camera.position.z) * (cameraSpeed/5);




    // scrollPosition += event.deltaY;
}

window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    // Update camera aspect ratio and renderer size
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(newWidth, newHeight);
});
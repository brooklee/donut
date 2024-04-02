import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0xEFB6DA );

/**
 * Models
 */
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null
let donuts = []

// gltfLoader.load(
//     '/models/dounut-sm.glb',
//     (gltf) =>
//     {
//         gltf.scene.scale.set(5, 5, 5)
//         gltf.scene.position.set(1, 1, -2)
//         gltf.scene.rotation.set(1, -10, 1 )

//         scene.add(gltf.scene)
//         donut = gltf.scene // Store the loaded scene in the higher scoped variable
//     }
// )

function loadModel(position, scale, rotation) {
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    loader.load('/models/dounut-sm.glb', (gltf) => {
        gltf.scene.scale.set(scale.x, scale.y, scale.z);
        gltf.scene.position.set(position.x, position.y, position.z);
        gltf.scene.rotation.set(rotation.x, rotation.y, rotation.z);

        scene.add(gltf.scene);
        donuts.push(gltf.scene); // Store the loaded donut for later access
    });
}
// function loadModel(position, scale, rotation) {
//     const gltfLoader = new THREE.GLTFLoader();
//     gltfLoader.setDRACOLoader(dracoLoader)

//     gltfLoader.load('/models/dounut-sm.glb', (gltf) => {
//         gltf.scene.scale.set(scale.x, scale.y, scale.z);
//         gltf.scene.position.set(position.x, position.y, position.z);
//         gltf.scene.rotation.set(rotation.x, rotation.y, rotation.z);

//         scene.add(gltf.scene);
//     });
// }

// Define positions, scales, and rotations for each instance
const modelsProperties = [
    {
        position: { x: 1, y: 1, z: -2 },
        scale: { x: 5, y: 5, z: 5 },
        rotation: { x: 1, y: -10, z: 1 }
    },
    // Add different properties for the other 5 instances here
    // Example:
    {
        position: { x: -3, y: -2, z: 5 },
        scale: { x: 3, y: 3, z: 3 },
        rotation: { x: 0, y: -10, z: 0 }
    },

    {
        position: { x: 2, y: 9, z: -5 },
        scale: { x: 6, y: 6, z: 6 },
        rotation: { x: 0, y: Math.PI, z: 0 }
    },

    {
        position: { x: -4, y: 7, z: -9 },
        scale: { x: 2, y: 2, z: 2 },
        rotation: { x: 0, y: -10, z: -7 }
    },
    // lrg right
    {
        position: { x: -2, y: 2, z: 8 },
        scale: { x: 5, y: 5, z: 5 },
        rotation: { x: 0, y: Math.PI, z: -7 }
    },
    {
        position: { x: -10, y: 2, z: -5 },
        scale: { x: 2, y: 2, z: 2 },
        rotation: { x: 0, y: -10, z: 7 }
    },

    {
        position: { x: -10, y: -8, z: -10 },
        scale: { x: 4, y: 4, z: 4 },
        rotation: { x: 0, y: -10, z: 0 }
    }
   
];

// Load all instances with their specific properties
modelsProperties.forEach(props => {
    loadModel(props.position, props.scale, props.rotation);
});


/**
 * Floor
 */
// const floor = new THREE.Mesh(
//     new THREE.PlaneGeometry(50, 50),
//     new THREE.MeshStandardMaterial({
//         color: '#444444',
//         metalness: 0,
//         roughness: 0.5
//     })
// )
// floor.receiveShadow = true
// floor.rotation.x = - Math.PI * 0.5
// scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(- 8, 4, 8)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 1, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    

    // Rotate each donut
    donuts.forEach(donut => {
        donut.rotation.y += deltaTime * 0.5; // Adjust the rotation speed if needed
    });


    if(mixer)
    {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
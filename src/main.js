import GUI from 'lil-gui'
import './style.css'
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'



/**
 * Init
 */
const canvas = document.querySelector('.webgl-canvas')
const scene = new THREE.Scene()




/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200)
camera.position.z = 5
camera.position.x = 1
camera.position.y = 1.5



/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
const pointLight = new THREE.PointLight(0xffffff, 33)
pointLight.position.set(0, 2.1, 2.5)



/**
 * Helpers
 */
const axesHelper = new THREE.AxesHelper(4)
const pointLightHelper = new THREE.PointLightHelper( pointLight, 0.3 );





/**
 * Textures
*/
const textureLoader = new THREE.TextureLoader()

// Grass
const grassTexture = textureLoader.load("/textures/grass/grass_texture.png")
grassTexture.repeat.set(4, 4)
grassTexture.wrapS = THREE.RepeatWrapping
grassTexture.wrapT = THREE.RepeatWrapping
const grassNormal = textureLoader.load("/textures/grass/grass_normal_dx.png")
const grassDisplacement = textureLoader.load("/textures/grass/grass_height.png")
const grassRoughness = textureLoader.load("/textures/grass/grass_roughness.png")
const grassAmbientOcclusion = textureLoader.load("/textures/grass/grass_ao.png")

// Door
const doorTexture = textureLoader.load("/textures/door/door_texture.jpg")
const doorNormal = textureLoader.load("/textures/door/door_normal.jpg")
const doorAlpha = textureLoader.load("/textures/door/door_alpha.jpg")
const doorHeight = textureLoader.load("/textures/door/door_height.jpg")
const doorAo = textureLoader.load("/textures/door/door_ao.jpg")
const doorMetalness = textureLoader.load("/textures/door/door_metalness.jpg")
const doorRoughness = textureLoader.load("/textures/door/door_roughness.jpg")




/**
 * Materials
*/
const groundMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xa9c388,
  map: grassTexture,
  normalMap: grassNormal,
  roughnessMap: grassRoughness,
  roughness: 3,
  aoMap: grassAmbientOcclusion,
  aoMapIntensity: 0.6,
  // displacementMap: grassDisplacement,
  // displacementScale: 0.1
})
groundMaterial.side = THREE.DoubleSide

const doorMaterial = new THREE.MeshStandardMaterial({
  color: 0xA23B3B,
  map: doorTexture,
  normalMap: doorNormal,
  metalnessMap: doorMetalness,
  roughnessMap: doorRoughness,
  aoMap: doorAo,
  aoMapIntensity: 0.75,
  alphaMap: doorAlpha,
  transparent: true,
  // displacementMap: doorHeight,
  // displacementScale: 0.1
})


/**
 * Geometry
*/
const groundGeometry = new THREE.PlaneGeometry(20, 20)
groundGeometry.setAttribute('uv2', new THREE.BufferAttribute(groundGeometry.attributes.uv.array), 2)
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
ground.rotation.x = -Math.PI * 0.5

// House Geometry
const houseCube = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 4), new THREE.MeshStandardMaterial({ color: 0xd3715e}))
houseCube.position.y = 3 / 2 + 0.01
const houseRoof = new THREE.Mesh(new THREE.ConeGeometry(2 * Math.sqrt(2) + 0.5, 1.5, 4), new THREE.MeshStandardMaterial({ color: 0xa51c00 }))
houseRoof.position.y = 3 + 1.5/2
houseRoof.rotation.y = Math.PI * 0.25

// Door
const doorGeometry = new THREE.PlaneGeometry(2, 2)
doorGeometry.setAttribute('uv2', new THREE.BufferAttribute(doorGeometry.attributes.uv.array), 2)
const door = new THREE.Mesh(doorGeometry, doorMaterial)
door.position.set(0, 1.8 / 2, 2 + 0.01)



/**
 * Groups
*/
const house = new THREE.Group()
house.add(houseCube)
house.add(houseRoof)
house.add(door)
const graves = new THREE.Group()



/**
 * External Models
 */
const gltfLoader = new GLTFLoader()
gltfLoader.load(
  '/models/SphereBush.glb',
  (gltf) => {
    const bush = gltf.scene
    const scale = 0.3
    bush.scale.set(scale, scale, scale)
    bush.position.set(1.7, 0.1, 2.5)
    house.add(bush)

    const bush2 = bush.clone()
    const smallScale = 0.2
    bush2.scale.set(smallScale, smallScale, smallScale)
    bush2.position.set(0.9, 0.1, 2.5)
    house.add(bush2)
  }
)



/**
 * Add Graves
 */
const graveMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 })
const graveGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.2)
for(let i = 0; i < 30; i++){
  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  const angle = Math.random() * Math.PI * 2
  const radius = 3.4 + Math.random() * 6
  grave.position.set(Math.sin(angle) * radius, 0.3, Math.cos(angle) * radius)
  grave.rotation.y = (Math.random() - 0.5) * 0.4
  grave.rotation.x = (Math.random() - 0.5) * 0.3
  graves.add(grave)
}

/**
 * Scene Adds
 */
scene.add(camera)
scene.add(house)
scene.add(ambientLight)
scene.add(pointLight)
scene.add(axesHelper)
scene.add(ground)
scene.add(pointLightHelper)
scene.add(graves)



/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true




/**
 * Debug UI
 */
const gui = new GUI({ width: 400 })
const lightsGUI = gui.addFolder('Lights')
lightsGUI.add(pointLight, 'intensity', 1, 100, 1).name("PointLight Intensity")
lightsGUI.add(pointLight, 'distance', 0, 10, 0.01).name("PointLight Distance")
lightsGUI.add(pointLight, 'decay', 0, 5, 0.01).name("PointLight Decay")
lightsGUI.add(ambientLight, "intensity", 0.1, 1, 0.01).name("Ambient Intensity")
gui.add(groundMaterial, "aoMapIntensity", 0, 1, 0.01).name("Ground AO")
gui.add(groundMaterial, 'roughness', 0, 10, 0.01).name("Ground Roughness")
gui.add(doorMaterial, "aoMapIntensity", 0, 1, 0.01).name("Door AO")



/**
 * Render
 */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})

const animate = () => {
  renderer.render(scene, camera)
  controls.update()
  window.requestAnimationFrame(animate)
}

animate()
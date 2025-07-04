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
camera.position.z = 8
camera.position.x = 1
camera.position.y = 2



/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight("#ADA4EC", 0.11)
ambientLight.visible = true
const moonLight = new THREE.DirectionalLight("#ADA4EC", 0.25)
const pointLight = new THREE.PointLight("#FFF1A2", 1.3, 7.5, 0.7)
pointLight.position.set(0, 2.95, 2.15)
pointLight.visible = true


/**
 * Fog (native three.js)
 */
scene.fog = new THREE.Fog("#262837", 1, 15)

/**
 * Helpers
 */
const axesHelper = new THREE.AxesHelper(4)
axesHelper.visible = false
const pointLightHelper = new THREE.PointLightHelper( pointLight, 0.3 );
pointLightHelper.visible = false




/**
 * Textures
*/
const textureLoader = new THREE.TextureLoader()

// Grass
const grassTexture = textureLoader.load("/textures/grass/grass_texture.png")
grassTexture.repeat.set(4, 4)
grassTexture.wrapS = THREE.RepeatWrapping
grassTexture.wrapT = THREE.RepeatWrapping

const grassNormal = textureLoader.load("/textures/grass/grass_normal_gl.png")
grassNormal.repeat.set(4, 4)
grassNormal.wrapS = THREE.RepeatWrapping
grassNormal.wrapT = THREE.RepeatWrapping

const grassDisplacement = textureLoader.load("/textures/grass/grass_height.png")
grassDisplacement.repeat.set(4, 4)
grassDisplacement.wrapS = THREE.RepeatWrapping
grassDisplacement.wrapT = THREE.RepeatWrapping

const grassRoughness = textureLoader.load("/textures/grass/grass_roughness.png")
grassRoughness.repeat.set(4, 4)
grassRoughness.wrapS = THREE.RepeatWrapping
grassRoughness.wrapT = THREE.RepeatWrapping

const grassAmbientOcclusion = textureLoader.load("/textures/grass/grass_ao.png")
grassAmbientOcclusion.repeat.set(4, 4)
grassAmbientOcclusion.wrapS = THREE.RepeatWrapping
grassAmbientOcclusion.wrapT = THREE.RepeatWrapping

// Door
const doorTexture = textureLoader.load("/textures/door/door_texture.jpg")
const doorNormal = textureLoader.load("/textures/door/door_normal.jpg")
const doorAlpha = textureLoader.load("/textures/door/door_alpha.jpg")
const doorHeight = textureLoader.load("/textures/door/door_height.jpg")
const doorAo = textureLoader.load("/textures/door/door_ao.jpg")
const doorMetalness = textureLoader.load("/textures/door/door_metalness.jpg")
const doorRoughness = textureLoader.load("/textures/door/door_roughness.jpg")

// Stone
const stoneTexture = textureLoader.load("/textures/stone/stone_texture.jpg")
const stoneAo = textureLoader.load("/textures/stone/stone_ao.jpg")
const stoneNormal = textureLoader.load("/textures/stone/stone_normal.jpg")
const stoneRoughness = textureLoader.load("/textures/stone/stone_roughness.jpg")

// Wall
const wallTexture = textureLoader.load("/textures/walls/wall_texture.jpg")
const wallAo = textureLoader.load("/textures/walls/wall_ao.jpg")
const wallNormal = textureLoader.load("/textures/walls/wall_normal.jpg")
const wallRoughness = textureLoader.load("/textures/walls/wall_roughness.jpg")

// Roof
const roofTexture = textureLoader.load("/textures/roof/roof_texture.jpg")
roofTexture.center.set(0.5, 0.5)
roofTexture.rotation = Math.PI * 0.5
const roofNormal = textureLoader.load("/textures/roof/roof_normal.jpg")
const roofRoughness = textureLoader.load("/textures/roof/roof_roughness.jpg")



/**
 * Materials
*/
const groundMaterial = new THREE.MeshStandardMaterial({ 
  // color: 0xa9c388,
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
  map: doorTexture,
  normalMap: doorNormal,
  metalnessMap: doorMetalness,
  roughnessMap: doorRoughness,
  aoMap: doorAo,
  aoMapIntensity: 0.75,
  alphaMap: doorAlpha,
  transparent: true,
  displacementMap: doorHeight,
  displacementScale: 0.15
})

const wallMaterial = new THREE.MeshStandardMaterial({
  // color: "#999898",
  map: wallTexture,
  aoMap: wallAo,
  roughnessMap: wallRoughness,
  normalMap: wallNormal,
  side: 2
})

const roofMaterial = new THREE.MeshStandardMaterial({
  color: "#AF846C",
  map: roofTexture,
  normalMap: roofNormal,
  roughnessMap: roofRoughness,
  roughness: 3
})

/**
 * Geometry
*/
const groundGeometry = new THREE.PlaneGeometry(30, 30)
groundGeometry.setAttribute('uv2', new THREE.BufferAttribute(groundGeometry.attributes.uv.array), 2)
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
ground.rotation.x = -Math.PI * 0.5

// House Geometry
const houseGeometry = new THREE.BoxGeometry(4, 3, 4)
houseGeometry.setAttribute('uv2', new THREE.Float32BufferAttribute(houseGeometry.attributes.uv.array))
const houseCube = new THREE.Mesh(houseGeometry, wallMaterial)
houseCube.position.y = 3 / 2 + 0.01
const houseRoof = new THREE.Mesh(new THREE.ConeGeometry(2 * Math.sqrt(2) + 0.5, 1.5, 4), roofMaterial)
houseRoof.position.y = 3 + 1.5/2
houseRoof.rotation.y = Math.PI * 0.25

// Door
const doorGeometry = new THREE.PlaneGeometry(2.2, 2.2, 100, 100)
doorGeometry.setAttribute('uv2', new THREE.BufferAttribute(doorGeometry.attributes.uv.array), 2)
const door = new THREE.Mesh(doorGeometry, doorMaterial)
door.position.set(0, 2 / 2, 2 + 0.01)



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
const graveMaterial = new THREE.MeshStandardMaterial({
  map: stoneTexture,
  aoMap: stoneAo,
  normalMap: stoneNormal,
  roughnessMap: stoneRoughness
})
const graveGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.2)
graveGeometry.setAttribute('uv2', new THREE.Float32BufferAttribute(graveGeometry.attributes.uv.array))
for(let i = 0; i < 30; i++){
  const grave = new THREE.Mesh(graveGeometry, graveMaterial)
  const angle = Math.random() * Math.PI * 2
  const radius = 3.4 + Math.random() * 6
  grave.position.set(Math.sin(angle) * radius, 0.3, Math.cos(angle) * radius)
  // grave.rotation.y = (Math.random() - 0.5) * 0.4
  // grave.rotation.x = (Math.random() - 0.5) * 0.5
  graves.add(grave)
}


/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight("#ffff00", 2)
const ghost2 = new THREE.PointLight("#ff00ff", 2)
const ghost3 = new THREE.PointLight("#00ffff", 2)

const moveGhosts = (elapsedTime) => {
  const ghostAngle1 = elapsedTime * 0.4
  ghost1.position.x = Math.sin(ghostAngle1) * (4 + Math.sin(ghostAngle1 * 3) * 2)
  ghost1.position.z = Math.cos(ghostAngle1) * (4 + Math.cos(ghostAngle1 * 2) * 3)
  ghost1.position.y = Math.sin(ghostAngle1 * 10) + 0.3

  const ghostAngle2 = - elapsedTime * 0.7
  ghost2.position.x = Math.sin(ghostAngle2) * 6
  ghost2.position.z = Math.cos(ghostAngle2) * 6
  ghost2.position.y = Math.sin(ghostAngle2 * 7) + 0.3

  const ghostAngle3 = elapsedTime * 0.2
  ghost3.position.x = Math.sin(ghostAngle3) * 8
  ghost3.position.z = Math.cos(ghostAngle3) * 8
  ghost3.position.y = Math.sin(ghostAngle3 * 8) + 0.3
}

/**
 * Scene Adds
 */
scene.add(camera)
scene.add(house)
scene.add(ambientLight)
scene.add(pointLight)
scene.add(moonLight)
scene.add(axesHelper)
scene.add(ground)
scene.add(pointLightHelper)
scene.add(graves)
scene.add(ghost1, ghost2, ghost3)


/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxDistance = 15
controls.minDistance = 4
controls.minPolarAngle = 0
controls.maxPolarAngle = Math.PI * 0.495


/**
 * Debug UI
 */
const gui = new GUI({ width: 400 })
const lightsGUI = gui.addFolder('Lights')
lightsGUI.add(moonLight, 'intensity', 0, 2, 0.01).name("MoonLight Intensity")
lightsGUI.add(pointLight, 'intensity', 1, 5, 0.01).name("DoorLight Intensity")
lightsGUI.add(pointLight, 'distance', 0, 10, 0.01).name("DoorLight Distance")
lightsGUI.add(pointLight, 'decay', 0, 5, 0.01).name("DoorLight Decay")
lightsGUI.add(pointLight, 'visible').name("Turn OFF DoorLight")
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
renderer.setClearColor("#262837")

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight)
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
})


/**
 * Shadows
 */
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

// moonLight.castShadow = true
pointLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true

graves.children.forEach(child => child.castShadow = true)
houseCube.castShadow = true

ground.receiveShadow = true
// houseCube.receiveShadow = true

// Optimizations
pointLight.shadow.mapSize.width = 128
pointLight.shadow.mapSize.height = 128
ghost1.shadow.mapSize.width = 128
ghost1.shadow.mapSize.height = 128
ghost2.shadow.mapSize.width = 128
ghost2.shadow.mapSize.height = 128
ghost3.shadow.mapSize.width = 128
ghost3.shadow.mapSize.height = 128
// moonLight.shadow.mapSize.width = 128
// moonLight.shadow.mapSize.height = 128

/**
 * Tick Function
 */
const clock = new THREE.Clock()
const animate = () => {
  const randomChild = Math.floor(Math.random() * 30)
  graves.children[randomChild].lookAt(camera.position)

  const elapsedTime = clock.getElapsedTime()
  moveGhosts(elapsedTime)

  renderer.render(scene, camera)
  controls.update()
  window.requestAnimationFrame(animate)
}

animate()
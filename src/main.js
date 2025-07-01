import GUI from 'lil-gui'
import './style.css'
import * as THREE from "three"
import { OrbitControls } from "three/addons/controls/OrbitControls.js"



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
pointLight.position.set(3, 4, 3)



/**
 * Helpers
 */
const axesHelper = new THREE.AxesHelper(4)
const pointLightHelper = new THREE.PointLightHelper( pointLight, 0.3 );


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const grassTexture = textureLoader.load("/textures/grass/grass_texture.png")
grassTexture.repeat.set(2,2)
grassTexture.wrapS = THREE.RepeatWrapping
grassTexture.wrapT = THREE.RepeatWrapping
const grassNormal = textureLoader.load("/textures/grass/grass_normal_dx.png")
const grassDisplacement = textureLoader.load("/textures/grass/grass_height.png")
const grassRoughness = textureLoader.load("/textures/grass/grass_roughness.png")
const grassAmbientOcclusion = textureLoader.load("/textures/grass/grass_ao.png")


/**
 * Materials
 */
const groundMaterial = new THREE.MeshStandardMaterial({ 
  color: 0xa9c388,
  map: grassTexture,
  normalMap: grassNormal,
  roughnessMap: grassRoughness,
  roughness: 0.3,
  aoMap: grassAmbientOcclusion,
  aoMapIntensity: 0.6,
  // displacementMap: grassDisplacement,
  // displacementScale: 0.1
})
groundMaterial.side = THREE.DoubleSide



/**
 * Geometry
 */
const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial())
cube.position.y = 0.51
const groundGeometry = new THREE.PlaneGeometry(10, 10)
groundGeometry.setAttribute('uv2', new THREE.BufferAttribute(groundGeometry.attributes.uv.array), 2)
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
ground.rotation.x = -Math.PI * 0.5



/**
 * Groups
 */


/**
 * Scene Adds
 */
scene.add(camera)
scene.add(cube)
scene.add(ambientLight)
scene.add(pointLight)
scene.add(axesHelper)
scene.add(ground)
scene.add(pointLightHelper)



/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true




/**
 * Debug UI
 */
const gui = new GUI()
gui.add(pointLight, 'intensity', 1, 100, 1).name("PointLight Intensity")
gui.add(ambientLight, "intensity", 0.1, 1, 0.01)
gui.add(groundMaterial, "aoMapIntensity", 0, 1, 0.01)



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
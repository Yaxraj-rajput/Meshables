import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { ARButton } from "three/examples/jsm/webxr/ARButton";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { BokehPass } from "three/examples/jsm/postprocessing/BokehPass";
import hdri from "../assets/Models/illovo_beach_balcony_4k.hdr";
import model_bg from "../assets/Images/Sections/model_bg.png";

const ModelViewer = (props) => {
  const [shadow, setShadow] = useState(2);
  const [exposure, setExposure] = useState(7);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const mountRef = useRef(null);
  const [isWireframeOn, setIsWireframeOn] = useState(false);

  let renderer,
    camera,
    ambientLight,
    directionalLight,
    controls,
    scene,
    composer;
  const [autoRotate, setAutoRotate] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Explicitly set clear color to transparent
    renderer.shadowMap.enabled = true; // Enable shadows
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows
    renderer.physicallyCorrectLights = true; // Enable physically correct lighting
    renderer.xr.enabled = true; // Enable WebXR

    // Add post-processing effects
    composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.2, // Strength
      0.4, // Radius
      0.85 // Threshold
    );
    composer.addPass(bloomPass);

    const bokehPass = new BokehPass(scene, camera, {
      focus: 1,
      aperture: 0.025,
      maxblur: 0.00001,
      width: window.innerWidth,
      height: window.innerHeight,
    });
    composer.addPass(bokehPass);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
      // Add AR button if supported
      if ("xr" in navigator) {
        navigator.xr.isSessionSupported("immersive-ar").then((supported) => {
          if (supported) {
            document.body.appendChild(ARButton.createButton(renderer));
          } else {
            console.error("WebXR not supported");
          }
        });
      } else {
        console.error("WebXR not supported");
      }
    }

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    ambientLight = new THREE.AmbientLight(0xffffff, exposure);

    // set ambient light intensity

    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, shadow);
    directionalLight.position.set(5, 5, 5);
    directionalLight.intensity = 2;
    directionalLight.shadow.bias = -0.0001; // Adjust shadow bias
    directionalLight.shadow.mapSize.width = 2048; // Increase shadow resolution
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Load HDRI environment map
    new RGBELoader().load(hdri, (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      // scene.background = texture; // Optional: set the background to the HDRI
    });

    // Load background image as texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(model_bg, (texture) => {
      texture.repeat.set(2, 2); // Adjust the scale as needed
      scene.background = texture;
    });

    const loadModel = (url) => {
      let extension = url.split(".").pop().toLowerCase();
      extension = extension.split("?")[0]; // Remove query

      let loader;

      switch (extension) {
        case "glb":
        case "gltf":
          loader = new GLTFLoader();
          loader.load(url, (gltf) => {
            const model = gltf.scene;
            model.traverse((node) => {
              if (node.isMesh) {
                node.material.envMap = scene.environment; // Apply environment map to material
                node.material.needsUpdate = true; // Ensure material updates
                node.castShadow = true; // Enable shadows for the model
                node.receiveShadow = true; // Enable shadows for the model
                if (isWireframeOn) {
                  node.material = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    wireframe: true,
                  }); // Set wireframe color to white
                }
              }
            });
            scene.add(model);
            centerModel(model);
            setIsLoading(false);
          });
          break;
        case "obj":
          loader = new OBJLoader();
          loader.load(url, (obj) => {
            obj.traverse((node) => {
              if (node.isMesh) {
                node.material.envMap = scene.environment; // Apply environment map to material
                node.material.needsUpdate = true; // Ensure material updates
                node.castShadow = true; // Enable shadows for the model
                node.receiveShadow = true; // Enable shadows for the model
                if (isWireframeOn) {
                  node.material = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    wireframe: true,
                  }); // Set wireframe color to white
                }
              }
            });
            scene.add(obj);
            centerModel(obj);
            setIsLoading(false);
          });
          break;
        case "stl":
          loader = new STLLoader();
          loader.load(url, (geometry) => {
            const material = new THREE.MeshBasicMaterial({
              color: 0xffffff,
              wireframe: isWireframeOn, // Enable wireframe mode if isWireframeOn is true
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.castShadow = true; // Enable shadows for the model
            mesh.receiveShadow = true; // Enable shadows for the model
            scene.add(mesh);
            centerModel(mesh);
            setIsLoading(false);
          });
          break;
        default:
          console.error(`Unsupported file format: ${extension}`);
      }
    };

    const centerModel = (model) => {
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z);
      const desiredSize = 15;
      const scale = desiredSize / maxDimension;
      model.scale.set(scale, scale, scale);

      const newBox = new THREE.Box3().setFromObject(model);
      const newCenter = newBox.getCenter(new THREE.Vector3());

      model.position.set(-newCenter.x, -newCenter.y, -newCenter.z);

      const pivot = new THREE.Object3D();
      pivot.add(model);
      scene.add(pivot);

      controls.target.set(0, 0, 0);
      controls.update();
    };

    loadModel(props.model);

    camera.position.z = 15;

    const animate = () => {
      renderer.setAnimationLoop(() => {
        controls.update();

        // Multi-direction auto-rotate and zoom in/out
        if (autoRotate) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 1;
          controls.enableZoom = true;
        } else {
          controls.autoRotate = false;
          controls.enableZoom = false;
        }

        if (isPlaying) {
          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.5;
        }

        composer.render();
      });
    };

    animate();

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose(); // Dispose of the renderer to free up resources
      controls.dispose(); // Dispose of the controls
      scene = null;
      camera = null;
      renderer = null;
    };
  }, [props.model, isWireframeOn]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      if (renderer) {
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        composer.setSize(width, height);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [renderer, camera, composer]);

  useEffect(() => {
    if (directionalLight) {
      directionalLight.intensity = shadow;
    }
  }, [shadow]);

  return (
    <div className={`model_showcase ${isFullscreen ? "fullscreen" : ""}`}>
      <button
        className="full_screen_btn"
        onClick={() => {
          setIsFullscreen(!isFullscreen);
        }}
      >
        <i className="fas fa-expand"></i>
      </button>

      <div className="controls">
        <div className="play_pause">
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              // Implement play/pause functionality if needed
            }}
          >
            {isPlaying ? (
              <i className="fas fa-pause"></i>
            ) : (
              <i className="fas fa-play"></i>
            )}
          </button>
        </div>

        <button
          className="wireframe_btn"
          onClick={() => {
            setIsWireframeOn(!isWireframeOn);
          }}
        >
          <i className="fas fa-cube"></i>
        </button>

        <div className="colors">
          <span
            style={{ backgroundColor: "#181818" }}
            className="color_option active"
            onClick={() => {
              mountRef.current.style.backgroundColor = "#181818";
            }}
          ></span>
          <span
            style={{ backgroundColor: "white" }}
            className="color_option active"
            onClick={() => {
              mountRef.current.style.backgroundColor = "rgb(158,158,158)";
            }}
          ></span>
          <span
            style={{ backgroundColor: "black" }}
            className="color_option"
            onClick={() => {
              mountRef.current.style.backgroundColor = "black";
            }}
          ></span>
          <span
            style={{ backgroundColor: "grey" }}
            className="color_option"
            onClick={() => {
              mountRef.current.style.backgroundColor = "grey";
            }}
          ></span>
        </div>

        <div className="shadow_control">
          <span className="label">Shadow</span>
          <input
            type="range"
            min="0"
            max="5"
            step="0.01"
            value={shadow}
            onChange={(e) => setShadow(parseFloat(e.target.value))}
          />
        </div>
        <div className="shadow_control">
          <span className="label">Exposure</span>
          <input
            type="range"
            min="0"
            max="4"
            step="0.01"
            value={exposure}
            onChange={(e) => setExposure(parseFloat(e.target.value))}
          />
        </div>
      </div>

      <div className="model_viewer" ref={mountRef}>
        {isLoading && (
          <div className="loading">
            <div className="spinner"></div>
            <span>Loading Model</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelViewer;

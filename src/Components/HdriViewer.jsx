import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const HdriViewer = (props) => {
  const mountRef = useRef(null);
  const hdri = props.hdri;
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let scene, camera, renderer, controls;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(
      60, // Adjusted FOV to reduce distortion
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(200, 50, 5); // Set camera position

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Explicitly set clear color to transparent

    // set hdri texture
    const loader = new RGBELoader();
    loader.load(
      hdri,
      (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        setIsLoading(false); // Hide loading indicator once texture is loaded
      },
      undefined,
      (err) => {
        console.error("An error occurred loading the HDRI texture:", err);
        setIsLoading(false); // Hide loading indicator on error
      }
    );

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    scene.add(new THREE.AmbientLight(0xffffff, 1));

    // Initialize OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // Enable damping (inertia)
    controls.dampingFactor = 0.1; // Increased damping factor for smoother effect
    controls.screenSpacePanning = false; // Disable panning
    controls.target.set(0, 0, 0); // Set the target to the center of the scene
    controls.rotateSpeed = -0.1; // Adjusted rotate speed for smoother control

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Update controls
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      controls.dispose();
      renderer.dispose();
    };
  }, [hdri]);

  return (
    <div
      className={`HDRI_viewer ${isFullscreen ? "fullscreen" : ""}`}
      ref={mountRef}
    >
      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <span>Loading 3D Preview</span>
        </div>
      )}{" "}
      <button
        className="full_screen_btn"
        onClick={() => {
          setIsFullscreen(!isFullscreen);
        }}
      >
        <i className="fas fa-expand"></i>
      </button>
    </div>
  );
};

export default HdriViewer;

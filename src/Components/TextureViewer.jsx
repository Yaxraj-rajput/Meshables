import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const TextureViewer = ({ textures }) => {
  const mountRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [isTextureOn, setIsTextureOn] = useState([]);
  const sphereRef = useRef(null);
  const materialRef = useRef(null);

  const loadedTexturesRef = useRef({});

  // Handle isTextureOn change and update the material
  useEffect(() => {
    if (materialRef.current) {
      const {
        normalMap,
        bumpMap,
        displacementMap,
        metalnessMap,
        roughnessMap,
        aoMap,
        idMap,
      } = loadedTexturesRef.current;

      materialRef.current.normalMap = isTextureOn.includes("Normal")
        ? normalMap
        : null;
      materialRef.current.bumpMap = isTextureOn.includes("Bump")
        ? bumpMap
        : null;
      materialRef.current.displacementMap = isTextureOn.includes("Displacement")
        ? displacementMap
        : null;
      materialRef.current.metalnessMap = isTextureOn.includes("Metalness")
        ? metalnessMap
        : null;
      materialRef.current.roughnessMap = isTextureOn.includes("Roughness")
        ? roughnessMap
        : null;
      materialRef.current.aoMap = isTextureOn.includes("AmbientOcclusion")
        ? aoMap
        : null;
      materialRef.current.idMap = isTextureOn.includes("IDMAP") ? idMap : null;

      materialRef.current.needsUpdate = true;
    }
  }, [isTextureOn]);

  useEffect(() => {
    const mount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x181818);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Post-processing
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(mount.clientWidth, mount.clientHeight),
      1.5,
      0.4,
      0.85
    );
    composer.addPass(bloomPass);

    // Sphere Geometry
    const geometry = new THREE.SphereGeometry(1.5, 64, 64);

    // Texture Loader with Error Handling
    const textureLoader = new THREE.TextureLoader();

    const loadTexture = (path) => {
      return new Promise((resolve, reject) => {
        textureLoader.load(
          path,
          (texture) => resolve(texture),
          undefined,
          (error) => reject(error)
        );
      });
    };

    const loadAllTextures = async () => {
      try {
        const baseColorTexture = textures.baseColor
          ? await loadTexture(textures.baseColor)
          : null;
        const normalMapTexture = textures.normal
          ? await loadTexture(textures.normal)
          : null;
        const bumpMapTexture = textures.bump
          ? await loadTexture(textures.bump)
          : null;
        const displacementMapTexture = textures.displacement
          ? await loadTexture(textures.displacement)
          : null;
        const metalnessMapTexture = textures.metallic
          ? await loadTexture(textures.metallic)
          : null;
        const roughnessMapTexture = textures.roughness
          ? await loadTexture(textures.roughness)
          : null;
        const aoMapTexture = textures.ambientOcclusion
          ? await loadTexture(textures.ambientOcclusion)
          : null;
        const idMapTexture = textures.idmap
          ? await loadTexture(textures.idmap)
          : null;

        return {
          baseColorTexture,
          normalMapTexture,
          bumpMapTexture,
          displacementMapTexture,
          metalnessMapTexture,
          roughnessMapTexture,
          aoMapTexture,
          idMapTexture,
        };
      } catch (error) {
        console.error("Error loading textures:", error);
        return null;
      }
    };

    loadAllTextures().then((loadedTextures) => {
      if (!loadedTextures) {
        console.error("Failed to load textures");
        return;
      }

      const {
        baseColorTexture,
        normalMapTexture,
        bumpMapTexture,
        displacementMapTexture,
        metalnessMapTexture,
        roughnessMapTexture,
        aoMapTexture,
        idMapTexture,
      } = loadedTextures;

      // Store loaded textures in the ref for later toggling
      loadedTexturesRef.current = {
        normalMap: normalMapTexture,
        bumpMap: bumpMapTexture,
        displacementMap: displacementMapTexture,
        metalnessMap: metalnessMapTexture,
        roughnessMap: roughnessMapTexture,
        aoMap: aoMapTexture,
        idMap: idMapTexture,
      };

      // Material
      const material = new THREE.MeshStandardMaterial({
        map: baseColorTexture,
        roughness: 1,
        displacementScale: 0.1,
        metalness: 0.2,
        normalMap: normalMapTexture,
        bumpMap: bumpMapTexture,
        displacementMap: displacementMapTexture,
        metalnessMap: metalnessMapTexture,
        roughnessMap: roughnessMapTexture,
        aoMap: aoMapTexture,
        idMap: idMapTexture,
      });

      materialRef.current = material;

      // Mesh
      const sphere = new THREE.Mesh(geometry, material);
      sphereRef.current = sphere;
      scene.add(sphere);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      const pointLight = new THREE.PointLight(0xffffff, 1, 100);
      pointLight.position.set(-5, -5, -5);
      scene.add(pointLight);

      // Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.screenSpacePanning = false;

      // Apply render scale
      const renderScale = 1.5; // Adjust this value as needed (e.g., 0.5 for half resolution)
      renderer.setPixelRatio(window.devicePixelRatio * renderScale);
      renderer.setSize(mount.clientWidth, mount.clientHeight);

      // Animation
      const animate = () => {
        requestAnimationFrame(animate);
        controls.update();
        composer.render();
      };
      animate();

      setLoading(false);
    });

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      composer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
    };
  }, [textures]);

  return (
    <div
      className="page_content"
      ref={mountRef}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        backgroundColor: "transparent",
        position: "relative",
      }}
    >
      {!loading && (
        <div className="controls">
          {textures.baseColor && (
            <label
              htmlFor="Normal"
              className={`${isTextureOn.includes("Normal") ? "active" : ""}`}
            >
              <input
                type="checkbox"
                id="Normal"
                checked={isTextureOn.includes("Normal")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setIsTextureOn([...isTextureOn, "Normal"]);
                  } else {
                    setIsTextureOn(isTextureOn.filter((t) => t !== "Normal"));
                  }
                }}
              />
              Normal
            </label>
          )}

          {textures.bump && (
            <label
              htmlFor="Bump"
              className={`${isTextureOn.includes("Bump") ? "active" : ""}`}
            >
              <input
                type="checkbox"
                id="Bump"
                checked={isTextureOn.includes("Bump")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setIsTextureOn([...isTextureOn, "Bump"]);
                  } else {
                    setIsTextureOn(isTextureOn.filter((t) => t !== "Bump"));
                  }
                }}
              />
              Bump
            </label>
          )}

          {textures.displacement && (
            <label
              htmlFor="Displacement"
              className={`${
                isTextureOn.includes("Displacement") ? "active" : ""
              }`}
            >
              <input
                type="checkbox"
                id="Displacement"
                checked={isTextureOn.includes("Displacement")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setIsTextureOn([...isTextureOn, "Displacement"]);
                  } else {
                    setIsTextureOn(
                      isTextureOn.filter((t) => t !== "Displacement")
                    );
                  }
                }}
              />
              Displacement
            </label>
          )}

          {textures.metallic && (
            <label
              htmlFor="Metalness"
              className={`${isTextureOn.includes("Metalness") ? "active" : ""}`}
            >
              <input
                type="checkbox"
                id="Metalness"
                checked={isTextureOn.includes("Metalness")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setIsTextureOn([...isTextureOn, "Metalness"]);
                  } else {
                    setIsTextureOn(
                      isTextureOn.filter((t) => t !== "Metalness")
                    );
                  }
                }}
              />
              Metalness
            </label>
          )}

          {textures.roughness && (
            <label
              htmlFor="Roughness"
              className={`${isTextureOn.includes("Roughness") ? "active" : ""}`}
            >
              <input
                type="checkbox"
                id="Roughness"
                checked={isTextureOn.includes("Roughness")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setIsTextureOn([...isTextureOn, "Roughness"]);
                  } else {
                    setIsTextureOn(
                      isTextureOn.filter((t) => t !== "Roughness")
                    );
                  }
                }}
              />
              Roughness
            </label>
          )}

          {textures.ambientOcclusion && (
            <label
              htmlFor="AmbientOcclusion"
              className={`${
                isTextureOn.includes("AmbientOcclusion") ? "active" : ""
              }`}
            >
              <input
                type="checkbox"
                id="AmbientOcclusion"
                checked={isTextureOn.includes("AmbientOcclusion")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setIsTextureOn([...isTextureOn, "AmbientOcclusion"]);
                  } else {
                    setIsTextureOn(
                      isTextureOn.filter((t) => t !== "AmbientOcclusion")
                    );
                  }
                }}
              />
              Ambient Occlusion
            </label>
          )}

          {textures.idmap && (
            <label
              htmlFor="IDMAP"
              className={`${isTextureOn.includes("IDMAP") ? "active" : ""}`}
            >
              <input
                type="checkbox"
                id="IDMAP"
                checked={isTextureOn.includes("IDMAP")}
                onChange={(e) => {
                  if (e.target.checked) {
                    setIsTextureOn([...isTextureOn, "IDMAP"]);
                  } else {
                    setIsTextureOn(isTextureOn.filter((t) => t !== "IDMAP"));
                  }
                }}
              />
              IDMAP
            </label>
          )}
        </div>
      )}
      {loading && <div className="loading_textures">Loading textures...</div>}
    </div>
  );
};

export default TextureViewer;

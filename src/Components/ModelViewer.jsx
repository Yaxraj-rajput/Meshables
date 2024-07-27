import React from "react";
import { useState } from "react";
import LoadingPoster from "../assets/Images/Sections/LoadingPoster.png";
import sky from "../assets/Models/illovo_beach_balcony_4k.hdr";

const ModelViewer = (props) => {
  const [shadow, setShadow] = React.useState(1);
  const [exposure, setExposure] = React.useState(1);
  const [fov, setFov] = React.useState(100);
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <div className="model_showcase">
      <div className="controls">
        <div className="play_pause">
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);

              const model = document.querySelector("model-viewer");
              if (isPlaying) {
                model.pause();
              } else {
                model.play();
              }
            }}
          >
            {isPlaying ? (
              <i className="fas fa-pause"></i>
            ) : (
              <i className="fas fa-play"></i>
            )}
          </button>
        </div>

        <div className="colors">
          <span
            style={{ backgroundColor: "#181818" }}
            className="color_option active"
            onClick={(e) => {
              document.querySelector(".model_viewer").style.backgroundColor =
                "#181818";
            }}
          ></span>
          <span
            style={{ backgroundColor: "white" }}
            className="color_option active"
            onClick={(e) => {
              document.querySelector(".model_viewer").style.background =
                "rgb(158,158,158)";
              // document.querySelector(".model_viewer").style.background =
              //   "radial-gradient(circle, rgba(158,158,158,1) 0%, rgba(255,255,255,1) 100%)";
            }}
          ></span>
          <span
            style={{ backgroundColor: "black" }}
            className="color_option"
            onClick={(e) => {
              document.querySelector(".model_viewer").style.backgroundColor =
                "black";
            }}
          ></span>
          <span
            style={{ backgroundColor: "grey" }}
            className="color_option"
            onClick={(e) => {
              document.querySelector(".model_viewer").style.backgroundColor =
                "grey";
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
            onChange={(e) => setShadow(e.target.value)}
          />
          {/* <span> {shadow}</span> */}
        </div>
        <div className="shadow_control">
          <span className="label">Exposure</span>
          <input
            type="range"
            min="0"
            max="3"
            step="0.01"
            value={exposure}
            onChange={(e) => setExposure(e.target.value)}
          />
          {/* <span> {shadow}</span> */}
        </div>
      </div>

      <div className="model_viewer">
        <model-viewer
          className="model"
          src={props.model}
          alt="A 3D model"
          auto-rotate
          camera-controls
          camera-orbit="250deg 65deg"
          ar
          ar-placement="floor"
          ar-modes="webxr scene-viewer quick-look"
          ar-scale="auto"
          // camera-target="0m 0m 0m"
          // show loader until mdoel is loaded
          loading="eager"
          // skybox-image={sky}
          poster={LoadingPoster}
          exposure={exposure}
          environment-image={props.sky}
          shadow-intensity={shadow}
          style={{ width: "100%", height: "100%" }}
          autoplay // Add this attribute to autoplay the animation
          animation-name="YourAnimationName"
        ></model-viewer>
      </div>
    </div>
  );
};

export default ModelViewer;

import React from "react";
import video from "../assets/Images/Sections/background.mp4";
import { Link } from "react-router-dom";
import bg from "../assets/Images/Sections/home.png";
import unreal_logo from "../assets/Icons/brands/unreal.png";
import unity_logo from "../assets/Icons/brands/unity.png";
import blender_logo from "../assets/Icons/brands/blender.png";
import maya_logo from "../assets/Icons/brands/maya.png";
import godot_logo from "../assets/Icons/brands/godot.png";
import trade_image from "../assets/Icons/trade.png";
import discord_bot_image from "../assets/Images/Sections/discord_bot.png";
import apple_vision_image from "../assets/Images/Sections/home.png";

const Home = () => {
  return (
    <div className="home_main">
      <div className="hero_div_main">
        <div className="hero_text">
          <h1>
            India's biggest digital asset <br /> marketplace.
          </h1>
          <p>Coz who needs talent when you can just download it.</p>
          <Link to="/hot">
            <button>
              Explore <i className="icon fa-solid fa-arrow-right"></i>
            </button>
          </Link>
        </div>

        <div className="featured_image">
          <img src={bg} alt="featured_image" loading="lazy" />
        </div>
      </div>

      <div className="about_section">
        <div className="title">
          <h1>Except paint we got all platforms covered.</h1>
          <p className="description">
            Never worry about the platform you are working on. We got you on:
          </p>
        </div>
        <div className="icons">
          <div className="icon">
            <img src={unreal_logo} alt="unreal" />
          </div>
          <div className="icon">
            <img src={unity_logo} alt="unity" />
          </div>
          <div className="icon">
            <img src={blender_logo} alt="blender" />
          </div>
          <div className="icon">
            <img src={maya_logo} alt="maya" />
          </div>
          <div className="icon">
            <img src={godot_logo} alt="godot" />
          </div>
        </div>
      </div>

      {/* <div className="asset_types">
        <div className="title">
          <h1>Asset Types</h1>
          <p className="description">
            We have a wide range of asset types available for you to download.
          </p>
        </div>
        <div className="asset_types_grid">
          <div className="asset_type">
            <i className="icon fa-solid fa-cube"></i>
            <span className="asset_title">3D Models</span>
          </div>
          <div className="asset_type">
            <i className="icon fa-solid fa-image"></i>
            <span className="asset_title">Textures</span>
          </div>
          <div className="asset_type">
            <i className="icon fa-solid fa-globe"></i>
            <span className="asset_title">HDRIs</span>
          </div>
          <div className="asset_type">
            <i className="icon fa-solid fa-code"></i>
            <span className="asset_title">Scripts</span>
          </div>

          <div className="asset_type">
            <i className="icon fa-solid fa-plus"></i>
            <span className="asset_title">More</span>
          </div>
        </div>
      </div> */}

      <div className="what_we_provide">
        {/* <div className="title">
          <h1>What makes us stand out of the crowd? </h1>
        </div> */}

        <div className="grid">
          <div className="top">
            <div className="details">
              <h2 className="title">
                Think your asset adds value? Just trade it with others who think
                the same.
              </h2>
              <p className="description">
                We provide a platform for you to trade your assets with others.
                Just upload your asset and get started.
              </p>
              <Link to="/trade">
                <button>
                  Trade <i className="icon fa-solid fa-exchange"></i>
                </button>
              </Link>
            </div>
            <div className="image">
              <img src={trade_image} alt="trade" />
            </div>
          </div>

          <div className="bottom">
            <div className="card">
              <div className="image">
                <img
                  src="https://www.apple.com/newsroom/videos/media/rotation/posters/Apple-WWDC23-Vision-Pro-rotation-230605.jpg.large_2x.jpg"
                  alt="trade"
                />
              </div>
              <div className="details">
                <h2 className="text">Try on apple vision Pro!</h2>
                <button>
                  Download <i className="icon fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
            <div className="card">
              <div className="image">
                <img src={discord_bot_image} alt="trade" />
              </div>
              <div className="details">
                <h2 className="text">Add meshables bot!</h2>
                <Link to="/discord">
                  <button>
                    Install <i className="icon fa-solid fa-arrow-right"></i>
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

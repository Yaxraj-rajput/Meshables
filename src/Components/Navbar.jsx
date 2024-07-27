import React from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/Icons/logo.png";
import { useUser } from "../Context/UserProvider";
import Cart from "../Pages/Cart";

const Navbar = () => {
  const { currentUser } = useUser();
  return (
    <>
      <div className="navbar">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
            <span>Meshables</span>
          </Link>
        </div>

        <div className="search">
          <i className="icon fa-solid fa-magnifying-glass"></i>
          <input type="text" placeholder="Find more than 1000+ 3D models" />
        </div>

        <div className="right">
          <div className="nav_buttons">
            {/* <button>Upload</button> */}

            <Link to="/Cart">
              <button>
                <i className="icon fa-solid fa-shopping-cart"></i>
              </button>
            </Link>

            {currentUser ? (
              <button className="signed_in">
                <i className="icon fa-solid fa-user"></i>
                <span className="username">
                  {currentUser.displayName ? currentUser.displayName : "User"}
                </span>
              </button>
            ) : (
              <>
                <Link to="/Login">
                  <button>Sign In</button>
                </Link>
                <button className="primary">Sign Up</button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bottom-bar">
        <div className="links">
          <ul>
            <li>
              <NavLink
                className={({ isActive }) => (isActive ? "active" : undefined)}
                to="/hot"
              >
                <i className="icon fa-solid fa-fire"></i> Hot
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) => (isActive ? "active" : undefined)}
                to="/Printable"
              >
                <i className="icon fa-solid fa-print"></i> Printable
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) => (isActive ? "active" : undefined)}
                to="/Models"
              >
                <i className="icon fa-solid fa-cube"></i> Models
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) => (isActive ? "active" : undefined)}
                to="/Textures"
              >
                <i className="icon fa-solid fa-image"></i> Textures
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) => (isActive ? "active" : undefined)}
                to="/Scripts"
              >
                <i className="icon fa-solid fa-scroll"></i> Scripts
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) => (isActive ? "active" : undefined)}
                to="/Shaders"
              >
                <i className="icon fa-solid fa-magic"></i> Shaders
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) => (isActive ? "active" : undefined)}
                to="/Plugins"
              >
                <i className="icon fa-solid fa-plug"></i> Plugins
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) => (isActive ? "active" : undefined)}
                to="/HDRIs"
              >
                <i className="icon fa-solid fa-globe"></i> HDRIs
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="buttons">
          <Link to="/Upload">
            <button>
              <i className="icon fa-solid fa-plus"></i>
              Upload
            </button>
          </Link>
          <Link to="/Trade">
            <button>
              <i className="icon fa-solid fa-right-left"></i> Trade
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;

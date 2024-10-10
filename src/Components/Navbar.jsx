import React from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../assets/Icons/logo.png";
import { useUser } from "../Context/UserProvider";
import Search from "./Search";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const { currentUser } = useUser();

  const cart = JSON.parse(localStorage.getItem("cart"));

  if (cart) {
    var cartCount = cart.length;
  }

  const currentPage = useLocation().pathname;

  return (
    <>
      <div className="navbar">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
            <span>Meshables</span>
          </Link>
        </div>

        <Search />

        <div className="right">
          <div className="nav_buttons">
            {/* <button>Upload</button> */}

            <Link to="/Cart">
              <button>
                <i className="icon fa-solid fa-shopping-cart"></i>
                {cartCount ? (
                  <span className="cart_count">{cartCount}</span>
                ) : null}
              </button>
            </Link>

            {currentUser ? (
              <div className="navbar_dropdown">
                <Link to={`/Profile/${currentUser.uid}`}>
                  <button className="signed_in">
                    <i className="icon fa-solid fa-user"></i>
                    <span className="username">
                      {currentUser.displayName
                        ? currentUser.displayName
                        : "User"}
                    </span>
                  </button>
                </Link>
                <div className="dropdown">
                  <ul className="links">
                    <li>
                      <Link to="/Library">Library</Link>
                    </li>
                    <li>
                      <Link to={`/Profile/${currentUser.uid}`}>Profile</Link>
                    </li>
                    <li>
                      <Link to="/Trade">Trade</Link>
                    </li>
                    <li>
                      <Link to="/Upload">Upload</Link>
                    </li>
                    <li>
                      <Link className="logout" to="/Logout">
                        Logout
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <>
                <Link to="/Login">
                  <button className="login_btn">Sign In</button>
                </Link>
                {/* <button className="primary">Sign Up</button> */}
              </>
            )}
          </div>
        </div>
      </div>

      {currentPage != "/" &&
        currentPage != "/Login" &&
        currentPage != "/Upload" &&
        currentPage != "/reset" && (
          <div className="bottom-bar">
            <div className="links">
              <ul>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "active" : undefined
                    }
                    to="/hot"
                  >
                    <i className="icon fa-solid fa-fire"></i> Hot
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "active" : undefined
                    }
                    to="/Printable"
                  >
                    <i className="icon fa-solid fa-print"></i> Printable
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "active" : undefined
                    }
                    to="/Models"
                  >
                    <i className="icon fa-solid fa-cube"></i> Models
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "active" : undefined
                    }
                    to="/Textures"
                  >
                    <i className="icon fa-solid fa-image"></i> Textures
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "active" : undefined
                    }
                    to="/Scripts"
                  >
                    <i className="icon fa-solid fa-code"></i> Scripts
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "active" : undefined
                    }
                    to="/Shaders"
                  >
                    <i className="icon fa-solid fa-magic"></i> Shaders
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "active" : undefined
                    }
                    to="/Plugins"
                  >
                    <i className="icon fa-solid fa-plug"></i> Plugins
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    className={({ isActive }) =>
                      isActive ? "active" : undefined
                    }
                    to="/HDRIs"
                  >
                    <i className="icon fa-solid fa-globe"></i> HDRIs
                  </NavLink>
                </li>
              </ul>
            </div>
            {currentUser && (
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
            )}
          </div>
        )}
    </>
  );
};

export default Navbar;

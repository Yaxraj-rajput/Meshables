import React from "react";
import logo from "../assets/Icons/logo.png";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="footer">
      <div className="top">
        <div className="header">
          <div className="logo">
            <img src={logo} alt="logo" />
            <span>Meshables</span>
          </div>
        </div>
        <div className="links_section">
          <div className="link_group">
            <div className="title">
              <span>Language</span>
            </div>
            <div className="links">
              <ul>
                <li>
                  <Link to="/en">English</Link>
                </li>
                <li>
                  <Link to="/es">Spanish</Link>
                </li>
                <li>
                  <Link to="/fr">French</Link>
                </li>
                <li>
                  <Link to="/de">German</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="link_group">
            <div className="title">
              <span>Discover</span>
            </div>
            <div className="links">
              <ul>
                <li>
                  <Link to="/hot">Hot</Link>
                </li>
                <li>
                  <Link to="/printable">Printable</Link>
                </li>
                <li>
                  <Link to="/models">Models</Link>
                </li>
                <li>
                  <Link to="/textures">Textures</Link>
                </li>
                <li>
                  <Link to="/scripts">Scripts</Link>
                </li>
                <li>
                  <Link to="/shaders">Shaders</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="link_group">
            <div className="title">
              <span>Sell</span>
            </div>
            <div className="links">
              <ul>
                <li>
                  <Link to="/upload">Upload</Link>
                </li>
                <li>
                  <Link to="/pricing">Pricing</Link>
                </li>
                <li>
                  <Link to="/support">Support</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="link_group">
            <div className="title">
              <span>Company</span>
            </div>

            <div className="links">
              <ul>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/blog">Blog</Link>
                </li>
                <li>
                  <Link to="/careers">Careers</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="link_group">
            <div className="title">
              <span>Site map</span>
            </div>

            <div className="links">
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/trade">Trade</Link>
                </li>
                <li>
                  <Link to="/documentation">Documentation</Link>
                </li>
                <li>
                  <Link to="/pricing">Pricing</Link>
                </li>
                <li>
                  <Link to="/support">Support</Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="newsletter">
            <div className="top">
              <div className="title">
                <span>Subscribe to our newsletter</span>
              </div>
              <input type="text" placeholder="mail@example.com" />
              <button className="subscribe_btn">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
      <div className="bottom">
        <div className="text">
          <span className="copyright">
            © 2024 Meshables. All rights reserved
          </span>
          <span className="author">
            Designed by <a href="https://www.yaxraj.tech">Yaxraj</a>
          </span>
        </div>
        <div className="links">
          <ul>
            <li>
              <Link to="/terms">Terms of use</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy policy</Link>
            </li>
            <li>
              <Link to="/cookies">Cookies</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;

import { useEffect, useState } from "react";
import Navbar from "./Components/Navbar";
import "./assets/Styles/Style.css";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Models from "./Pages/Types/Models";
import View from "./Pages/View";
import Footer from "./Components/Footer";
import Hot from "./Pages/Types/Hot";
import Upload from "./Pages/Upload";
import Cart from "./Pages/Cart";
import Login from "./Pages/Login/Login";
import Checkout from "./Pages/Checkout";
import { FilterProvider } from "./Context/FilterContext";
import Profile from "./Pages/Profile";

import Printables from "./Pages/Types/Printables";
import Textures from "./Pages/Types/Textures";
import Scripts from "./Pages/Types/Scripts";
import Shader from "./Pages/Types/Shaders";
import HDRIs from "./Pages/Types/HDRIs";
import Plugins from "./Pages/Types/Plugins";
import Logout from "./Pages/Logout";
import Discord from "./Pages/Discord";
import Library from "./Pages/Library";
import TextureViewer from "./Components/TextureViewer";
import PasswordReset from "./Pages/Login/PasswordReset";
import Group from "./Pages/Group";
import Analytics from "./Pages/Analytics";
import Trade from "./Pages/Trade";
import TradePage from "./Pages/Trade";
import Terms from "./Pages/Terms";
import Privacy from "./Pages/Privacy";

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

export const AppRoutes = () => (
  <Routes>
    <Route path="/Login" element={<Login />} />
    <Route path="/Reset" element={<PasswordReset />} />
    <Route path="/Logout" element={<Logout />} />
    <Route path="/Profile/:id" element={<Profile />} />
    <Route path="/" element={<Home />} />
    <Route path="/Trade" element={<TradePage />} />
    <Route path="/Cart" element={<Cart />} />
    <Route path="/Hot" element={<Hot />} />
    <Route path="/Models" element={<Models />} />
    <Route path="/Printable" element={<Printables />} />
    <Route path="/Textures" element={<Textures />} />
    <Route path="/Scripts" element={<Scripts />} />
    <Route path="/Shaders" element={<Shader />} />
    <Route path="/HDRIs" element={<HDRIs />} />
    <Route path="/Plugins" element={<Plugins />} />
    <Route path="/View/:id" element={<View />} />
    <Route path="/Groups" element={<Group />} />
    <Route path="/Upload" element={<Upload />} />
    <Route path="/Checkout" element={<Checkout />} />
    <Route path="/Library" element={<Library />} />
    <Route path="/Texture" element={<TextureViewer />} />
    <Route path="/Discord" element={<Discord />} />
    <Route path="/analytics" element={<Analytics />} />
    <Route path="/Terms" element={<Terms />} />
    <Route path="/Privacy" element={<Privacy />} />
  </Routes>
);

function App() {
  return (
    <>
      <HashRouter>
        <ScrollToTop />
        <Navbar />
        <FilterProvider>
          <AppRoutes />
        </FilterProvider>
        <Footer />
      </HashRouter>
    </>
  );
}

export default App;

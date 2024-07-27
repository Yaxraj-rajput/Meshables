import { useState } from "react";
import Navbar from "./Components/Navbar";
import "./assets/Styles/Style.css";
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Models from "./Pages/Types/Models";
import View from "./Pages/View";
import Footer from "./Components/Footer";
import Hot from "./Pages/Types/Hot";
import Upload from "./Pages/Upload";
import Cart from "./Pages/Cart";
import Login from "./Pages/Login";
import Checkout from "./Pages/Checkout";
import { FilterProvider } from "./Context/FilterContext";
import Profile from "./Pages/Profile";
import Trade from "./Pages/Trade";
import Printables from "./Pages/Types/Printables";
import Textures from "./Pages/Types/Textures";
import Scripts from "./Pages/Types/Scripts";
import Shader from "./Pages/Types/Shaders";
import HDRIs from "./Pages/Types/HDRIs";
import Plugins from "./Pages/Types/Plugins";

function App() {
  return (
    <>
      <HashRouter>
        <Navbar />
        <FilterProvider>
          <Routes>
            <Route path="/Login" element={<Login />} />
            <Route path="/Profile/:id" element={<Profile />} />
            <Route path="/" element={<Home />} />
            <Route path="/Trade" element={<Trade />} />
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
            <Route path="/Upload" element={<Upload />} />
            <Route path="/Checkout" element={<Checkout />} />
          </Routes>
        </FilterProvider>
        <Footer />
      </HashRouter>
    </>
  );
}

export default App;

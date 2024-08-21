import Sitemap from "react-router-sitemap";
import { AppRoutes } from "./src/App.jsx";

function generateSitemap() {
  return new Sitemap(AppRoutes)
    .build("https://meshables.me")
    .save("./public/sitemap.xml");
}

generateSitemap();

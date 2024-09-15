import React from "react";
import PropTypes from "prop-types";
import TextureViewer from "./TextureViewer";

const ViewItemImages = (props) => {
  let imagesArray = props.images;

  // Convert object to array if images is an object
  if (!Array.isArray(imagesArray)) {
    imagesArray = Object.keys(imagesArray).map((key) => ({
      [key]: imagesArray[key],
    }));
  }

  return (
    <div>
      <div className="view_images_main">
        <div className="texture_viewer_main">
          <TextureViewer textures={props.images} />
        </div>
        <div className="images">
          {imagesArray.map((map, index) => {
            const label = Object.keys(map)[0];
            const src = Object.values(map)[0];

            if (!src) {
              return null;
            }
            return (
              <div key={index} className="image">
                <span className="label">{label}</span>
                <img src={src} alt={`Image ${index}`} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

ViewItemImages.propTypes = {
  images: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
    PropTypes.objectOf(PropTypes.string),
  ]).isRequired,
};

ViewItemImages.defaultProps = {
  images: [],
};

export default ViewItemImages;

import React from "react";

const ViewItemImages = (props) => {
  return (
    <div>
      <div className="images">
        {props.images.map((image, index) => {
          return (
            <div key={index} className="image">
              <img src={image} alt={`Image ${index}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ViewItemImages;

import React from "react";
import model from "../../assets/Images/Sections/model.jpg";

const PageTitle = (props) => {
  const image_map = {
    model: model,
  };
  return (
    <div className="page_title">
      {/* <img
        className="background"
        src={
          image_map[props.image] ? image_map[props.image] : image_map["model"]
        }
        alt=""
      /> */}

      <div className="title">
        <h1>{props.title}</h1>
      </div>
    </div>
  );
};

export default PageTitle;

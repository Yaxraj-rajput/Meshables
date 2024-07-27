import React from "react";
import sofa from "../../assets/Images/sofa.png";
import oven from "../../assets/Images/oven.png";
import trashbin from "../../assets/Images/trashbin.png";
import stapler from "../../assets/Images/stapler.png";
import football from "../../assets/Images/football.png";
import fridge from "../../assets/Images/fridge.png";
import chair from "../../assets/Images/chair.png";
import food from "../../assets/Images/food.png";

const CategoryGridCard = (props) => {
  const image_map = {
    sofa: sofa,
    oven: oven,
    trashbin: trashbin,
    stapler: stapler,
    football: football,
    fridge: fridge,
    chair: chair,
    food: food,
  };

  return (
    <div className="card">
      <div className="card_image">
        <img src={image_map[props.image]} alt="placeholder" />
      </div>

      <div className="card_title">
        <span>{props.title}</span>
      </div>
    </div>
  );
};

export default CategoryGridCard;

import React from "react";
import CategoryGridCard from "./UI/CategoryGridCard";

const CategoryGrid = () => {
  return (
    <div className="grid_overlay">
      <div className="category_grid">
        <CategoryGridCard title="Living Room" image="sofa" />
        <CategoryGridCard title="Kitchen" image="oven" />
        <CategoryGridCard title="Outdoor" image="trashbin" />
        <CategoryGridCard title="Office" image="stapler" />
        <CategoryGridCard title="Sports" image="football" />
        <CategoryGridCard title="Electronics" image="fridge" />
        <CategoryGridCard title="Furniture" image="chair" />
        <CategoryGridCard title="Food" image="food" />
      </div>

      <button className="view_all_btn">View All</button>
    </div>
  );
};

export default CategoryGrid;

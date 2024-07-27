import React from "react";
import { useFilters } from "../Context/FilterContext";

const ListingSidebar = () => {
  const categories = [
    "Living Room",
    "Kitchen",
    "Outdoor",
    "Office",
    "Sports",
    "Electronics",
  ];

  const softwares = [
    "Blender",
    "3ds Max",
    "Maya",
    "Cinema 4D",
    "Unity",
    "Unreal Engine",
  ];

  const discounts = [10, 30, 50, 70, 90];

  const [price, setPrice] = React.useState("");

  const { filters, updateFilters } = useFilters();

  const handleCategoryChange = (category, isChecked) => {
    const newCategories = isChecked
      ? [...filters.categories, category]
      : filters.categories.filter((c) => c !== category);
    updateFilters("categories", newCategories);
  };

  // const handleSoftwareChange = (e) => {
  //   const software = e.target.value;
  //   const isChecked = e.target.checked;

  //   const newSoftwares = isChecked
  //     ? [...filters.softwares, software]
  //     : filters.softwares.filter((s) => s !== software);
  //   updateFilters("softwares", newSoftwares);
  // };
  const handleDiscountChange = (discount, isChecked) => {
    // Ensure filters.discounts is an array before attempting to modify it
    const currentDiscounts = Array.isArray(filters.discounts)
      ? filters.discounts
      : [];
    const newDiscount = isChecked
      ? [...currentDiscounts, discount] // Use the ensured array for spreading
      : currentDiscounts.filter((d) => d !== discount); // Use the ensured array for filtering
    updateFilters("discounts", newDiscount);
  };
  return (
    <div className="listing_sidebar">
      <form>
        <div className="title">
          <h3>Filter by</h3>
          <button
            type="reset"
            className="clr_btn"
            onClick={() => {
              updateFilters("categories", []);
              updateFilters("price", 999999);
              updateFilters("softwares", []);
            }}
          >
            Clear filters
          </button>
        </div>

        <div className="filter_section">
          <div className="section_title">
            <h4>Category</h4>
          </div>

          <div className="filter_options">
            <ul>
              {categories.map((category) => (
                <li>
                  <label key={category}>
                    <input
                      type="checkbox"
                      value={category}
                      checked={filters.categories.includes(category)}
                      onChange={(e) =>
                        handleCategoryChange(category, e.target.checked)
                      }
                    />
                    {category}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="filter_section">
          <div className="section_title">
            <h4>Price</h4>
          </div>

          <div className="filter_options">
            <div className="range">
              <input
                className="price_range"
                type="range"
                min={0}
                max={100}
                value={filters.price}
                onChange={(e) => updateFilters("price", e.target.value)}
              />

              <div className="range_values">
                <span className="value">Free</span>
                <span className="value">
                  ${price === 100 ? "100+" : filters.price}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="filter_section">
          <div className="section_title">
            <h4>Discount</h4>
          </div>
          <div className="filter_options">
            <ul>
              {discounts.map((discount) => (
                <li key={discount}>
                  {" "}
                  <label>
                    <input
                      type="checkbox"
                      value={discount}
                      checked={filters.discounts?.includes(discount) || false} // Use optional chaining and default to false
                      onChange={(e) =>
                        handleDiscountChange(discount, e.target.checked)
                      }
                    />
                    {discount}% and above
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* <div className="filter_section">
          <div className="section_title">
            <h4>Software Compatibility</h4>
          </div>

          <div className="filter_options">
            <ul>
              {softwares.map((software) => (
                <li>
                  <label key={software}>
                    <input
                      type="checkbox"
                      value={software}
                      checked={filters.softwares.includes(software)}
                      onChange={handleSoftwareChange}
                    />
                    {software}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div> */}
      </form>
    </div>
  );
};

export default ListingSidebar;

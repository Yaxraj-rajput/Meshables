import React, { useEffect, useCallback } from "react";
import { useFilters } from "../Context/FilterContext";
import checkmark from "../assets/Icons/check_mark.png";

const ListingSidebar = () => {
  const categories = [
    "Living Room",
    "Kitchen",
    "Outdoor",
    "Office",
    "Sports",
    "Electronics",
    "other",
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

  const defaultPrice = 1000; // Set a high default price
  const [price, setPrice] = React.useState(defaultPrice);

  const { filters, updateFilters } = useFilters();
  const {
    categories: filterCategories = [],
    discounts: filterDiscounts = [],
    softwares: filterSoftwares = [],
  } = filters;

  const updatePriceFilter = useCallback(() => {
    updateFilters("price", price);
  }, [price, updateFilters]);

  useEffect(() => {
    updatePriceFilter();
  }, [price, updatePriceFilter]);

  const handleCategoryChange = (category, isChecked) => {
    const newCategories = isChecked
      ? [...filterCategories, category]
      : filterCategories.filter((c) => c !== category);
    updateFilters("categories", newCategories);
  };

  const handleDiscountChange = (discount, isChecked) => {
    const newDiscount = isChecked
      ? [...filterDiscounts, discount]
      : filterDiscounts.filter((d) => d !== discount);
    updateFilters("discounts", newDiscount);
  };

  const handleSoftwareChange = (software, isChecked) => {
    const newSoftwares = isChecked
      ? [...filterSoftwares, software]
      : filterSoftwares.filter((s) => s !== software);
    updateFilters("softwares", newSoftwares);
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
              updateFilters("price", defaultPrice);
              updateFilters("softwares", []);
              updateFilters("discounts", []);
              setPrice(defaultPrice);
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
                <li key={category}>
                  <label
                    className={
                      filterCategories.includes(category) ? "active" : ""
                    }
                  >
                    <input
                      type="checkbox"
                      value={category}
                      checked={filterCategories.includes(category)}
                      onChange={(event) =>
                        handleCategoryChange(category, event.target.checked)
                      }
                    />
                    {category}
                    {filterCategories.includes(category) && (
                      <img className="checkmark" src={checkmark} alt="" />
                    )}
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
                max={1000}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />

              <div className="range_values">
                <span className="value">Free</span>
                <span className="value">${price > 999 ? "999+" : price}</span>
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
                  <label>
                    <input
                      type="checkbox"
                      value={discount}
                      checked={filterDiscounts.includes(discount)}
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

        <div className="filter_section">
          <div className="section_title">
            <h4>Software Compatibility</h4>
          </div>

          <div className="filter_options">
            <ul>
              {softwares.map((software) => (
                <li key={software}>
                  <label>
                    <input
                      type="checkbox"
                      value={software}
                      checked={filterSoftwares.includes(software)}
                      onChange={(e) =>
                        handleSoftwareChange(software, e.target.checked)
                      }
                    />
                    {software}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ListingSidebar;

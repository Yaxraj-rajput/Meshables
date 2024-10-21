import React from "react";
import { Link } from "react-router-dom";

const ListedItemCard = ({ id, data, rating }) => {
  return (
    <Link to={`/View/${id}`}>
      <div className="item_card" key={id}>
        <div
          className="card_image"
          style={{
            aspectRatio: data.type === "textures" ? "1 / 1" : undefined,
          }}
        >
          {data.discount > 0 ? (
            <div className="discount_card">
              <span>
                <strong>-{data.discount}%</strong>
              </span>
            </div>
          ) : null}
          <img src={data.thumbnail} alt="placeholder" />
        </div>

        <div className="card_content">
          <span className="title">
            {data.title}{" "}
            <span className="publisher">by Servant {data.publisher}</span>
          </span>
          <div className="details">
            <span className="price">
              <strong>
                {data.price - (data.price * data.discount) / 100 === 0
                  ? "Free"
                  : `₹${(
                      data.price -
                      (data.price * data.discount) / 100
                    ).toFixed(2)}`}
              </strong>
            </span>
            <span className="rating">
              <div className="icons">
                {Array.from({ length: rating }, (_, i) => (
                  <i key={`filled_${i}`} className="icon fas fa-star"></i> // Added unique key here
                ))}
                {Array.from({ length: 5 - rating }, (_, i) => (
                  <i key={`unfilled_${i}`} className="icon far fa-star"></i> // And here
                ))}
              </div>
              <span className="rating_count">125</span>
            </span>
          </div>
          {/* <button className="add_to_cart_btn">
          <i className="icon fas fa-shopping-cart"></i> Add to cart
        </button> */}
        </div>
      </div>
    </Link>
  );
};

export default ListedItemCard;

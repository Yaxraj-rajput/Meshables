import React from "react";
import { Link } from "react-router-dom";

const ListedItemCard = (props) => {
  return (
    <Link to={`/View/${props.id}`} className="item_card">
      <div className="item_card" key={props.id}>
        <div className="card_image">
          {props.discount > 0 ? (
            <div className="discount_card">
              <span>
                <strong>-{props.discount}%</strong>
              </span>
            </div>
          ) : null}
          <img src={props.image} alt="placeholder" />
        </div>

        <div className="card_content">
          <span className="title">
            {props.title}{" "}
            <span className="publisher">by {props.publisher}</span>
          </span>
          <div className="details">
            <span className="price">
              <strong>{props.price == 0 ? "Free" : `$${props.price}`}</strong>
            </span>
            <span className="rating">
              <div className="icons">
                {Array.from({ length: props.rating }, (_, i) => (
                  <i key={`filled_${i}`} className="icon fas fa-star"></i> // Added unique key here
                ))}
                {Array.from({ length: 5 - props.rating }, (_, i) => (
                  <i key={`unfilled_${i}`} className="icon far fa-star"></i> // And here
                ))}
              </div>
              <span className="rating_count">{props.rating_count}</span>
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

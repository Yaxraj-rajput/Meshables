import React from "react";
import { useState } from "react";
import { useCallback } from "react";

import { Link } from "react-router-dom";

const Checkout = () => {
  const [cartItems, setCartItems] = useState(() => {
    // Initialize state with local storage
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const calculateTotal = useCallback(() => {
    return cartItems
      .reduce(
        (total, item) =>
          total + (item.price - (item.price * item.discount) / 100),
        0
      )
      .toFixed(2);
  }, [cartItems]);

  return (
    <div className="checkout_main">
      <div className="title">
        <h1>Cart</h1>
      </div>

      {cartItems.length > 0 ? (
        <>
          <div className="cart_items">
            {cartItems.map((item) => (
              <div className="cart_item" key={item.id}>
                <Link to={`/View/${item.id}`} key={item.id}>
                  <div className="image">
                    <img src={item.thumbnail} alt="item" />
                  </div>
                  <div className="item_details">
                    <div className="item_title">{item.title}</div>
                    <div className="price">
                      $
                      {(
                        item.price -
                        (item.price * item.discount) / 100
                      ).toFixed(2)}
                    </div>
                  </div>
                </Link>

                <button
                  className="remove_btn"
                  onClick={() => removeItemFromCart(item.id)}
                >
                  <i className="fas fa-x"></i>
                </button>
              </div>
            ))}
          </div>
          <div className="total">
            Total: <span className="value">${calculateTotal()}</span>
          </div>

          <div className="checkout">
            <button>Checkout</button>
          </div>
        </>
      ) : (
        <span className="no_items">No items in the cart.</span>
      )}
    </div>
  );
};

export default Checkout;

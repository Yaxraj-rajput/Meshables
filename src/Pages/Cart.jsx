import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useUser } from "../Context/UserProvider";

const Cart = () => {
  const { currentUser, userProfile, updateUserProfile } = useUser();
  const Firestore = getFirestore();

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    const fetchCartItems = () => {
      const savedCart = localStorage.getItem("cart");
      setCartItems(savedCart ? JSON.parse(savedCart) : []);
    };

    fetchCartItems();

    const handleStorageChange = () => {
      fetchCartItems();
    };

    window.addEventListener("storage", handleStorageChange);

    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const removeItemFromCart = useCallback(
    (id) => {
      const newCartItems = cartItems.filter((cartItem) => cartItem.id !== id);
      setCartItems(newCartItems);
      localStorage.setItem("cart", JSON.stringify(newCartItems));
    },
    [cartItems]
  );

  const calculateTotal = useCallback(() => {
    return cartItems
      .reduce(
        (total, item) =>
          total + (item.price - (item.price * item.discount) / 100),
        0
      )
      .toFixed(2);
  }, [cartItems]);

  const checkout = async () => {
    const purchasedItems = cartItems.map((item) => item.id);
    console.log("Purchased items:", purchasedItems);

    if (currentUser) {
      const userProfileRef = doc(Firestore, "Profiles", currentUser.uid);

      try {
        const userProfileSnap = await getDoc(userProfileRef);

        if (userProfileSnap.exists()) {
          const existingPurchasedItems =
            userProfileSnap.data().purchasedItems || [];
          const updatedPurchasedItems = [
            ...new Set([...existingPurchasedItems, ...purchasedItems]),
          ];

          await updateDoc(userProfileRef, {
            purchasedItems: updatedPurchasedItems,
          });
          console.log(
            "Purchased items added to Firestore:",
            updatedPurchasedItems
          );

          updateUserProfile({ purchasedItems: updatedPurchasedItems });

          localStorage.removeItem("cart");
          setCartItems([]);

          alert("Items purchased successfully!");
        } else {
          console.error("User profile document does not exist!");
        }
      } catch (error) {
        console.error(
          "Error adding purchased items to the user's profile",
          error
        );
      }
    } else {
      console.error("No current user found!");
    }
  };

  return (
    <>
      <Helmet>
        <title>Cart | Meshables</title>
        <meta
          name="description"
          content="View your cart items and proceed to checkout."
        />
        <meta property="og:title" content="Cart | Meshables" />
        <meta
          property="og:description"
          content="View your cart items and proceed to checkout."
        />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="page_content">
        <div className="cart_main">
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

              <div className="accepted_method_icons">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png"
                  alt="paypal"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg"
                  alt="visa"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  alt="mastercard"
                />
                <img
                  src="https://cdn1.iconfinder.com/data/icons/logos-brands-in-colors/436/Google_Pay_GPay_Logo-512.png"
                  alt="Gpay"
                />
              </div>

              <div className="checkout">
                <button onClick={checkout}>Checkout</button>
              </div>
            </>
          ) : (
            <span className="no_items">No items in the cart.</span>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;

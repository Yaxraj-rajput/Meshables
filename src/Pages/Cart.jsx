import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { useUser } from "../Context/UserProvider";

const Cart = () => {
  const { currentUser, updateUserProfile } = useUser();
  const Firestore = getFirestore();

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const connectKeplr = async () => {
    if (!window.keplr) {
      alert("Please install Keplr extension");
      return;
    }

    try {
      // Enable Keplr.
      await window.keplr.enable("cosmoshub-4");

      // Get the offline signer.
      const offlineSigner = window.getOfflineSigner("cosmoshub-4");

      // Get the user's address.
      const accounts = await offlineSigner.getAccounts();
      const address = accounts[0].address;
      console.log("Keplr address:", address);

      // Confirm connection
      console.log("Keplr successfully connected.");
    } catch (err) {
      console.error("Keplr connection failed:", err);
      alert(
        "Failed to connect to Keplr. Please ensure the wallet is installed and try again."
      );
    }
  };

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

    if (!window.keplr) {
      alert("Please install Keplr extension");
      return;
    }

    try {
      // Enable Keplr.
      await window.keplr.enable("cosmoshub-4");

      // Get the offline signer.
      const offlineSigner = window.getOfflineSigner("cosmoshub-4");

      // Get the user's address.
      const accounts = await offlineSigner.getAccounts();
      const address = accounts[0].address;

      // Calculate the total amount in uatom (1 atom = 1,000,000 uatom)
      const totalAmount = (calculateTotal() * 1000000).toString();

      // Create the transaction message
      const msgSend = {
        type: "cosmos-sdk/MsgSend",
        value: {
          from_address: address,
          to_address: "recipient_address_here", // address
          amount: [
            {
              denom: "uatom",
              amount: totalAmount / 4.23,
            },
          ],
        },
      };

      // Get the account sequence and account number
      const accountInfo = await window.keplr.getKey("cosmoshub-4");
      const sequence = accountInfo.sequence;
      const accountNumber = accountInfo.accountNumber;

      // Create the transaction
      const tx = {
        msg: [msgSend],
        fee: {
          amount: [
            {
              denom: "uatom",
              amount: "5000", // Fee amount in uatom
            },
          ],
          gas: "200000", // Gas limit
        },
        signatures: null,
        memo: "Purchase from Meshables",
      };

      // Sign the transaction
      const signDoc = {
        chain_id: "cosmoshub-4",
        account_number: accountNumber,
        sequence: sequence,
        fee: tx.fee,
        msgs: tx.msg,
        memo: tx.memo,
      };

      const { signed, signature } = await window.keplr.signAmino(
        "cosmoshub-4",
        address,
        signDoc
      );

      // Add the signature to the transaction
      tx.signatures = [signature];

      // Broadcast the transaction
      const result = await window.keplr.sendTx("cosmoshub-4", tx, "sync");

      if (result.code !== undefined && result.code !== 0) {
        throw new Error(
          `Failed to send transaction: ${result.log || result.raw_log}`
        );
      }

      console.log("Transaction successful:", result);

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
    } catch (err) {
      console.error("Keplr transaction failed:", err);
      alert("Failed to complete the transaction. Please try again.");
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

              <div className="checkout">
                <button className="connect" onClick={connectKeplr}>
                  Connect Wallet
                </button>
                <button
                  onClick={() => {
                    currentUser
                      ? checkout()
                      : alert("Please sign in to checkout.");
                  }}
                >
                  Checkout
                </button>
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

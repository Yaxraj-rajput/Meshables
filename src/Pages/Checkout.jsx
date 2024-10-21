import React from "react";
import { useState } from "react";
import { useCallback } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import CheckoutForm from "../Components/CheckoutForm";
import { useUser } from "../Context/UserProvider";
import { parseEther } from "ethers";
import { db } from "../../firebase";
const Checkout = () => {
  const { currentUser } = useUser();
  const [formData, setFormData] = useState("");

  const [cardType, setCardType] = useState("");

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

  const payWithCrypto = async () => {
    if (!window.ethereum) {
      alert(
        "No Ethereum wallet detected. Please install an Ethereum wallet to proceed."
      );
      return;
    }

    try {
      console.log("Requesting account access...");
      await window.ethereum.request({ method: "eth_requestAccounts" });
      console.log("Account access granted.");

      // Initialize ethers provider
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Fetch current exchange rate (INR to ETH) - replace with real-time fetch
      const ethToInrRate = 120000; // Example: 1 ETH = 1,20,000 INR (you would fetch this in real-time)

      // Calculate total in INR
      const totalInInr = (calculateTotal() * 1.03).toFixed(2);
      console.log("Total in INR:", totalInInr);

      // Convert INR to ETH
      const totalInEth = (totalInInr / ethToInrRate).toFixed(6);
      console.log("Total in ETH:", totalInEth);

      // Define the transaction parameters
      const transactionParameters = {
        to: "0x3349CfAcd34b41D2Db7Cc88B9038aD0c5f9D6888", // Recipient address
        value: ethers.parseEther(totalInEth.toString()), // Amount to send (in wei)
        gasLimit: 21000, // Set the gas limit directly as a number
      };

      console.log("Transaction parameters defined:", transactionParameters);

      // Send the transaction
      const tx = await signer.sendTransaction(transactionParameters);
      console.log("Transaction sent:", tx);

      // Wait for the transaction to be mined
      const receipt = await tx.wait();
      console.log("Transaction mined:", receipt);

      // add the purchased items in owneditems in firebase

      const userRef = db.collection("users").doc(currentUser.uid);

      const userDoc = await userRef.get();

      if (userDoc.exists) {
        const userOwnedItems = userDoc.data().ownedItems;

        const updatedOwnedItems = [...userOwnedItems, ...cartItems];

        await userRef.update({
          ownedItems: updatedOwnedItems,
        });

        // if successful, clear the cart

        localStorage.removeItem("cart");

        setCartItems([]);
      }

      alert("Payment successful!");
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="page_content">
      <div className="checkout_main">
        <div className="title">
          <h1>Checkout</h1>
        </div>

        <div className="container">
          <div className="left">
            <form action="">
              <h2 className="section_title">Personal Details</h2>

              <div className="section">
                <div className="group">
                  <div className="input_field">
                    <label htmlFor="">First Name</label>
                    <input type="text" name="first_name" />
                  </div>

                  <div className="input_field">
                    <label htmlFor="">Last Name</label>
                    <input type="text" name="last_name" />
                  </div>
                </div>
                <div className="input_field">
                  <label htmlFor="">Email</label>
                  <input type="email" name="email" />{" "}
                </div>{" "}
              </div>

              <h2 className="section_title">Billing Address</h2>

              <div className="section">
                <div className="group">
                  <div className="input_field">
                    <label htmlFor="">Region</label>
                    <select name="region" id="Region">
                      <option value="" disabled selected="selected">
                        Select Country
                      </option>
                      <option value="USA">USA</option>
                      <option value="Canada">Canada</option>
                      <option value="UK">UK</option>
                      <option value="Australia">Australia</option>
                      <option value="Japan">Japan</option>
                      <option value="China">China</option>
                      <option value="India">India</option>
                    </select>
                  </div>
                  <div className="input_field">
                    <label htmlFor="">State</label>

                    <select name="state" id="State">
                      <option value="" disabled selected="selected">
                        Select State
                      </option>
                      <option value="NY">New York</option>
                      <option value="CA">California</option>
                      <option value="TX">Texas</option>
                      <option value="FL">Florida</option>
                      <option value="IL">Illinois</option>
                      <option value="PA">Pennsylvania</option>
                      <option value="OH">Ohio</option>
                    </select>
                  </div>
                </div>

                <div className="input_field">
                  <label htmlFor="">Address</label>
                  <input type="text" name="address" />
                </div>

                <div className="group">
                  <div className="input_field">
                    <label htmlFor="">City</label>
                    <input type="text" name="city" />
                  </div>

                  <div className="input_field">
                    <label htmlFor="">Zip Code</label>
                    <input type="text" name="zip" />
                  </div>
                </div>
              </div>

              <h2 className="section_title">Payment</h2>

              <div className="section">
                <div className="input_field">
                  <label htmlFor="">Card Number</label>
                  <div className="card_input">
                    <input
                      type="text"
                      name="card_number"
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, ""); // Remove all non-digit characters
                        let formattedValue = "";

                        // Detect card type based on the prefix
                        if (value.startsWith("34") || value.startsWith("37")) {
                          // AMEX (15 digits): Format as 4-6-5

                          setCardType("amex");

                          formattedValue = value
                            .replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3")
                            .trim();
                        } else if (value.startsWith("4")) {
                          setCardType("visa");
                          // Visa (16 digits): Format as 4-4-4-4
                          formattedValue = value
                            .replace(/(\d{4})(?=\d)/g, "$1 ")
                            .trim();
                        } else if (
                          /^5[1-5]/.test(value) ||
                          /^22[2-9]\d|^2[3-7]\d{2}/.test(value)
                        ) {
                          setCardType("mastercard");
                          // Mastercard (16 digits): Format as 4-4-4-4
                          formattedValue = value
                            .replace(/(\d{4})(?=\d)/g, "$1 ")
                            .trim();
                        } else {
                          // Default case (treat as 16 digits): Format as 4-4-4-4

                          setCardType("");
                          formattedValue = value
                            .replace(/(\d{4})(?=\d)/g, "$1 ")
                            .trim();
                        }

                        // Limit the input to the card's max length (16 for Visa/Mastercard, 15 for AMEX)
                        if (value.startsWith("34") || value.startsWith("37")) {
                          formattedValue = formattedValue.slice(0, 17); // AMEX allows up to 15 digits + spaces (17 chars)
                        } else {
                          formattedValue = formattedValue.slice(0, 19); // Visa/Mastercard allows up to 16 digits + spaces (19 chars)
                        }

                        // Set the formatted value
                        e.target.value = formattedValue;
                      }}
                    />

                    <div className="card_icon">
                      {cardType === "visa" && (
                        <img src="https://img.icons8.com/color/48/000000/visa.png" />
                      )}
                      {cardType === "mastercard" && (
                        <img src="https://img.icons8.com/color/48/000000/mastercard.png" />
                      )}
                      {cardType === "amex" && (
                        <img src="https://img.icons8.com/color/48/000000/amex.png" />
                      )}
                      {cardType === "" && <></>}
                    </div>
                  </div>
                </div>

                <div className="group">
                  <div className="input_field">
                    <label htmlFor="">Expiry Date</label>
                    <input
                      placeholder="MM/YY"
                      type="text"
                      name="expiry_date"
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, ""); // Remove all non-digit characters
                        let formattedValue = value
                          .replace(/(\d{2})(?=\d)/g, "$1 / ") // Add a slash after the first two digits
                          .trim();

                        // Limit the input to 5 characters
                        formattedValue = formattedValue.slice(0, 7);

                        // Set the formatted value
                        e.target.value = formattedValue;
                      }}
                    />
                  </div>

                  <div className="input_field">
                    <label htmlFor="">CVV</label>
                    <input
                      type="password"
                      name="cvv"
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, ""); // Remove all non-digit characters

                        if (cardType === "amex") {
                          // AMEX: 4 digits
                          value = value.slice(0, 4);
                        } else {
                          // Other cards: 3 digits
                          value = value.slice(0, 3);
                        }

                        // Set the formatted value
                        e.target.value = value;
                      }}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="right">
            <div className="order_items">
              <h2 className="section_title">Order Summary</h2>

              <div className="items">
                {cartItems.map((item) => (
                  <div className="item" key={item.id}>
                    <div className="image">
                      <img src={item.thumbnail} alt="item" />
                    </div>
                    <div className="item_details">
                      <div className="item_title">{item.title}</div>
                      <div className="price">
                        ₹
                        {(
                          item.price -
                          (item.price * item.discount) / 100
                        ).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="total">
                <div className="title">
                  <span>Total</span>
                </div>

                <div className="item">
                  <span className="label">Subtotal</span>
                  <span className="value">₹{calculateTotal()}</span>
                </div>

                <div className="item">
                  <span className="label">Taxes & Fees</span>
                  <span className="value">
                    ₹{(calculateTotal() * 0.03).toFixed(2)}
                  </span>
                </div>

                <div className="item">
                  <span className="label">Total</span>
                  <span className="value">
                    ₹{(calculateTotal() * 1.03).toFixed(2)}
                  </span>
                </div>

                <div className="total_payable">
                  <span>Total Payable</span>
                  <span>₹{(calculateTotal() * 1.03).toFixed(2)}</span>
                </div>
              </div>

              <div className="coupon">
                <h3 className="section_title">Apply Code</h3>
                <div className="input_field">
                  <input type="text" name="coupon" />
                  <button className="apply_btn">Apply</button>
                </div>
              </div>

              <button className="pay_with_crypto" onClick={payWithCrypto}>
                Pay with Crypto
              </button>

              <CheckoutForm
                amount={(calculateTotal() * 1.03).toFixed(2) * 100}
                prefill_name={currentUser ? currentUser.displayName : ""}
                prefill_email={currentUser ? currentUser.email : ""}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

import React, { useState } from "react";
import { functions } from "../../firebase";

const CheckoutForm = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handlePayment = async (props) => {
    try {
      const createOrder = functions.httpsCallable("createOrder");
      const order = await createOrder({ amount: props.amount * 100 }); // Amount in paise (e.g., 1000 paise = 10 INR)

      const options = {
        key: "rzp_test_8rxVwtVKs8PKsY",
        amount: order.data.amount,
        currency: order.data.currency,
        name: "Your Company Name",
        description: "Test Transaction",
        order_id: order.data.id,
        handler: function (response) {
          setSuccess(true);
        },
        prefill: {
          name: props.prefill_name,
          email: props.prefill_email,
          contact: "9999999999",
        },
        notes: {
          address: "Your Address",
        },
        theme: {
          color: "#F37254",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        style={{
          padding: "1rem",
          width: "100%",
          backgroundColor: "#078CC8",
          color: "#fff",
          border: "none",
          borderRadius: ".5rem",
          cursor: "pointer",
          fontSize: "16px",
          marginTop: "5px",
          fontWeight: "600",  
        }}
      >
        Pay Now
      </button>
      {error && <div>{error}</div>}
      {success && <div>Payment Successful!</div>}
    </div>
  );
};

export default CheckoutForm;

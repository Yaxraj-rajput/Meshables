const { onCall } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: "your-key-id-here",
  key_secret: "your-key-secret-here",
});

exports.createOrder = onCall(async (data, context) => {
  try {
    const options = {
      amount: data.amount, // amount in the smallest currency unit
      currency: "INR",
      receipt: "receipt#1",
    };
    const order = await razorpay.orders.create(options);
    return {
      id: order.id,
      currency: order.currency,
      amount: order.amount,
    };
  } catch (error) {
    logger.error("Error creating order", error);
    throw new functions.https.HttpsError("internal", "Unable to create order");
  }
});

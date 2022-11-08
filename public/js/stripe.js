/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";
import { loadStripe } from "@stripe/stripe-js";

export const bookTour = async (tourId) => {
  try {
    // get checkout session from endpoint
    const session = await axios(`/api/v1/booking/checkout-session/${tourId}`);
    //console.log(session)
    const stripe = await loadStripe(
      "pk_test_51M0ZRrCYU7KcSHtQEGP6Q1fet7EWvtClzfE1JanCMrUDIS7Ji1ocQ3af3zZcK8m8QAAtMrDhVSUkTMPwOdpZcEMg00ilc0a3e1"
    );
    // redirect to checkout
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (error) {
    showAlert("error", error);
  }
};

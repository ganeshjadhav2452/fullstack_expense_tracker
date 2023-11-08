import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");
const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    paymentSuccess: false,
  },
  reducers: {
    updatePaymentStatus(state, action) {
      state.paymentSuccess = action.payload;
    }
  },
});

export const { updatePaymentStatus } = paymentSlice.actions;
export default paymentSlice.reducer;

export const openRazorpay = (data) => {

  return async (dispatch, getState) => {


    var options = {
      key: data.data.key_id, // Enter the Key ID generated from the Dashboard
      amount: Number(data.data.amount),
      currency: "INR",
      name: "Star Expense Tracker",
      description: "Test Transaction",
      image: "https://i.ibb.co/8cDgdFX/Logo.png",
      order_id: data.data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        try {
          const res = await fetch('/verifypayment', {
            method: 'POST',
            body: JSON.stringify(response),
            headers: {
              "Authorization": token,
              "Content-Type": "application/json",
            },
          })
          if (res) {
            dispatch(updatePaymentStatus(true))
          }

        } catch (error) {
          console.log(error)
        }
      },
      prefill: {
        name: "Test Kumar",
        email: "test.kumar@example.com",
        contact: "9325461198",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };
};
export const paymentHandler = (data) => {
  return async (dispatch, getState) => {

    try {
      const response = await fetch("/checkout", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      dispatch(openRazorpay(data));
    } catch (error) {
      console.log(error);
    }
  };
};

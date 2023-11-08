import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const token = localStorage.getItem("token");
export const STATUSES = Object.freeze({
  SUCCESS: "SUCCESS",
  ERROR: "error",
  LOADING: "LOADING",
});
const initialExpenseData = createSlice({
  name: "expenseData",
  initialState: {
    data: [],
    totalExpenses: 0,
    limit: 0,
    noExpenses: false,
    status: STATUSES.SUCCESS,
  },
  reducers: {
    fetchData(state, action) {
      state.data = action.payload.response;
      state.totalExpenses = action.payload.total;
      state.limit = action.payload.size;
    },
    setStatus(state, action) {
      state.status = action.payload;
    },
    setIsNoExpense(state, action) {
      state.noExpenses = action.payload;
    },
  },
});

const initialExpenseDataReducer = initialExpenseData.reducer;

export const { fetchData, setStatus, setIsNoExpense } =
  initialExpenseData.actions;

export default initialExpenseDataReducer;

const headers = {
  Authorization: token,
};

// api call for get data from server

export const fetchDataFromServer = (pageNum, limit) => {
  return async (dispatch, getState) => {
    try {
      const response = await axios.get(`/getexpenses`, {
        headers,
        params: {
          page: pageNum, //3
          size: limit, //5
        },
      });

      if (response.data.response.length === 0) {
        dispatch(setIsNoExpense(true));
      } else {
        dispatch(setIsNoExpense(false));
      }
      dispatch(
        fetchData({
          response: response.data.response,
          total: response.data.total,
          size: response.data.size,
        })
      );
    } catch (err) {
      console.log(err);
    }
    // Check if the fetched data has changed before updating the state
  };
};

export const postDataOnServer = (formValues) => {
  return async (dispatch, getState) => {
    try {
      await fetch(`/postexpense`, {
        method: "POST",
        body: JSON.stringify(formValues),
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });
      dispatch(setStatus(STATUSES.SUCCESS));
    } catch (error) {
      console.log(error);
      dispatch(setStatus(STATUSES.ERROR));
    }
  };
};

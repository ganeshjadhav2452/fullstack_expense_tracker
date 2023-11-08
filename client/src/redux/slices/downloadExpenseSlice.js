import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
const token = localStorage.getItem('token')
const downloadExpensesSlice = createSlice({
    name: 'download',
    initialState: {
        url: ''
    },
    reducers: {
        setUrl(state, action) {
            state.url = action.payload;
        }
    }
})

export const { setUrl } = downloadExpensesSlice.actions;
export default downloadExpensesSlice.reducer;

export const downloadAllExpenses = () => {
    return async (dispatch, getState) => {
        try {
            const response = await axios('/download', {
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                }
            })
            window.location.href = response.data.downloadUrl;
            dispatch(setUrl(response.data.downloadUrl))
        } catch (error) {
            console.log(error)

        }
    }
}
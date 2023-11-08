import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const token = localStorage.getItem('token')

const expenseActionManagerSlice = createSlice({

    name: 'expenseManager',
    initialState: {
        expense: {},
        isEdit: false,
        actionHappened: false
    },
    reducers: {
        edit(state, action) {
            Object.assign(state, action.payload);

        },
        setActionHappened(state, action) {
            state.actionHappened = !state.actionHappened;

        }

    }
})
const expenseActionManagerSliceReducer = expenseActionManagerSlice.reducer;
export const { edit, setActionHappened } = expenseActionManagerSlice.actions;

export default expenseActionManagerSliceReducer


// api calls for updating expense
const headers = {
    'Authorization': token,
};;
export const updateExpense = (expenseObj) => {



    // return async(dispatch, getState)=>{

    //     try {
    //        await axios.put(`https://expense-tracker-134c6-default-rtdb.firebaseio.com/expenses/${email}/${expenseObj.serverId}.json`,{...expenseObj})

    //      dispatch(setActionHappened())
    //     } catch (error) {
    //         console.log(error)  
    //     }
    //     dispatch(edit({ expense:{},
    //         isEdit:false}))
    // }



}

// api call for delete expense

export const deleteExpense = (id) => {



    return async (dispatch, getState) => {

        try {
            await fetch(`/delete/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            })

            dispatch(setActionHappened())
        } catch (error) {
            console.log(error)
        }

    }

}

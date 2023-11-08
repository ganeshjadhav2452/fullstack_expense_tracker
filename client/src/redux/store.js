import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './slices/authSlice';
import expenseActionManagerSliceReducer from "./slices/expenseActionManagerSlice";
import initialExpenseDataReducer from "./slices/initalExpenseData";
import themeSliceReducer from "./slices/themeSlice";
import leaderboardSlice from "./slices/leaderboardSlice";
import downloadExpensesSlice from "./slices/downloadExpenseSlice";
import paymentSlice from "./slices/paymentSlice";
const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        expenseAction: expenseActionManagerSliceReducer,
        expenseData: initialExpenseDataReducer,
        themeMode: themeSliceReducer,
        leaderboard: leaderboardSlice,
        download: downloadExpensesSlice,
        payment: paymentSlice
    }
})

export default store
import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
const token = localStorage.getItem('token')
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        userDetails: {},
        errorMessage: null,
        success: null,
        isPremiumUser: false,
    },
    reducers: {
        signUpReducer(state, action) {
            state.userDetails = action.payload;
        },
        setErrorMessage(state, action) {
            state.errorMessage = action.payload;
        },
        setSuccess(state, action) {
            state.success = action.payload;
        },
        setIsPremiumUser(state, action) {
            state.isPremiumUser = action.payload;
        },
        setUserDetails(state, action) {
            state.userDetails = action.payload;
        },
    }
})

export const { signUpReducer, setErrorMessage, setSuccess, setIsPremiumUser } = authSlice.actions;

export default authSlice.reducer;


export const signUpUser = (userDetails) => {

    return async (dispatch, getState) => {

        try {
            const response = await axios.post('/user/signup', { ...userDetails })
            dispatch(setSuccess(`Registration Sucessfull ! `))
        } catch (error) {
            dispatch(setErrorMessage(error.response.data))


        }
    }
}

export const signInUser = (userDetails) => {

    return async (dispatch, getstate) => {

        try {
            const response = await axios.post('/user/signin', { ...userDetails })
            dispatch(setSuccess(`Login Sucessfull ! `))
            localStorage.setItem('token', response.data.token)
        } catch (error) {

            dispatch(setErrorMessage(error.message))
        }
    }
}

export const getInitialUserDetails = () => {
    return async (dispatch, getState) => {
        try {
            const token = localStorage.getItem('token');
            const userDetails = await axios.get('/getinitialuserdetails', {
                headers: {
                    "Authorization": token,
                    "Content-Type": "application/json"
                }
            });

            dispatch(setIsPremiumUser(userDetails.data.isPremiumUser))

        } catch (error) {
            console.log(error);
        }
    };
};

export const sendEmailForResetPassword = (email) => {

    return async (dispatch, getState) => {

        try {
            const response = await axios.post('/password/sendemailforresetpassword', { email: email }, {

                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                }
            })

        } catch (error) {
            console.log(error)
        }
    }
}
export const resetpasswordApicall = (email, password, uuid) => {

    return async (dispatch, getState) => {

        try {
            const response = await axios.post(`/resetpassword/${uuid}`, { password: password, email: email }, {
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                }
            })

        } catch (error) {
            console.log(error)
        }
    }
}

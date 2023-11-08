import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getInitialUserDetails } from "../src/redux/slices/authSlice";
import LoaderEl from "./components/UI/Loader/Loader";
// Lazy-loaded components
const AuthPage = lazy(() => import("./components/auth/AuthPage"));
const ExpenseGenerator = lazy(() => import("./components/ExpenseFolder/ExpenseGenerator/ExpenseGenerator"));
const PaymentSuccess = lazy(() => import("./components/UI/paymentSuccess/PaymentSuccess"));
const Leaderboard = lazy(() => import("./components/leaderboard/Leaderboard"));
const ForgotPassword = lazy(() => import('./components/auth/ForgotPassword'));
const EnterNewPassword = lazy(() => import("./components/auth/EnterNewPassword"));
const PrivateComponent = lazy(() => import("./components/auth/PrivateComponent"));

const App = () => {


  return (
    <BrowserRouter>
      <Suspense fallback={<LoaderEl />}>
        <Routes>
          <Route element={<PrivateComponent />}>
            <Route exact path="/dashboard" element={<ExpenseGenerator />} />
            <Route exact path="/paymentsuccess" element={<PaymentSuccess />} />
            <Route exact path="/resetpassword/:uuid" element={<EnterNewPassword />} />
            <Route exact path="/resetpassword" element={<ForgotPassword />} />
            <Route exact path="/leaderboard" element={<Leaderboard />} />
          </Route>
          <Route path="/" element={<AuthPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;

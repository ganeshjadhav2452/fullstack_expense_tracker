import React, { useState, useRef, useEffect } from "react";
import "./AuthPage.css";
import LoaderEl from "../UI/Loader/Loader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { signUpUser, signInUser } from "../../redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { getInitialUserDetails } from "../../redux/slices/authSlice";

function AuthPage() {
  const { errorMessage, success } = useSelector((state) => state.auth)
  const { paymentSuccess } = useSelector((state) => state.payment)

  const [isLogin, setIsLogin] = useState(true);
  const nameRef = useRef();

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate();


  const emailRef = useRef();
  const passRef = useRef();

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    setIsError(false);

    let userDetails;
    if (!isLogin) {
      userDetails = {
        email: emailRef.current.value,
        password: passRef.current.value,
        name: nameRef.current.value

      }
    } else {
      userDetails = {
        email: emailRef.current.value,
        password: passRef.current.value,


      }
    }

    if (isLogin) {
      try {
        setIsLoading(true);
        dispatch(signInUser(userDetails))
        navigate('/dashboard')
        setIsLoading(false);



      } catch (err) {
        setIsLoading(false);
        setIsError(err);

        console.log(err)
      }
    } else {
      setIsError(false);

      try {
        setIsLoading(true);
        await dispatch(signUpUser(userDetails))
        setIsLoading(false);


      } catch (err) {
        setIsLoading(false);
        setIsError(true);
        console.log(err)
      }
    }
  };



  useEffect(() => {
    const getDetails = async () => {
      await dispatch(getInitialUserDetails());
    };
    if (localStorage.getItem("token")) {
      getDetails();
    }
  }, [success, paymentSuccess]);


  return (
    <div>
      {isLoading && <LoaderEl />}
      <section className={"auth"}>
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>
        <form onSubmit={submitHandler}>
          <div className={"control"}>
            <label htmlFor="email">Your Email</label>
            <input type="email" id="email" ref={emailRef} required />
          </div>
          {!isLogin && <div className={"control"}>
            <label htmlFor="name">Enter Your Name</label>
            <input type="text" id="name" ref={nameRef} required />
          </div>}
          <div className={"control"}>
            <label htmlFor="password">Your Password</label>
            <input type="password" id="password" ref={passRef} required />
          </div>

          {success && <p className="text-success">{success}</p>}
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          <div className={"actions"}>
            <button type="submit">{isLogin ? "Log In" : "Sign Up"}</button>
            <Link to='/resetpassword' className={"toggle mb-0"}>forgot password ?</Link>
            <button
              type="button"
              className={"toggle"}
              onClick={switchAuthModeHandler}
            >
              {isLogin ? "Create new account" : "Login with existing account"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default AuthPage;

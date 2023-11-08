import React, { useState, useRef, useEffect } from "react";
import "./AuthPage.css";
import LoaderEl  from "../UI/Loader/Loader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { sendEmailForResetPassword } from "../../redux/slices/authSlice";

function AuthPage() {
    const dispatch = useDispatch()
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const emailRef = useRef();
 
  const submitHandler = async (e) => {
    e.preventDefault();

    setIsError(false);

  
    const email = emailRef.current.value;
   
        try {
            setIsLoading(true)
         await  dispatch(sendEmailForResetPassword(email)) 
           setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
           console.log(error) 
        }
        
  
  };



  return (
    <div>
      {isLoading && <LoaderEl />}
      <section className={"auth"}>
        <h1>{  "Forgot Password" }</h1>
        <form onSubmit={submitHandler}>
          <div className={"control"}>
            <label htmlFor="email">Your Email</label>
            <input type="email" id="email" ref={emailRef} required />
          </div>
       
          {isError && <p className="text-danger">{isError}</p>}
          <div className={"actions"}>
            <button type="submit">Send Mail</button>
           
           
          </div>
        </form>
      </section>
    </div>
  );
}

export default AuthPage;
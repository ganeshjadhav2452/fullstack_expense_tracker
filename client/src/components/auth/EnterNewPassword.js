import React, { useState, useRef } from "react";
import "./AuthPage.css";
import LoaderEl  from "../UI/Loader/Loader";
import { useNavigate ,useParams} from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetpasswordApicall } from "../../redux/slices/authSlice";

function EnterNewPassword() {
    const dispatch = useDispatch()
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const passRef = useRef();
  const emailRef = useRef();
    const {uuid} = useParams()

  const submitHandler = async (e) => {
    e.preventDefault();

    setIsError(false);

  
    const password = passRef.current.value;
    const email = emailRef.current.value;
   
        try {
         
            setIsLoading(true)
         
         await  dispatch(resetpasswordApicall(email,password,uuid)) 
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
            <label htmlFor="email">Your registered Email</label>
            <input type="email" id="email" ref={emailRef} required />
          </div>
          <div className={"control"}>
            <label htmlFor="number">Your New Password</label>
            <input type="number" id="number" ref={passRef} required />
          </div>
       
          {isError && <p className="text-danger">{isError}</p>}
          <div className={"actions"}>
            <button type="submit">update password</button>
           
           
          </div>
        </form>
      </section>
    </div>
  );
}

export default EnterNewPassword;
import React, { useState, useEffect, Fragment } from 'react'
import './ExpenseForm.css'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
// import LogoutButton from '../../AuthPage/LogoutButton';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { updateExpense } from '../../../redux/slices/expenseActionManagerSlice';
import { toggleTheme } from '../../../redux/slices/themeSlice';
import { postDataOnServer } from '../../../redux/slices/initalExpenseData';
import { setActionHappened } from '../../../redux/slices/expenseActionManagerSlice';
import { paymentHandler } from '../../../redux/slices/paymentSlice'
import premiumIcon from '../../../assets/premium-quality.png'
import { getLeaderboardData } from '../../../redux/slices/leaderboardSlice';
import { downloadAllExpenses } from '../../../redux/slices/downloadExpenseSlice';
import { useNavigate } from 'react-router-dom';
function ExpenseForm() {
  //   const obj = useSelector((state)=> state.expenseAction.expense)
  const isEdit = useSelector((state) => state.expenseAction.isEdit);
  const { darkMode, premiumActivated } = useSelector((state) => state.themeMode)
  const { url } = useSelector((state) => state.download)

  const { isPremiumUser } = useSelector((state) => state.auth)
  const dispatch = useDispatch();
  const darkStyle = 'bg-dark border border-2 border-warning text-light'
  const navigate = useNavigate()

  const [submitClicked, setSubmitClicked] = useState(false)

  const email = localStorage.getItem('email')?.replace('@', '').replace('.', '')
  const [formValues, setFormValues] = useState({

    title: '',
    amount: '',
    date: '',
    category: '',
    debitOrCredit: '',

  })

  const titleChangeHandler = (e) => {
    setFormValues((prevObj) => {
      return {
        ...prevObj,
        title: e.target.value,

      }
    })
  }
  const amountChangeHandler = (e) => {
    setFormValues((prevObj) => {
      return {
        ...prevObj,
        amount: e.target.value
      }
    })
  }
  const dateChangeHandler = (e) => {
    setFormValues((prevObj) => {
      return {
        ...prevObj,
        date: e.target.value
      }
    })
  }
  const categoryChangeHandler = (e) => {
    setFormValues((prevObj) => {
      return {
        ...prevObj,
        category: e.target.value
      }
    })
  }
  const debitOrCreditChangeHandler = (e) => {
    setFormValues((prevObj) => {
      return {
        ...prevObj,
        debitOrCredit: e.target.value,

      }
    })


  }

  useEffect(() => {

    const submitHandler = async () => {

      if (!isEdit) {
        if (!formValues.title.trim()) return;

        const localId = uuidv4();

        // Add the ID to the form values
        const formValuesWithId = {
          ...formValues,
          localId: localId
        };

        try {
          await dispatch(postDataOnServer(formValuesWithId));
          dispatch(setActionHappened())
        } catch (error) {
          console.log(error)

        }



        // updateFormValuesChanged(!formValuesChanged)

        // setFormValues({
        //   title:'',
        //   amount:'',
        //   date:'',
        //   category:'',
        //   debitOrCredit:''
        // })

      }

    }



    // const updateHandler = async()=>{
    //   if(isEdit){
    //   const formValuesWithId = {
    //     ...formValues,
    //     id: obj.id,
    //     serverId:obj.serverId
    //   };

    //  await dispatch(updateExpense(formValuesWithId))
    //  updateFormValuesChanged(!formValuesChanged)

    // }

    // }

    // updateHandler()
    submitHandler()
  }, [submitClicked])

  // useEffect(()=>{

  //       setFormValues({
  //         title: obj?.description || '',
  //         date: obj?.date || '',
  //         amount: obj?.amount || '',
  //         debitOrCredit: obj?.debitOrCredit || '',
  //         category: obj?.category || ''
  //       })
  // },[obj])

  const exportClickHandler = async () => {
    try {
      await dispatch(downloadAllExpenses())
      navigate(url)
    } catch (error) {
      console.log(error)

    }
  }

  const buyPremiumClickHandler = async () => {

    try {
      dispatch(paymentHandler());

    } catch (error) {
      console.log(error)
    }
  }

  const logoutClickHandler = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <Fragment>
      <nav class={`navbar navbar-expand-lg bg-body-tertiary d-flex justify-content-between ${darkMode && darkStyle}`}>


        <div>

          {isPremiumUser && <p className="btn  text-light bg-success btn-outline-info m-1" > <img className='premiumImg' src={premiumIcon} /> Activated</p>}
          {!isPremiumUser && <button className='btn  rounded bg-warning  border-dark mb-1' onClick={buyPremiumClickHandler}>Activate <img className='premiumImg' src={premiumIcon} /></button>
          }

          <button className="btn  text-light bg-warning btn-outline-info m-1" onClick={() => dispatch(toggleTheme())}>{darkMode ? 'Light Mode' : 'Dark Mode'}</button>

          {isPremiumUser && <>
            <Link to={'/leaderboard'}> <button className="btn  text-light bg-warning btn-outline-info m-1" onClick={() => dispatch(getLeaderboardData())} >Leaderboard</button></Link>

            <button className="btn  text-light bg-warning btn-outline-info m-1" onClick={exportClickHandler} >Export</button>

          </>
          }
          <button className="btn  text-light bg-warning btn-outline-info m-1" onClick={logoutClickHandler}>Logout</button>




        </div>

        {/* <LogoutButton/> */}

      </nav>

      <div className='container-fluid bg-warning parentContainer' >


        <div class={`text-center pt-5 ${darkMode ? darkStyle : 'bg-warning'}`}>
          <img src="https://i.ibb.co/8cDgdFX/Logo.png" alt="network-logo" width="72" height="72" />
          <h2>Star Expense Tracker</h2>
          <p>
            Below you can fill your expense details .
          </p>
        </div>

        <div class="card">

          <div class={`card-body ${darkMode ? darkStyle : 'bg-warning'} `}>

            <form onSubmit={(e) => {
              e.preventDefault();
              setSubmitClicked(!submitClicked)
            }} id="bookingForm" action="#" method="" class="needs-validation" novalidate autoComplete="on">

              <div class="form-group">
                <label for="inputName">Description</label>
                <input value={formValues.title} onChange={titleChangeHandler} type="text" class="form-control" id="inputName" name="name" placeholder="Description" required />

              </div>
              <div class="form-row">

                <div className='form-group innerDivs col-md-4'>
                  <label for="inputAmount">Amount</label>
                  <input value={formValues.amount} onChange={amountChangeHandler} type="number" class="form-control" id="inputAmount" name="Amount" placeholder="Amount" required />
                </div>





                <div class="form-group innerDivs col-md-4">
                  <label for="inputDate">Date</label>
                  <input value={formValues.date} onChange={dateChangeHandler} type="date" class="form-control" id="inputDate" name="date" required />

                </div>

                <div class="mt-3 form-group innerDivs col-md-4">
                  <label>Start Time</label>
                  <div class="d-flex flex-row justify-content-between align-items-center">
                    <select value={formValues.category} onChange={categoryChangeHandler} class="form-control selection mr-1" id="category" required >
                      <option value="" disabled selected> Expense Category</option>
                      <option >Food</option>
                      <option >Shoping</option>
                      <option >Travel</option>
                      <option >Medical Emergency</option>
                      <option >School Expense</option>
                      <option >Other</option>

                    </select>


                    <select value={formValues.debitOrCredit} onChange={debitOrCreditChangeHandler} class="selection form-control  mr-1" id="category" required>

                      <option   >None</option>
                      <option >Debit</option>
                      <option >Credit</option>


                    </select>
                  </div>



                </div>
              </div>
              {/* {!isEdit && <button class="btn btn-warning border border-dark btn-block col-lg-3 m-auto" type="submit" >Add Expense</button>} */}
              <button class="btn btn-warning border border-dark btn-block col-lg-3 m-auto" type="submit" >Add Expense</button>

              {/* {isEdit &&  <button class="btn btn-info border border-dark btn-block col-lg-3 m-auto" type="submit" >Update Expense</button>} */}
            </form>

          </div>

        </div>





      </div>
    </Fragment>
  )
}

export default ExpenseForm
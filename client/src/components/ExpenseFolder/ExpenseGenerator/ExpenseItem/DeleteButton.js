import React,{useContext, useEffect, useState} from 'react'

import axios from 'axios';
import { deleteExpense } from '../../../../redux/slices/expenseActionManagerSlice';
import { useDispatch } from 'react-redux';
function DeleteButton({ id}) {

  const dispatch = useDispatch()
 
  const [deleteClicked, setDeleteClicked] = useState(false)


  useEffect(()=>{
   
    const removeExpenseFromServer=async()=>{
      
    try {
      await dispatch(deleteExpense(id))
    } catch (error) {
      console.log(error)
    }
   
    }
    if(deleteClicked){
      removeExpenseFromServer()
    }
   
  },[deleteClicked])
  return <button onClick={()=>( setDeleteClicked(true))} className='btn-danger rounded '>Delete</button>
}

export default DeleteButton
import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
import './ExpenseGenerator.css'
import LoaderEl from '../../UI/Loader/Loader'

import { fetchDataFromServer } from '../../../redux/slices/initalExpenseData'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { toggleTheme } from '../../../redux/slices/themeSlice'
import { getInitialUserDetails } from '../../../redux/slices/authSlice'
const ExpenseForm = lazy(() => import('../ExpenseForm/ExpenseForm'))
const ExpenseItem = lazy(() => import('./ExpenseItem/ExpenseItem'))


function ExpenseGenerator() {

    const [credit, setCredit] = useState(0)
    const [debit, setDebit] = useState(0)
    let { data, noExpense, totalExpenses, limit } = useSelector((state) => state.expenseData)
    const { darkMode, setIsPremium } = useSelector((state) => state.themeMode)
    const { actionHappened } = useSelector((state) => state.expenseAction)
    const dispatch = useDispatch()
    const limitRef = useRef(5)
    let pageLimit = Number(limitRef.current.value)
    let pageNum = 1
    const darkStyle = 'bg-dark border border-2 border-warning text-warning'
    if (!data) data = []



    const totalPageCalculator = useCallback((total, limit) => {
        const pages = [];// 1 2 3 4 

        for (let i = 0; i <= (total / limit); i++) {  // 17 / 5 = 3
            pages.push(i + 1)
        }
        return pages;
    }, [])


    const loadPageClickHandler = useCallback((num, limitValue) => {

        dispatch(fetchDataFromServer(num, Number(limitValue)))
    })

    useEffect(() => {
        let dataCredit = 0;
        let dataDebit = 0;
        for (let i = 0; i < data.length; i++) {

            if (data[i].debitOrCredit === 'Credit') dataCredit += Number.parseInt(data[i].amount)
            if (data[i].debitOrCredit === 'Debit') dataDebit += Number.parseInt(data[i].amount)

        }
        setCredit(dataCredit)
        setDebit(dataDebit)
    }, [data])

    useEffect(() => {

        dispatch(fetchDataFromServer(1, 5))

    }, [actionHappened, pageNum, pageLimit])

    useEffect(() => {
        const getDetails = async () => {
            await dispatch(getInitialUserDetails());
        };
        if (localStorage.getItem("token")) {
            getDetails();
        }
    }, []);
    return (
        <div className='parent p-3'>
            <div className=''>
                <Suspense fallback={<LoaderEl />}>  <ExpenseForm /></Suspense>
            </div>

            <div className={`screen-600 container d-flex align-items-center ${darkMode ? darkStyle : 'bg-warning '}  p-3 `} style={{ borderRadius: '0.5rem' }}>


                <div className="screen-600  table-wrapper mr-3 w-75 d-flex flex-column align-items-center">
                    <h2 className={`${darkMode ? 'text-warning ' : 'text-dark border border-dark'} fw-bold h3`}>Expense Table</h2>
                    <table className={`fl-table ${darkMode ? darkStyle : ''}`}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Amount</th>
                                <th>Catagory</th>
                                <th>Credit/Debit</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!noExpense && data.map((item) => {

                                return (
                                    <Suspense fallback={<p>loading...</p>}>  <ExpenseItem key={item.id} id={item.id} title={item.title} amount={item.amount} date={item.date} debitOrCredit={item.debitOrCredit} category={item.category} /></Suspense>
                                )
                            })}


                        </tbody>
                    </table>
                    {noExpense && <h4 className='alert alert-danger'>No Expenses Avilable Please Add Some...</h4>}
                    <nav aria-label="Page navigation example " style={{ marginTop: '2rem' }}>
                        <ul className="pagination">

                            {
                                totalPageCalculator(totalExpenses, limit).map((num) => {
                                    pageNum = num
                                    return <li key={num} onClick={() => loadPageClickHandler(num, pageLimit)} className="page-item"><button className="page-link">{num}</button></li>
                                })
                            }

                            <div className='d-flex flex-column' style={{ marginLeft: '1rem', marginTop: '-1rem' }} >
                                <label htmlFor="selectLimit">Select Limit</label>
                                <select id='selectLimit' className="page-item " ref={limitRef} >
                                    <option className="page-link" value={5}>5</option>
                                    <option className="page-link" value={10}>10</option>
                                    <option className="page-link" value={15}> 15</option>
                                </select>
                            </div>

                        </ul>
                    </nav>
                </div>

                <div className={` calculator border  rounded   shadow w-25 d-flex flex-column align-items-center p-2 justify-content-center ${darkMode ? darkStyle + 'border-warning' : 'border-dark bg-light'}`} style={{ height: '14rem', boxShadow: '0px 35px 50px rgba( 0, 0, 0, 0.2 )' }}>

                    <h5>Realtime Expense </h5>
                    <span className='text-success fw-bold h5 mt-1'>Credit ₹{credit}</span>
                    <span className='text-danger fw-bold h5 mt-1'>Debit ₹{debit}</span>
                    <hr className='bg-danger w-100 mt-0' />
                    <span className={` fw-bold h5 ${credit - debit <= 0 ? 'text-danger' : 'text-success'}`}>Total ₹{credit - debit}</span>
                </div>
            </div>

        </div>
    )
}

export default ExpenseGenerator
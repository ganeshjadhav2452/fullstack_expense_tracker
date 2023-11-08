const express = require('express')
const router = express.Router()
 const userControllers = require('../controllers/userControllers')
const expenseControllers = require('../controllers/expenseControllers')
const verifyUser = require('../middleware/verifyUser')
const paymentController = require('../controllers/paymentController')
const leaderboardControllers = require('../controllers/leaderboardControllers')
const awsS3Controllers  = require('../controllers/awsS3Controllers')


router.post('/user/signup',userControllers.signUp)
router.post('/password/sendemailforresetpassword',userControllers.sendMailForResetPassword)
router.post('/resetpassword/:uuid',userControllers.resetPassword)

router.post('/user/signin',userControllers.signIn)

router.get('/getinitialuserdetails',verifyUser,userControllers.getInitialUserDetails)

router.post('/postexpense',verifyUser,expenseControllers.postExpense)
router.get('/getexpenses',verifyUser,expenseControllers.getExpenses)
router.delete('/delete/:id',verifyUser,expenseControllers.deleteExpense)

router.post('/checkout',verifyUser,paymentController.createOrder)
router.post('/verifypayment',verifyUser,paymentController.verifyPayment)


router.get('/premium/showdleaderboard',verifyUser,leaderboardControllers.getLeaderboardData)

router.get('/download',verifyUser,awsS3Controllers.downloadExpenses)
module.exports = router;


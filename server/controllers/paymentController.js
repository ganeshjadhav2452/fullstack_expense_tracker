const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/orderModel");
const User = require('../models/userModel')
const sequelize = require('../utils/database')
require('dotenv').config()


const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRETE,
});

module.exports = paymentController = {
  createOrder: async (req, res) => {
    const transactionObj = await sequelize.transaction()
    try {
      await instance.orders.create(
        { amount: 50000, currency: "INR" },
        async (err, order) => {
          if (err) {
            throw new Error(err);
          }
        
          try {
            await Order.create({
              orderId: order.id,
              status: "PENDING",
            },{transaction:transactionObj});

            await transactionObj.commit()
          } catch (error) {
            await transactionObj.rollback()
            console.log(error);
            res.status(500).send("sorry payment request failed");
          }
          res.status(200).json({ data: { ...order, key_id: instance.key_id } });
        }
        );
      } catch (error) {
      await transactionObj.rollback()
      res.status(403).json({ message: "something went wrong", error: error });
    }
  },

  verifyPayment: async (req, res) => {
    const transactionObj = await sequelize.transaction()
    
    const body =
      req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", instance.key_secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === req.body.razorpay_signature) {
      try {
        await Order.update({status: 'SUCCESS'}, {where: { orderId: req.body.razorpay_order_id },transaction:transactionObj
        })

        await User.update({isPremiumUser:true},{where:{id:req.userId},transaction:transactionObj})

        await transactionObj.commit()
      } catch (error) {
        await transactionObj.rollback()
        console.log(error)
      }
      res.status(200).json({ message: "payment sucessfull" });

    } else {
      res.status(500).json({ message: "payment failed" });
    }
  },
};

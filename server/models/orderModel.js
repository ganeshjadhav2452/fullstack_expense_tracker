const SequelizePackage = require('sequelize')

const sequelize = require('../utils/database');
const User = require('./userModel');


const Order = sequelize.define('order',{
    id:{
        type:SequelizePackage.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true

    },
   
    orderId:SequelizePackage.STRING,
    status:SequelizePackage.STRING,
})

module.exports = Order;

User.hasMany(Order)
Order.belongsTo(User)
const SequelizePackage = require('sequelize')
const Expense = require('./expenseModel')
const sequelize = require('../utils/database')


const User = sequelize.define('user',{
    id:{
        type:SequelizePackage.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    name:{
        type:SequelizePackage.STRING,
        allowNull:false
    },
    email:{
        type:SequelizePackage.STRING,
        allowNull:false
    },
    password:{
        type:SequelizePackage.STRING,
        allowNull:false,

    },
    isPremiumUser:{
        type:SequelizePackage.BOOLEAN
    },
    total_cost:{
        type:SequelizePackage.BIGINT
    }

})

module.exports =  User;

User.hasMany(Expense)


Expense.belongsTo(User)

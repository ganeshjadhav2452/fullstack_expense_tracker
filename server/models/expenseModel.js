const SequelizePackage = require('sequelize')

const sequelize = require('../utils/database')


const Expense = sequelize.define('expense',{
    id:{
        type:SequelizePackage.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    title:{
        allowNull:false,
        type:SequelizePackage.STRING,
    },
    amount:{
        allowNull:false,
        type:SequelizePackage.BIGINT,
    },
    date:{
        allowNull:false,
        type:SequelizePackage.DATE,
    },
    category:{
        allowNull:false,
        type:SequelizePackage.STRING,
    },
    debitOrCredit:{
        allowNull:false,
        type:SequelizePackage.STRING,
    }
})

module.exports = Expense;
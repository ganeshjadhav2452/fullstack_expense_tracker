const SequelizePackage = require('sequelize')
const sequelize = require('../utils/database')
const User = require('./userModel');

const ForgotPasswordRequest = sequelize.define('forgotPasswordRequest',{
    
    id:{
        type:SequelizePackage.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
    },
    uuid:{
        type:SequelizePackage.STRING,
        allowNull:false
    },
    isActive:{
        type:SequelizePackage.BOOLEAN,
        
    },

})

User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User)

module.exports = ForgotPasswordRequest
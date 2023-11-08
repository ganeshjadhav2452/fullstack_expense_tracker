const Expense = require('../models/expenseModel');
const User = require('../models/userModel');
const sequelize = require('sequelize');

module.exports = leaderboardControllers = {
    getLeaderboardData: async (req, res) => {
        let data = [];

        try {

            const leaderboardofusers = await User.findAll({
                attributes: ['id', 'name', 'total_cost'],

                group: ['user.id'],
                order: [['total_cost', 'DESC']],

                limit: 5
            })

            res.status(200).json({ leaderboardofusers })
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: 'sorry something went wrong' })
        }
    }
}
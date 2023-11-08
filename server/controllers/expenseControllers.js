const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../utils/database");

module.exports = expenseControllers = {
  postExpense: async (req, res) => {
    const transactionObj = await sequelize.transaction();
    try {
      const response = await Expense.create(
        {
          userId: req.userId,
          title: req.body.title,
          amount: Number(req.body.amount),
          debitOrCredit: req.body.debitOrCredit,
          category: req.body.category,
          date: req.body.date,
        },
        { transaction: transactionObj }
      );

      const tCost = await User.findAll({ where: { id: req.userId } });

      await User.update(
        { total_cost: tCost[0]?.total_cost + Number(req.body.amount) },
        { where: { id: req.userId }, transaction: transactionObj }
      );

      await transactionObj.commit();
      res.status(200).send(response.data);
    } catch (error) {
      await transactionObj.rollback();
      console.log(error);
      res.status(500).send({ error: "sorry expense cannot be posted" });
    }
  },

  getExpenses: async (req, res) => {


    try {
      const page = req.query.page ? Number(req.query.page) : 1; //3
      const size = req.query.size ? Number(req.query.size) : 10; //5
      const skip = (page - 1) * size;  // ( 3 - 1 = 2) * 5 = 10
      // ( 3 - 1 = 2) * 10 = 20 ; 

      const total = await Expense.count({ where: { userId: req.userId } });
      const response = await Expense.findAll({
        where: { userId: req.userId },
        offset: skip,
        limit: size,
      });

      res.status(200).json({ response, total, page, size });
    } catch (error) {

      res.status(500).send({ error: "sorry expense cannot be fetched" });
    }

  },

  deleteExpense: async (req, res) => {
    const transactionObj = await sequelize.transaction();
    try {
      const tCost = await User.findAll({ where: { id: req.userId } });


      const expenseAmount = await Expense.findAll(
        { where: { id: req.params.id } },
        { transaction: transactionObj }
      );

      await User.update(
        { total_cost: tCost[0].total_cost - expenseAmount[0].amount },
        { where: { id: req.userId }, transaction: transactionObj }
      );

      await Expense.destroy(
        { where: { id: req.params.id } } && {
          where: { userId: req.userId, id: req.params.id },
          transaction: transactionObj,
        }
      );

      await transactionObj.commit();

      res.status(200).send("Expense Deleted Successfully.");
    } catch (error) {
      await transactionObj.rollback();
      console.log(error);
      res.status(500).send("Something went wrong.");
    }
  },
};

const User = require("../models/userModel");
const Bcrypt = require("bcryptjs");
const Jwt = require("jsonwebtoken");
const sequelize = require("../utils/database");

const Sib = require("sib-api-v3-sdk");
const ForgotPasswordRequest = require("../models/ForgotPasswordRequestModel");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config({ path: "../.env" });

module.exports = userControllers = {
  signUp: async (req, res) => {
    const transactionObj = await sequelize.transaction();

    const userExists = await User.findAll(
      { where: { email: req.body.email } },
      { transaction: transactionObj }
    );



    if (userExists.length === 0) {
      const bcryptedPassword = await Bcrypt.hash(req.body.password, 10);
      try {
        const result = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: bcryptedPassword,
          total_cost: 0,
        });

        await transactionObj.commit();
        res.status(200).send(result);
      } catch (error) {
        await transactionObj.rollback();
        console.log(error);
        res.status(400).send("sorry something went wrong");
      }
    } else {
      res.status(409).send("sorry this user is already registered !");
    }
  },

  signIn: async (req, res) => {

    const email = req.body.email;

    const isUserEmailExists = await User.findAll({ where: { email: email } });

    const password = await Bcrypt.compare(
      req.body.password,
      isUserEmailExists[0].password
    );

    if (isUserEmailExists.length === 0) {
      return res.status(404).send("User Not Found !");
    } else if (password && isUserEmailExists[0].email == email) {
      return Jwt.sign(
        { id: isUserEmailExists[0].id },
        process.env.JWT_SECRETE_KEY,

        (err, token) => {
          res.status(200).json({
            token: token,
            isPremiumUser: isUserEmailExists[0].isPremiumUser,
          });
        }
      );
    } else {
      return res
        .status(401)
        .send("sorry the password you've entered is wrong !");
    }
  },

  getInitialUserDetails: async (req, res) => {
    try {
      const userDetails = await User.findAll({ where: { id: req.userId } });

      res.status(200).json({
        isPremiumUser: userDetails[0].isPremiumUser,
        email: userDetails[0].email,
        name: userDetails[0].name,
      });
    } catch (error) {
      console.log(error);
      res.status(404).json({ message: "sorry user not found" });
    }
  },

  sendMailForResetPassword: async (req, res, next) => {
    const isUserRegistered = await User.findAll({
      where: { email: req.body.email },
    });

    if (isUserRegistered.length === 0) {
      return res
        .status(404)
        .json({
          message: `Sorry no registered user found with email ${req.body.email}`,
        });
    }
    const client = Sib.ApiClient.instance;

    let apiKey = (client.authentications["api-key"].apiKey =
      process.env.SMTP_KEY);


    const transactionEmailApi = new Sib.TransactionalEmailsApi();

    try {
      const uuid = uuidv4();
      const response = await ForgotPasswordRequest.create({
        uuid: uuid,
        isActive: true,
      });

      const sender = {
        email: "ganeshgfxlite2452@gmail.com",
        name: "Ganesh Jadhav",
      };

      const receivers = [
        {
          email: req.body.email,
        },
      ];

      transactionEmailApi
        .sendTransacEmail({
          sender,
          to: receivers,
          subject: "hi this is ganesh jadhav from ganesh jadhav gfx id",
          htmlContent: `<!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Password Reset</title>
          </head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
          
              <table style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd;">
                  <tr>
                      <td style="text-align: center;">
                          <h1>Password Reset</h1>
                      </td>
                  </tr>
                  <tr>
                      <td>
                          <p>Hello,</p>
                          <p>We received a request to reset the password associated with this email address. If you didn't initiate this request, you can safely ignore this email.</p>
                          <p>To reset your password, please click the button below:</p>
                          <p style="text-align: center;">
                              <a href="http://localhost:3000/resetpassword/${uuid}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
                          </p>
                          <p>If the button doesn't work, you can also copy and paste the following link into your browser:</p>
                          <p>http://localhost:3000/resetpassword/${uuid}</p>
                         
                         
                          <p>Thank you,</p>
                          <p>The Start Expense Team</p>
                      </td>
                  </tr>
              </table>
          
          </body>
          </html>
          `,
        })
        .then(console.log)
        .catch(console.log);

      res.status(200).json({ message: "mail sended successfuly" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "sorry your reset password link can not be sent" });
    }
  },

  resetPassword: async (req, res) => {
    const transactionObj = await sequelize.transaction();

    const isRequestActive = await ForgotPasswordRequest.findAll({
      where: { uuid: req.params.uuid },
    });

    if (isRequestActive[0].isActive === false) {
      return res.status(500).json({ message: "sorry this url is expired !" });
    }

    try {
      const bcryptedPassword = await Bcrypt.hash(req.body.password, 10);
      const response = await User.update(
        { password: bcryptedPassword },
        { where: { email: req.body.email } },
        { transaction: transactionObj }
      );

      const response2 = await ForgotPasswordRequest.update(
        { isActive: false },
        { where: { uuid: req.params.uuid } },
        { transaction: transactionObj }
      );

      await transactionObj.commit();
      res
        .status(200)
        .json({ message: "your password has been updated successfully" });
    } catch (error) {
      await transactionObj.rollback();
      console.log(error);
      res
        .status(404)
        .json({ message: "sorry user not found with this mail id" });
    }
  },
};

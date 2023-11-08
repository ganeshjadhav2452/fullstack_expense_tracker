const jwt = require('jsonwebtoken');
require('dotenv').config()

const verifyUser = (req, res, next) => {
  let token = req.headers['authorization'];

  try {
    // Verify the token using HS256 algorithm and the shared secret key

    let verified = jwt.verify(token, process.env.JWT_SECRETE_KEY);
    req.userId = verified.id



    next();
  } catch (error) {

    res.status(401).send('user authentication failed');
  }
};

module.exports = verifyUser;

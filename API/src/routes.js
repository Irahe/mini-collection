const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

module.exports = (serverParams) => {
  //authentication
  authRoutes(serverParams);

  //model routes
  userRoutes(serverParams);

}
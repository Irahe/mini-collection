const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const mediaRoutes = require('./routes/mediaRoutes');

module.exports = (serverParams) => {
  //authentication
  authRoutes(serverParams);

  //model routes
  userRoutes(serverParams);
  mediaRoutes(serverParams);

}
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const itemRoutes = require('./routes/itemRoutes');

module.exports = (serverParams) => {
  //authentication
  authRoutes(serverParams);

  //model routes
  mediaRoutes(serverParams);
  userRoutes(serverParams);
  collectionRoutes(serverParams);
  itemRoutes(serverParams);

}
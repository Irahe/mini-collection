const authController = require('../controllers/authController');
const errorController = require('../controllers/errorController');
const itemController = require('../controllers/itemController');

module.exports = ({ server, db }) => {
  server.get('/items/', async function (req, res) {
    req.requester = await authController.verifyToken(req, res, db, 'op');
    if (req?.requester) {
      itemController.getAll(req, res, db).catch((error) => {
        errorController.InternalServerError(error, res);
      })
    }
  });
  server.get('/items/:collection_id', async function (req, res) {
    req.requester = await authController.verifyToken(req, res, db, 'user');
    if (req?.requester) {
      itemController.getAllFromCollection(req, res, db).catch((error) => {
        errorController.InternalServerError(error, res);
      })
    }
  });
  server.get('/item/:id', async function (req, res) {
    req.requester = await authController.verifyToken(req, res, db, 'user');
    if (req?.requester) {
      itemController.get(req, res, db).catch((error) => {
        errorController.InternalServerError(error, res);
      })
    }
  });
  server.post('/item/', async function (req, res) {
    req.requester = await authController.verifyToken(req, res, db, 'user');
    if (req?.requester) {
      itemController.create(req, res, db).catch((error) => {
        errorController.InternalServerError(error, res);
      });
    }
  });
  server.put('/item/', async function (req, res) {
    req.requester = await authController.verifyToken(req, res, db, 'user');
    if (req?.requester) {
      itemController.update(req, res, db).catch((error) => {
        errorController.InternalServerError(error, res);
      })
    }
  });
  server.del('/item/:id', async function (req, res) {
    req.requester = await authController.verifyToken(req, res, db, 'user');
    if (req?.requester) {
      itemController.delete(req, res, db).catch((error) => {
        errorController.InternalServerError(error, res);
      })
    }
  });
}
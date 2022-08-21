const authController = require('../controllers/authController');
const errorController = require('../controllers/errorController');
const userController = require('../controllers/userController');

module.exports = ({ server, db }) => {
  server.get('/users/', async function (req, res) {
    req.requester = await authController.verifyToken(req, res, db, 'op');
    if (req?.requester) {
      userController.getAll(req, res, db).catch((error) => {
        errorController.InternalServerError(error, res);
      })
    }
  });
  server.get('/user/:id', async function (req, res) {
    req.requester = await authController.verifyToken(req, res, db, 'user');
    if (req?.requester) {
      userController.get(req, res, db).catch((error) => {
        errorController.InternalServerError(error, res);
      })
    }
  });
  server.post('/user/', async function (req, res) {
    userController.create(req, res, db).catch((error) => {
      errorController.InternalServerError(error, res);
    })
  });
  server.put('/user/', async function (req, res) {
    req.requester = await authController.verifyToken(req, res, db, 'user');
    if (req?.requester) {
      userController.update(req, res, db).catch((error) => {
        errorController.InternalServerError(error, res);
      })
    }
  });
  server.del('/user/:id', async function (req, res) {
    req.requester = await authController.verifyToken(req, res, db, 'user');
    if (req?.requester) {
      userController.delete(req, res, db).catch((error) => {
        errorController.InternalServerError(error, res);
      })
    }
  });
  server.put('/user/:id/op', async function (req, res) {
    req.requester = await authController.verifyToken(req, res, db, 'op');
    if (req?.requester) {
      userController.op(req, res, db).catch((error) => {
        errorController.InternalServerError(error, res);
      })
    }
  });
}
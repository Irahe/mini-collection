const userController = require('../controllers/userController');
const errorController = require('../controllers/errorController');

module.exports = ({ server, db }) => {
  server.get('/users/', async function (req, res) {
    userController.getAll(req, res, db).catch((error) => {
      errorController.InternalServerError(error, res);
    })
  });
  server.get('/user/:id', async function (req, res) {
    userController.get(req, res, db).catch((error) => {
      errorController.InternalServerError(error, res);

    })
  });
  server.post('/users/', async function (req, res) {
    userController.create(req, res, db).catch((error) => {
      errorController.InternalServerError(error, res);

    })
  });
  server.put('/users/', async function (req, res) {
    userController.update(req, res, db).catch((error) => {
      errorController.InternalServerError(error, res);
    })
  });
  server.del('/user/:id', async function (req, res) {
    userController.delete(req, res, db).catch((error) => {
      errorController.InternalServerError(error, res);
    })
  });
  server.put('/user/:id/op', async function (req, res) {
    userController.op(req, res, db).catch((error) => {
      errorController.InternalServerError(error, res);
    })
  });
}
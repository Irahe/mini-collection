const errorController = require('../controllers/errorController');
const authController = require('../controllers/authController');

module.exports = ({ server, db }) => {
  server.post('/auth/login/', async function (req, res) {
    authController.login(req, res, db).catch((error) => {
      errorController.InternalServerError(error, res);
    })
  });
  server.post('/auth/recover/', async function (req, res) {
    authController.recoverPassword(req, res, db).catch((error) => {
      errorController.InternalServerError(error, res);
    })
  });
  server.post('/auth/change/', async function (req, res) {
    req.requester = await authController.verifyToken(req, res, db, 'user');
    if (req?.requester) {
      authController.changePassword(req, res, db).catch((error) => {
        errorController.InternalServerError(error, res);
      })
    } else {
      errorController.Unauthorized(res);
    }
  });
}
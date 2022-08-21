const authController = require('../controllers/authController');
const errorController = require('../controllers/errorController');
const mediaController = require('../controllers/mediaController');

module.exports = ({ server, db }) => {
  server.post('/media/upload/', async function (req, res) {
    req.requester = await authController.verifyToken(req, res, db, 'user');
    if (req?.requester) {
      mediaController.upload(req, res, db).catch((error) => {
        errorController.InternalServerError(error, res);
      })
    } else {
      errorController.Unauthorized(res);
    }
  });
  server.get('/media/:name', async function (req, res) {
    mediaController.get(req, res, db).catch((error) => {
      errorController.InternalServerError(error, res);
    })
  });
}
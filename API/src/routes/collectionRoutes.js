const authController = require('../controllers/authController');
const errorController = require('../controllers/errorController');
const collectionController = require('../controllers/collectionController');

module.exports = ({ server, db }) => {
  server.get('/collection/', async function (req, res) {
    req.requester = await authController.verifyToken(req, res, db, 'user');
    if (req?.requester) {
      collectionController.getAll(req, res, db).catch((error) => {
        errorController.InternalServerError(error, res);
      })
    } else {
      errorController.Unauthorized(res);
    }
  });
  server.get('/collection/:id', async function (req, res) {
    req.requester = await authController.verifyToken(req, res, db, 'collection');
    if (req?.requester) {
      collectionController.get(req, res, db).catch((error) => {
        errorController.InternalServerError(error, res);
      })
    } else {
      errorController.Unauthorized(res);
    }
  });
  server.post('/collection/', async function (req, res) {
    collectionController.create(req, res, db).catch((error) => {
      errorController.InternalServerError(error, res);
    })
  });
  server.put('/collection/', async function (req, res) {
    req.requester = await authController.verifyToken(req, res, db, 'collection');
    if (req?.requester) {
      collectionController.update(req, res, db).catch((error) => {
        errorController.InternalServerError(error, res);
      })
    } else {
      errorController.Unauthorized(res);
    }
  });
  server.del('/collection/:id', async function (req, res) {
    req.requester = await authController.verifyToken(req, res, db, 'collection');
    if (req?.requester) {
      collectionController.delete(req, res, db).catch((error) => {
        errorController.InternalServerError(error, res);
      })
    } else {
      errorController.Unauthorized(res);
    }

  });
  server.post('/collection/:id/share/', async function (req, res) {
    collectionController.share(req, res, db).catch((error) => {
      errorController.InternalServerError(error, res);
    })
  });
  server.post('/collection/:id/unshare/', async function (req, res) {
    collectionController.unshare(req, res, db).catch((error) => {
      errorController.InternalServerError(error, res);
    })
  });
}
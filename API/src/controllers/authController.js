const sha1 = require('sha1');
const errorController = require('./errorController');
const jwt = require('jsonwebtoken');
const hasher = require('../util/crc32Hash')


module.exports = {

  async login(req, res, db) {
    let data = await db('user')
      .where('email', req?.body?.email)
      .andWhere({ 'password': sha1(req?.body?.password) })
      .first();
    if (!data) {
      errorController.Unauthorized(res);
      return;
    } else {
      delete data.password;
      jwt.sign({ data }, process?.env?.SERVER_SECRET, (err, token) => {
        if (!err) {
          res.json({ status: 'success', data: { token, user: data } });
        } else {
          throw new Error('Token could not be created.');
        }
      });
    }
  },

  async verifyToken(req, res, db, context) {
    const bearerHeader = req.headers['authorization'];
    if (bearerHeader) {
      const tkn = bearerHeader.split(' ')[1];
      const data = await jwt.verify(tkn, process.env.SERVER_SECRET, async (err, tokenData) => {
        if (err) {
          errorController.Unauthorized(res);
          return;
        } else {
          const user = await db('user').where({ id: tokenData?.data?.id }).first();
          if (tokenData?.data && user) {
            if (context !== 'user' && context !== user?.role) {
              errorController.Unauthorized(res);
              return
            }
            return user;
          } else {
            errorController.Unauthorized(res);
            return;
          }
        }
      });
      return data;
    } else {
      errorController.Unauthorized(res);
      return;
    }
  },

  async recoverPassword(req, res, db) {
    const data = await db('user')
      .where('email', req?.body?.email)
      .first();
    if (data) {
      const today = new Date();
      const new_password = hasher.hash(`${data.name}-${data.email}-${data.password}-${today.getTime()}`, 'crc32');

      //send email to user here
      console.log(new_password);

      await db('user').where({ id: data?.id }).update({ 'password': sha1(new_password) });

      res.json({ status: 'success', data: {} });
    } else {
      errorController.NotFound(res);
    }
  },

  async changePassword(req, res, db) {
    const data = await db('user')
      .where('email', req?.body?.email)
      .andWhere('password', sha1(req?.body?.password))
      .andWhere('id', req?.requester?.id)
      .first();
    if (data) {
      //muda a senha do cara
      await db('user').where({ ...data }).update({ 'password': sha1(req?.body?.new_password) });
      res.send(200, { status: 'success', data: {} })
    } else {
      errorController.Unauthorized(res);
      return;
    }

  }
}
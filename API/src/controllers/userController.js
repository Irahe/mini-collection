const errorController = require('./errorController');
const userModel = require('../models/user');
const sha1 = require('sha1');

module.exports = {
  async getAll(req, res, db) {
    //é onde agt pega os dados dos usuários
    const users = await db.select('*').from('user');
    res.send(200, { status: 'success', data: users });
  },

  async get(req, res, db) {
    const { id } = req.params;
    if (!id) {
      errorController.InvalidRequest('You should provide a valid id', res);
      return;
    }
    const user = await db.select('*').from('user').where({ id }).first();
    if (!user) {
      res.send(errorController.NotFound(res));
    } else {
      res.send(200, { status: 'success', data: user });
    }
  },

  async create(req, res, db) {
    let data = req.body;
    const { error: validationError } = userModel.validate(data)
    if (validationError) {
      errorController.InvalidRequest(validationError?.details, res);
      return;
    }
    data.password = sha1(data.password)

    await db('user').insert(data);

    res.send(201, { status: 'success', data: {} });
  },

  async update(req, res, db) {
    const data = req.body;
    const { id } = data;
    if (!id) {
      errorController.InvalidRequest('Id is querired');
    }

    if (data?.password) {
      data.password = sha1(data.password)
    }

    //avoid role injection
    delete data.role;

    await db('user').where({ id }).update(data);

    res.send(200, { status: 'success', data: {} });
  },

  async delete(req, res, db) {
    const { id } = req.params;

    await db('user').where({ id }).del();

    res.send(200, { status: 'success', data: {} });

  },

  async op(req, res, db) {
    const { id } = req.params;
    if (!id) {
      errorController.InvalidRequest('Id is querired');
    }

    await db('user').where({ id }).update({ role: 'op' });

    res.send(200, { status: 'success', data: {} });
  },
}
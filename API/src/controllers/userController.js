const errorController = require('./errorController');
const sha1 = require('sha1');

module.exports = {
  async getAll(req, res, db) {
    //é onde agt pega os dados dos usuários
    const users = await db.select('*').from('user');
    res.send(200, { status: 'success', data: users.map(user => { delete user.password; return user }) });
  },

  async get(req, res, db) {
    const { id } = req.params;

    if (!id) {
      errorController.InvalidRequest('Id is required', res);
      return;
    }

    if (req?.requester?.id !== Number(id) && req?.requester?.role !== 'op') {
      errorController.Unauthorized(res);
      return;
    }

    const user = await db.select('*').from('user').where({ id }).first();
    if (!user) {
      errorController.NotFound(res);
    } else {
      res.send(200, { status: 'success', data: user });
    }
  },

  async create(req, res, db) {
    let data = req.body;

    //check if the user already exists
    const existingUser = await db('user').where({ email: data?.email }).first();
    if (existingUser) {
      errorController.InvalidRequest('A user with this email already exists. Please, recover or choose a different one.', res);
      return;
    }

    data.password = sha1(data.password);

    await db('user').insert(data);

    res.send(201, { status: 'success', data: {} });
  },

  async update(req, res, db) {
    const data = req.body;
    const { id } = data;
    if (!id) {
      errorController.InvalidRequest('Id is required', res);
      return;
    }

    if (req?.requester?.id !== Number(id) && req?.requester?.role !== 'op') {
      errorController.Unauthorized(res);
      return;
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

    if (!id) {
      errorController.InvalidRequest('Id is required', res);
      return;
    }

    if (req?.requester?.id !== Number(id) && req?.requester?.role !== 'op') {
      errorController.Unauthorized(res);
      return;
    }

    await db('user').where({ id }).del();

    res.send(200, { status: 'success', data: {} });

  },

  async op(req, res, db) {
    const { id } = req.params;
    if (!id) {
      errorController.InvalidRequest('Id is required', res);
      return;
    }

    await db('user').where({ id }).update({ role: 'op' });

    res.send(200, { status: 'success', data: {} });
  },
}
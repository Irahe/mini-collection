const errorController = require('./errorController');
const collectionController = require('./collectionController');
const sha1 = require('sha1');
const mediaController = require('./mediaController');

module.exports = {
  async getAll(req, res, db) {
    //é onde agt pega os dados dos usuários
    const items = await db.select('*').from('item');
    res.send(200, { status: 'success', data: items });
  },

  async getAllFromCollection(req, res, db) {
    //é onde agt pega os dados dos usuários
    const items = await db.select('*').from('item').where({ collection_id: req?.params?.collection_id });
    res.send(200, { status: 'success', data: items });
  },

  async get(req, res, db) {
    const { id } = req.params;

    if (!id) {
      errorController.InvalidRequest('Id is required', res);
      return;
    }

    const item = await db('item').where({ id }).first();
    const canRead = await collectionController.canRead(req?.requester?.id, item?.collection_id, db);
    if (!canRead) {
      errorController.Unauthorized(res);
      return;
    }

    if (!item) {
      errorController.NotFound(res);
    } else {
      res.send(200, { status: 'success', data: item });
    }
  },

  async create(req, res, db) {
    let data = req.body;

    const canEdit = await collectionController.canEdit(req?.requester?.id, data?.collection_id, db);
    if (!canEdit) {
      errorController.Unauthorized(res);
      return;
    }

    await db('item').insert(data);

    res.send(201, { status: 'success', data: {} });
  },

  async update(req, res, db) {
    const data = req.body;
    const { id } = data;
    if (!id) {
      errorController.InvalidRequest('Id is required', res);
      return;
    }

    const item = await db('item').where({ id }).first();
    const canEdit = await collectionController.canEdit(req?.requester?.id, item?.collection_id, db);
    if (!canEdit) {
      errorController.Unauthorized(res);
      return;
    }

    await db('item').where({ id }).update(data);

    res.send(200, { status: 'success', data: {} });
  },

  async delete(req, res, db) {
    const { id } = req.params;

    if (!id) {
      errorController.InvalidRequest('Id is required', res);
      return;
    }

    const item = await db('item').where({ id }).first();
    const canEdit = await collectionController.canEdit(req?.requester?.id, item?.collection_id, db);
    if (!canEdit) {
      errorController.Unauthorized(res);
      return;
    }

    await db('item').where({ id }).del();

    await mediaController.remove(item?.picture_file);

    res.send(200, { status: 'success', data: {} });

  },

}
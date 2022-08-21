const errorController = require('./errorController');
const mediaController = require('./mediaController');
const sha1 = require('sha1');

module.exports = {
  async getAll(req, res, db) {
    const userCollections = await db('share').where({ user_id: req?.requester?.id });
    const collections = await db.select('*').from('collection').whereIn('id', userCollections.map(share => collection_id));
    res.send(200, { status: 'success', data: collections });
  },

  async get(req, res, db) {
    const { id } = req.params;

    if (!id) {
      errorController.InvalidRequest('Id is required', res);
      return;
    }
    const canRead = await this.canRead(req?.requester?.id, id, db);
    if (!canRead) {
      errorController.Unauthorized(res);
      return;
    }

    const collection = await db.select('*').from('collection').where({ id }).first();
    const sharing = await db('share').where({ collection_id: id });

    if (!collection) {
      res.send(errorController.NotFound(res));
    } else {
      res.send(200, { status: 'success', data: { ...collection, sharing } });
    }
  },

  async create(req, res, db) {
    let data = req.body;

    const [collectionId] = await db('collection').insert(data, ['id']);

    await db('share').insert({
      user_id: req?.requester?.id,
      collection_id: collectionId,
      permission: 'editor'
    });

    res.send(201, { status: 'success', data: {} });
  },

  async update(req, res, db) {
    const data = req.body;
    const { id } = data;
    if (!id) {
      errorController.InvalidRequest('Id is required', res);
      return;
    }

    const canEdit = await this.canEdit(req?.requester?.id, id, db);

    if (!canEdit) {
      errorController.Unauthorized(res);
      return;
    }

    await db('collection').where({ id }).update(data);

    res.send(200, { status: 'success', data: {} });
  },

  async delete(req, res, db) {
    const { id } = req.params;

    if (!id) {
      errorController.InvalidRequest('Id is required', res);
      return;
    }

    const canEdit = await this.canEdit(req?.requester?.id, id, db);
    if (!canEdit) {
      errorController.Unauthorized(res);
      return;
    }

    //remove all items
    const items = await db('item').where({ collection_id: id });
    await db('item').where({ collection_id: id }).del();
    //remove all media related to the item
    await Promise.all(items.map(item => {
      mediaController.remove(item?.picture_file);
    }))

    //remove all share permissions
    await db('share').where({ collection_id: id }).del();

    //remove the collection itself
    await db('collection').where({ id }).del();

    res.send(200, { status: 'success', data: {} });

  },

  //share

  async share(req, res, db) {
    const data = req?.body;
    const { id } = req?.params;
    if (!id) {
      errorController.InvalidRequest('Id is required', res);
      return;
    }

    const canEdit = await this.canEdit(req?.requester?.id, id, db);

    if (!canEdit) {
      errorController.Unauthorized(res);
      return;
    }

    await db('share').insert({
      user_id: data?.userId,
      collection_id: id,
      permission: data?.permission
    });

    res.send(200, { status: 'success', data: {} });
  },

  async unshare(req, res, db) {
    const data = req?.body;
    const { id } = req?.params;
    if (!id) {
      errorController.InvalidRequest('Id is required', res);
      return;
    }

    if (req?.requester?.id === data?.userId) {
      errorController.InvalidRequest('You cant unshare yourself', res);
      return;
    }

    const canEdit = await this.canEdit(req?.requester?.id, id, db);

    if (!canEdit) {
      errorController.Unauthorized(res);
      return;
    }

    await db('share').where({
      user_id: data?.userId,
      collection_id: id,
    }).del();

    res.send(200, { status: 'success', data: {} });
  },

  //accessory build
  async canRead(userId, collectionId, db) {
    const sharing = await db('share').where({ collection_id: collectionId });

    const canRead = sharing.find(permission => permission?.user_id === userId);

    return !!canRead;
  },

  async canEdit(userId, collectionId, db) {
    const sharing = await db('share').where({ collection_id: collectionId });

    const canEdit = sharing.find(permission => permission?.user_id === userId && permission?.permission === 'editor');
    return !!canEdit;

  }

}
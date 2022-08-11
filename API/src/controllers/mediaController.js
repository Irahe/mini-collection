const errorController = require('./errorController');
const sha1 = require('sha1');
const fs = require('fs');

module.exports = {
  async upload(req, res, db) {
    const { name: filename, path: location } = req.files.file;
    const mime = filename.split('.').pop();
    const newName = `${sha1(`${req?.requester?.id} - ${(new Date()).getTime()}`)}.${mime}`;
    const newLocation = `${process.env.STORAGE_PATH}${newName}`;
    await fs.rename(location, newLocation, (error) => { if (error) { console.log(error) } })

    res.send(200, { status: 'success', data: { fileName: newName } });
  },
  async remove(fileName) {
    await fs.unlink(`${process.env.STORAGE_PATH}${fileName}`, (error) => { if (error) { console.log(error) } });
  },
}
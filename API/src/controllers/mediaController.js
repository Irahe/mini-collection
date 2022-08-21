const errorController = require('./errorController');
const sha1 = require('sha1');
const fs = require('fs');
const { hashObjectBy } = require('../util/hashMapHelpers');
const mimes = {
  gif: 'image/gif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
};

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
  async get(req, res) {
    const { name } = req?.params
    const type = name.split('.')[name.split('.').length - 1]
    const mime = mimes[type];
    if (mime) {
      try {
        const media = fs.readFileSync(`${process.env.STORAGE_PATH}${name}`);
        res.header('Content-Type', mime);
        res.writeHead(200);
        res.write(media);
        res.end();
      } catch (error) {
        errorController.NotFound(res);
      }
    } else {
      throw new Error('Unknown mime type')
    }

  },
  async cleanUpStorage(db) {
    const dbMedia = hashObjectBy(await db('item').select('picture_file'), 'picture_file');
    fs.readdirSync(process.env.STORAGE_PATH).forEach(file => {
      if (!(file in dbMedia) && file !== '.DS_Store') {
        console.log('Removing -> ', file)
        this.remove(file)
      }
    });


  }
} 
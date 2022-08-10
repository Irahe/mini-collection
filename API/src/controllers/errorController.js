module.exports = {
  InternalServerError(error, res) {
    let response = {
      status: 'fail',
      message: error.message,
      stack: error.stack
    }
    console.log(error);
    res.send(500, response);
  },
  InvalidRequest(message, res) {
    let response = {
      status: 'fail',
      message: message,
    }
    res.send(400, response);
  },
  Unauthorized(res) {
    let response = {
      status: 'fail',
      message: 'Unauthorized',
    }
    res.send(401, response);
  },
  NotFound(res) {
    let response = {
      status: 'fail',
      message: 'Requested resource coud not be found on server.',
    }
    res.send(404, response);
  }
}
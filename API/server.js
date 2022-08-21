require('dotenv/config');
const restify = require('restify');
const { Database } = require('sqlite3');
const routeAggregator = require('./src/routes.js');
const cron = require('node-cron');
const mediaController = require('./src/controllers/mediaController.js');

//cria a instância do servidor restify
const server = restify.createServer({
  name: 'mini-collection-api',
  version: '0.0.1'
});

//inicializa os plugins no nosso servidor
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.gzipResponse());

//cria a conexão com o nosso banco de dados
const db = require('knex')({
  client: 'sqlite3', // or 'better-sqlite3'
  connection: {
    filename: "../database.db"
  },
  useNullAsDefault: true
});

//coloca o server em listenig mode (inicia ele).
server.listen(process.env.SERVER_PORT, function () {
  console.log('%s Running %s', server.name, server.url);
});

//importa as rotas unificadas do arquivo routes.js
routeAggregator({ server, db });

//cria agendamento de tarefa para limpar o storage
cron.schedule('22 22 * * *', async () => {
  console.log('Running a job at 22:22 at America/Bahia timezone');
  console.log('Running scheduled storage cleanup.');
  mediaController.cleanUpStorage(db);
}, {
  scheduled: true,
  timezone: "America/Bahia"
});
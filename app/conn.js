var pg = require('pg');
var connectionString = 'postgres://postgres:postgres@localhost:5432/roadshow';
var client = new pg.Client(connectionString);
client.connect();

module.exports = client;

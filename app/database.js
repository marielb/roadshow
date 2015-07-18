var pg = require('pg');
var uuid = require('node-uuid');
var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/roadshow';

var client = new pg.Client(connectionString);
client.connect();
var sql_seeder;
sql_seeder = 'DROP TABLE IF EXISTS user_account; DROP TABLE IF EXISTS auction; DROP TABLE IF EXISTS bid; ' +
  'CREATE TABLE user_account (id SERIAL PRIMARY KEY, email TEXT UNIQUE, guid UUID);' +
  'CREATE TABLE bid(id serial PRIMARY KEY, auction_id INTEGER, date TIMESTAMP);' +
  'CREATE TABLE auction(id serial PRIMARY KEY, auctioneer_id INTEGER, end_time TIMESTAMP, start_bid NUMERIC, step NUMERIC);' +
  'INSERT INTO user_account (email, guid) VALUES ' +
    '(\'daenerys@fireandblood.com\', \'' + uuid.v4() + '\'), ' +
    '(\'jaime@hearmeroar.com\', \'' + uuid.v4() + '\'); ' +
  'INSERT INTO auction (auctioneer_id, end_time, start_bid, step) VALUES ' +
    '(1, LOCALTIMESTAMP + INTERVAL \'3 hours\', 20.00, 1.00), ' +
    '(2, LOCALTIMESTAMP + INTERVAL \'2 hours\', 12.24, 0.50); ';

var query = client.query(sql_seeder);
query.on('end', function() { client.end(); });

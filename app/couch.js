var request = require('request');
var querystring = require('querystring');

var url = 'http://127.0.0.1:5984'

// Save a document
exports.save = function(db, doc, done) {
  request.put({
    url: url + '/' + db + '/' + doc._id,
    body: doc,
    json: true,
  }, function(err, resp, body) {
    if (err) return done('Unable to connect CouchDB');
    if (body.ok) {
      doc._rev = body.rev;
      return done(null, doc);
    }

    done('Unable to save the document');
  })
}

// Drop the DB
exports.dropDB = function(db, done) {
  var uri = url + '/' + db;
  request.del(uri, {json: true}, function(err, resp, body) {
    if (err) return done('Unable to connect CouchDB');
    if (body.ok) {
      return done(null)
    }
    done('Unable to drop the DB');
  });
}

// Create the DB
exports.createDB = function(db, done) {
  request.put((url + '/' + db), {}, function(err, resp, body) {
    if (err) return done('Unable to connect CouchDB')
    if (body.ok) {
      doc._rev = body.rev
      return done(null, doc)
    }
    done('Unable to create the DB');
  });
};


// Get all documents with the built-in 'All' view
exports.all = function(db, options, done) {
  var params = querystring.stringify({
    include_docs: options.include_docs === false ? false : true,
    //descending: options.descending,
    //skip: options.skip,
    //limit: options.limit,
    //key: options.key,
    //startkey: options.startkey,
    //endkey: options.endkey,
  });

  request.get(url + '/' + db + '/_all_docs?' + params,
      {json: true}, function(err, res, body) {
    if (err) return done('Unable to connect to CouchDB');
    done(null, body);
  });
};

exports.id = function(db, id, done) {
  request.get(url + '/' + db + '/' + id,
      {json: true}, function(err, res, body) {
    if (err) return done('Unable to connect to CouchDB');
    done(null, body);
  });
};


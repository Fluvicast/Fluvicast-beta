var mongodb = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var ready = false;
var dbo = null;

var requests = [];

mongodb.connect(url, function(err, db) {
    if (err) throw err;
    dbo = db.db("api");
    ready = true;
    for (request of requests) {
        request();
    }
});

//var testMessage = { id: "64ff0a8ce90012ca4df2e8d9", mask: "9386f9de08b50dae14", content: "Hello world" };

exports.generateId = (collection, callback) => {
    if (!ready) {
        requests.push(() => {exports.generateId(collection, callback)})
    } else {
        var tempId = Date.now() + ("" + Math.random()).substr(2);
        dbo.collection(collection).findOne({id: tempId}, function(err, res) {
            if (err) {
                callback(false, err);
            } else {
                if (res) {
                    exports.generateId(collection, callback)
                } else {
                    callback(true, tempId)
                }
            }
        });
    }
}

exports.ready = (() => ready);
exports.insertOne = ((collection, object, callback) => {
    if (!ready) {
        requests.push(() => {exports.insertOne(collection, object, callback)})
    } else {
        dbo.collection(collection).insertOne(object, function(err, res) {
            if (err) {
                callback(false, err);
            } else {
                callback(true, res);
            }
        });
    }
});
exports.updateOne = ((collection, condition, object, callback) => {
    if (!ready) {
        requests.push(() => {exports.updateOne(collection, condition, object, callback)})
    } else {
        dbo.collection(collection).updateOne(condition, object, function(err, res) {
            if (err) {
                callback(false, err);
            } else {
                callback(true, res);
            }
        });
    }
});
exports.findOne = function (collection, object, callback) {
    if (!ready) {
        requests.push(() => {exports.findOne(collection, object, callback)})
    } else {
        dbo.collection(collection).findOne(object, function(err, res) {
            if (err) {
                callback(false, err);
            } else {
                callback(true, res);
            }
        });
    }
};
exports.findAll = function (collection, conditions, fields, callback) {
    if (!ready) {
        requests.push(() => {exports.findAll(collection, conditions, fields, callback)})
    } else {
        dbo.collection(collection).find(conditions, fields).toArray().then((e) => {
            callback(true, e)
        })
    }
};

exports.deleteOne = function (collection, object, callback) {
    if (!ready) {
        requests.push(() => {exports.deleteOne(collection, object, callback)})
    } else {
        dbo.collection(collection).deleteOne(object, function(err, res) {
            if (err) {
                callback(false, err);
            } else {
                callback(true, res);
            }
        });
    }
};

exports.deleteAll = function (collection, object, callback) {
    if (!ready) {
        requests.push(() => {exports.deleteAll(collection, object, callback)})
    } else {
        dbo.collection(collection).deleteMany(object, function(err, res) {
            if (err) {
                callback(false, err);
            } else {
                callback(true, res);
            }
        });
    }
};
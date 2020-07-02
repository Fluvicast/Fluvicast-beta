// This script will be called each hour. Use this for cleanup

const child_process = require("child_process");
const db = require("./db.js");

exports.work = function() {

  // Quickstreams
  db.deleteAll("streams", {expires : { $lt: new Date() }}, function(success, msg) {
    
  });

}
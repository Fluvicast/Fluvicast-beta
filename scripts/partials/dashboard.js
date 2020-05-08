const fs = require('fs');

exports.getPartial = function(urlfrag, req, res, parentData) {

  fs.readFile(__dirname + "/../../private/html/dashboard.html", "utf8", function(err, data){
    //if (err) throw err;

    res.status(200).send(parentData.replace("{{CONTENT}}", data));

  });

}
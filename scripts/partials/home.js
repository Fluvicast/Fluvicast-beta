const fs = require('fs');

exports.getPartial = function(urlfrag, req, res, parentData) {

  fs.readFile(__dirname + "/../../private/html/home.html", "utf8", function(err, data){

    res.status(200).send(parentData.replace("{{CONTENT}}", data));

  });

}
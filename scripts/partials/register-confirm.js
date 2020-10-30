const fs = require('fs');

exports.getPartial = function(urlfrag, req, res, parentData) {

  fs.readFile(__dirname + "/../../private/html/register-confirm.html", "utf8", function(err, data){

    parentData = parentData.replace("{{CONTENT}}", data);
    res.status(200).send(parentData);

  });

}
const fs = require('fs');
const crypto = require('crypto');

exports.getPartial = function(urlfrag, req, res, parentData) {

  fs.readFile(__dirname + "/../../private/html/register.html", "utf8", function(err, data){

    // CSRF token
    crypto.randomBytes(64, function(err2, buffer) {

      var token = buffer.toString('base64');

      parentData = parentData.replace("{{CONTENT}}", data);
      parentData = parentData.replace("{{CSRF_TOKEN}}", token);

      // Cookie expires after 24 hours
      res.cookie('csrf', token, { maxAge: 86400000, httpOnly: true, secure: true});

      res.status(200).send(parentData);

    });

  });

}
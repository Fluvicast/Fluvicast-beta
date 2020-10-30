const fs = require('fs');
const overview = require('overview');

exports.getPartial = function(urlfrag, req, res, parentData) {

  //console.log(req.headers.referer)

  fs.readFile(__dirname + "/../../private/html/base.html", "utf8", function(err, data){
    if (err) throw err;

    parentData = parentData.replace("{{CONTENT}}", data);
    
    switch(urlfrag.shift()) {
      case null: case undefined: case "":
        overview.getPartial(urlfrag, req, res, parentData);
        return;

      default:
        res.status(404).send(data.replace("{{SETTINGS_CONTENT}}", "<p>This settings page cannot be found.</p>"));
        return;
    }

  });

}
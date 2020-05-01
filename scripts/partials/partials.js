const fs = require('fs');

exports.getPartial = function(urlfrag, req, cb) {

  console.log(req.headers.referer)

  fs.readFile("../../private/html/base.html", "utf8", function(err, data){
    switch(urlfrag.shift()) {
      case null: case undefined: case "":
        res.status(200).send();
        return;
      case 'home':
        
        return;
      case 'potato':
        
        return;
      default:
        
        return;
    }
  });

}
const fs = require('fs');

exports.getPartial = function(urlfrag, req, res, parentData) {

  fs.readFile(__dirname + "/../../private/html/qs-live.html", "utf8", function(err, data){

    var stream_url = urlfrag.shift();
    console.log(stream_url)
    if (stream_url) {
      data = data.replace("{{STREAM_URL}}", "qs-" + stream_url);
      res.status(200).send(parentData.replace("{{CONTENT}}", data));
    } else {
      data = data.replace("{{STREAM_URL}}", "");
      res.status(404).send(parentData.replace("{{CONTENT}}", data));
    }
    
  });

}
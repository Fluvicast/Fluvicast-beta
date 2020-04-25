const db = require('../utils/db.js')
const crypto = require('crypto');

exports.bind = (app, root) => {

  app.post(root + "create", (req, res) => {
    db.generateId("streams", (success, id) => {
      if (success) {
        var streamKey = crypto.createHash('md5').update(id).digest('hex');
        var streamUrl = crypto.createHash('sha256').update(id).digest('base64').substr(1,9).replace(/[^a-zA-Z0-9]/g,"_");
        db.insertOne("streams", { id: id, streamKey: streamKey, url: "qs/" + streamUrl }, function (success, resp) {
          if (success) {
            res.status(201).send('{"key":"' + streamKey + '","url":"' + streamUrl + '"}');

            setTimeout(()=>{
              db.deleteOne("streams", {id: id}, (success, res)=>{
                // Deletion successful is "success" is true
              });
            },3600000)

          } else {
            res.status(500).send('{"msg":"Failed to create quick stream"}');
          }
        });
      } else {
        res.status(500).send('{"msg":"Failed to create quick stream"}');
      }
    });
  })

}
const db = require('../utils/db.js');
const crypto = require('crypto');

exports.bind = (app, root) => {

  // When receiving a request to create a quickstream
  app.post(root + "create", (req, res) => {

    // Create a Fluvicast ID for the database entry
    db.generateId("streams", (success, id) => {
      if (success) {

        // Generate a stream key (for the streamer) and a stream URL (for the viewers)
        crypto.randomBytes(16, function(err, buffer) {
          var streamKey = buffer.toString('hex');

          crypto.randomBytes(4, function(err2, buffer2) {
            var streamUrl = buffer2.toString('hex');

            // Save the entry in the database
            db.insertOne("streams", { id: id, streamKey: streamKey, url: "qs-" + streamUrl, expires: new Date(new Date() - (- 3600000))}, function (success, resp) {
              if (success) {

                // Give back the stream key & url to the requester (streamer)
                res.status(201).send('{"key":"' + streamKey + '","url":"' + streamUrl + '"}');
    
                // FIXME : Won't be executed if the server crashes, effectively leaving the old stream key in the database.
                // Fixed : see ../utils/worker.js
                /*setTimeout(()=>{
                  db.deleteOne("streams", {id: id}, (success, res)=>{
                    // Deletion successful if "success" is true
                  });
                },3600000)
                */
    
              } else {
                res.status(500).send('{"msg":"Failed to create quick stream"}');
              }
            });

          });
        });
      } else {
        res.status(500).send('{"msg":"Failed to create quick stream"}');
      }
    });
  })

}
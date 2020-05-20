const db = require('../utils/db.js')


// FIXME : A user can comment without being authenticated
// FIXME : A user can comment on an invalid video ID (ctxId), or one on which they don't have access
exports.bind = (app, root) => {

  app.get(root + ':ctxId', (req, res) => {

    var ctxId = parseInt(req.params.ctxId);
    if (typeof (ctxId) === "number" && ctxId > 0 && ctxId < 999999) {

      var callback = function (success, resp) {
        if (success) {
          res.status(200).json(resp)
        } else {
          res.status(400).send('{"msg":"Cannot get message"}')
        }
      }

      db.findAll("messages_" + ctxId, {}, { projection: { _id: 0, content: 1, author: 1, id: 1, reactions: 1 } }, callback)
    } else {
      res.status(400).send('{"msg":"Malformed request"}')
    }

  })

  app.post(root + ':ctxId', (req, res) => {
    var content = req.body.content;
    var ctxId = parseInt(req.params.ctxId);
    var author = sess.getUser(req);
    if (typeof (content) === "string" && content.length > 3 && content.length < 2048 && typeof (ctxId) === "number" && ctxId > 0 && ctxId < 999999 && author != null) {
      db.generateId("messages_" + ctxId, function (success, newId) {
        if (success) {
          db.insertOne("messages_" + ctxId, { content: content, author: author, id: newId }, function (success, resp) {
            if (success) {
              res.status(201).send('{"msg":"Success"}')
            } else {
              res.status(500).send('{"msg":"Cannot insert message"}')
            }
          })
        } else {
          res.status(500).send('{"msg":"Cannot insert message"}')
        }
      })
    } else {
      res.status(400).send('{"msg":"Malformed request"}')
    }

  })

  app.post(root + 'reactions/:ctxId/:messId', (req, res) => {
    var toggle = (req.body.toggle == 1);
    var emote = null;
    switch (req.body.emote) {
      case 'funny':
        emote = 'funny';
        break;
      case 'sad':
        emote = 'sad';
        break;
      case 'love':
        emote = 'love';
        break;
      case 'angry':
        emote = 'angry';
        break;
      case 'like':
        emote = 'like';
        break;
      case 'dislike':
        emote = 'dislike';
        break;
      case 'hmm':
        emote = 'hmm';
        break;
      case 'meh':
        emote = 'meh';
        break;
      case 'wtf':
        emote = 'wtf';
        break;
      case 'kidding':
        emote = 'kidding';
        break;
    }
    var ctxId = parseInt(req.params.ctxId);
    var messId = req.params.messId;
    var author = sess.getUser(req);
    if (typeof (messId) === "string" && !!messId.match(/^[0-9]{5,55}$/) && typeof (ctxId) === "number" && ctxId > 0 && ctxId < 999999 && author != null && emote != null) {
      db.updateOne("messages_" + ctxId, { id: messId }, { $set: { ["reactions." + author + "." + emote]: toggle } }, function (success, resp) {
        if (success) {
          res.status(200).send('{"msg":"Success"}')
        } else {
          res.status(500).send('{"msg":"Cannot save reaction"}')
          console.log(resp)
        }
      })
    } else {
      res.status(400).send('{"msg":"Malformed request"}')
    }

  })

}
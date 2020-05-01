const db = require('../utils/db.js')
const crypto = require('crypto');

exports.bind = (app, root) => {

  app.post(root + 'register', (req, res) => {
    var username = req.body.username;
    var email = req.body.email || "";
    var phone = req.body.phone || "";
    var password1 = req.body.password1;
    var password2 = req.body.password2;

    if (!!username.toLowerCase().match(/^[a-z][a-z0-9]{4,29}$/)
      && !!email.toLowerCase().match(/^([a-z\\.\\-]@[a-z\\-\\.])?$/)
      && !!phone.match(/^([0-9]{10})?$/)
      && password1 == password2 && password1.match(/^.{8,255}$/)) {

      var password = crypto.createHash('sha256').update(password1 + username).digest('hex');
      db.generateId("users", (success, id) => {
        if (success) {
          db.insertOne("users", { id: id, username: username, password: password, streamKey: "", email: email, phone: phone }, function (success, resp) {
            if (success) {
              // TODO: Handle success...
              console.log("Registered");
            } else {
              // TODO: Handle error
              console.log("Reg fail 1");
            }
          });
        } else {
          // TODO: Handle error
          console.log("Reg fail 2");
        }
      });
    } else {
      res.status(400).send('{"msg":"Malformed request; please create an account using the web interface"}')
    }

  });

  app.post(root + 'login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    db.findOne("users", { username: username }, (success, user) => {
      console.log(success)
      console.log(req.body)
      if (success && user && user.password && user.password == crypto.createHash('sha256').update(password + user.username).digest('hex')) {
        // TODO: Handle success
        console.log("Logged in");
      } else {
        // TODO: Handle error
        console.log("Login failed");
      }
    })

  });


}
const db = require('../utils/db.js')
const crypto = require('crypto');

exports.bind = (app, root) => {

  app.post(root + 'register', (req, res) => {

    // Check CSRF
    

    // Prepare response
    function respond(code) {
      switch(req.accepts(['html', 'json'])) {

        // JSON response (with JS-enabled browsers and third-party clients)
        case 'json':
          if (code.error) {
            res.status(400).send(code);
          } else {
            res.status(201).send(code);
          }
          break;
        
        // HTML response (with JS-disabled browsers)
        case 'html':
        default:

          if (code.error) {
            res.status(303).set('Location', '/register?error=' + encodeURIComponent(code.msg)).send();
          } else {
            res.status(303).set('Location', '/register-confirm').send();
          }

          break;

      }
    }

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
              respond({error: false});
            } else {
              // TODO: Handle error
              respond({error: true, code: 3, msg: "Internal failure : Could not save user. Please try again. If it fails multiple times, please contact the administrators."});
            }
          });
        } else {
          // TODO: Handle error
          respond({error: true, code: 2, msg: "Internal failure : Could not generate user ID. Please try again. If it fails multiple times, please contact the administrators."});
        }
      });
    } else {
      respond({error: true, code: 1, msg: "One of the fields was incorrectly formatted, or a required field was missing. Please double-check."});
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
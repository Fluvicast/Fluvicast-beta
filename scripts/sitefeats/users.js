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

    var username = req.body.username || "";
    var displayname = req.body.displayname || "";
    var email = req.body.email || "";
    var phone = req.body.phone || "";
    var password1 = req.body.password1 || "";
    var password2 = req.body.password2 || "";

    if (!!username.toLowerCase().match(/^[a-z][a-z0-9]{5,29}$/)
      && !!displayname.toLowerCase().match(/^[ -~]{2,250}$/)
      && !!email.toLowerCase().match(/^([a-z0-9\\.\\-\\+]+@[a-z0-9\\-\\.]+)?$/)
      && !!phone.match(/^([0-9]{10})?$/)
      && password1 == password2 && password1.match(/^.{8,255}$/)) {

      var password = crypto.createHash('sha256').update(password1 + username).digest('hex');
      db.findOne("users", {username: username}, (success, user) => {

        if (!success || user) {
          
          respond({error: true, code: 4, msg: "Username is already taken, please choose another."});

        } else {

          db.generateId("users", (success, id) => {
            if (success) {
              db.insertOne("users", { id: id, username: username, displayname: displayname, password: password, streamKey: "", email: email, phone: phone }, function (success, resp) {
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
        }

      }); // If there is a user with given username (@handle)
    } else {
      respond({error: true, code: 1, msg: "One of the fields was incorrectly formatted, or a required field was missing. Please double-check."});
    }

  });

  app.post(root + 'login', (req, res) => {
    var username = req.body.uname;
    var password = req.body.pw;

    // TODO: check CSRF

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
            res.status(303).set('Location', '/login?error=' + encodeURIComponent(code.msg)).send();
          } else {
            var cookieOptions = {
              signed: true,
              secure: true,
              httpOnly: true,
              sameSite: 'strict',
              maxAge: 315360000000 // 10 years
            };
            res.status(303).set('Location', '/').cookie('flsession', code.token, cookieOptions).send();
          }

          break;

      }
    }

    db.findOne("users", { username: username }, (success, user) => {
      if (success && user && user.password && user.password == crypto.createHash('sha256').update(password + user.username).digest('hex')) {
        
        // Login successful
        crypto.randomBytes(32, function(err, buffer) {

          if (!err) {
            var token = buffer.toString('hex');
            db.insertOne("tokens", {token: token, userid: user.id}, (success, obj) => {
              if (success) {
                respond({error: false, token: token});
              } else {
                respond({error:true, code: 7, msg: "Internal failure : Could not save session token. Please try again. If it fails multiple times, please contact the administrators."})
              }
            });
          } else {
            respond({error:true, code: 6, msg: "Internal failure : Could not generate session token. Please try again. If it fails multiple times, please contact the administrators."})
          }
        });

      } else {

        respond({error:true, code: 5, msg: "Invalid username or password."})

      }
    })

  });


}
const db = require('./db.js')
const crypto = require('crypto');

// TODO : Update this to use the cookie middleware
exports.getUser = function (req, callback) {

  /*
  var cookies = req.headers.cookie;
  if (!cookies) return null;

  cookies = cookies.split("; ");

  var sessionToken = undefined;

  cookies.forEach((o) => {
      
      if (o.startsWith("session=")) {
          sessionToken = o.substr(8);
      }
  })

  if (typeof(sessionToken) != "string") {
      return null;
  }
  return sessionToken;
  */

  if (req.fl_user !== undefined) {
    callback(req.fl_user);
    return;
  }

  var token = req.signedCookies.flsession;

  if (token) {
    db.findOne("tokens", {token: token}, (success, tokenObj) => {
      if (!success || !tokenObj) {
        req.fl_user = null;
        callback(null);
      } else {
        db.findOne("users", {id: tokenObj.userid}, (success2, userObj) => {
          if (!success2 || !userObj) {
            req.fl_user = null;
            callback(null);
          } else {
            req.fl_user = userObj;
            callback(userObj);
          }
        });
      }
    });
  } else {
    req.fl_user = null;
    callback(null);
  }
}

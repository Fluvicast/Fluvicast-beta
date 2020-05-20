const fs = require('fs');
const quickstream = require('./quickstream.js');
const dashboard = require('./dashboard.js');
const qs_live = require('./qs-live.js');
const home = require('./home.js');

exports.getPartial = function(urlfrag, req, res) {

  //console.log(req.headers.referer)

  fs.readFile(__dirname + "/../../private/html/base.html", "utf8", function(err, data){
    if (err) throw err;

    switch(req.cookies.theme) {
      case "light":
        data = data.split("{{CURR_THEME}}").join("light"); // TODO : Check if it's possible to replaceAll without Regex (Regex has a LOT of special characters that might break plain replacement)
      break;
      case "ocean":
        data = data.split("{{CURR_THEME}}").join("ocean");
      break;
      case "dark":
        data = data.split("{{CURR_THEME}}").join("dark");
      break;
      default:
        data = data.split("{{CURR_THEME}}").join("ocean");
    }
    
    switch(urlfrag.shift()) {
      case null: case undefined: case "": case "home":
        home.getPartial(urlfrag, req, res, data);
        return;
/*
      case 'dashboard':
        dashboard.getPartial(urlfrag, req, res, data);
        return;
*/
      case 'quickstream':
        quickstream.getPartial(urlfrag, req, res, data);
        return;

      case 'live':
        qs_live.getPartial(urlfrag, req, res, data);
        return;

      default:
        res.status(404).send(data.replace("{{CONTENT}}", "<p>This page cannot be found.</p>"));
        return;
    }
  });

}
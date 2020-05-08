const fs = require('fs');
const quickstream = require('./quickstream.js');
const dashboard = require('./dashboard.js');
const qs_live = require('./qs-live.js');

exports.getPartial = function(urlfrag, req, res) {

  //console.log(req.headers.referer)

  fs.readFile(__dirname + "/../../private/html/base.html", "utf8", function(err, data){
    if (err) throw err;

    switch(req.cookies.theme) {
      case "light":
        data = data.replace("{{CURR_THEME}}", "light");
      break;
      case "ocean":
        data = data.replace("{{CURR_THEME}}", "ocean");
      break;
      case "dark":
        data = data.replace("{{CURR_THEME}}", "dark");
      break;
      default:
        data = data.replace("{{CURR_THEME}}", "ocean");
    }
    
    switch(urlfrag.shift()) {
      case null: case undefined: case "":
        res.status(200).send(data);
        return;

      case 'dashboard':
        dashboard.getPartial(urlfrag, req, res, data);
        return;

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
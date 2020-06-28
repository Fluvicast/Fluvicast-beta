// This script will be called each hour. Use this for cleanup

const child_process = require("child_process");
const db = require("./db.js");

exports.work = function() {

  // Quickstreams
  db.deleteAll("streams", {expires : { $lt: new Date() }}, function(success, msg) {
    
  });

  // Refresh ZIP archive of the full source code (excluding user content, SSL keys, and passwords)
  // IMPORTANT : PER THE TERMS OF THE AGPL, IF YOU MAKE A COPY OF THE SITE AVAILABLE ONLINE, YOU ARE REQUIRED
  //    TO RELEASE THE FULL SOURCE CODE AS WELL. This portion of script will do the job for you. Simply don't
  //    put server scripts outside /var/fluvicast, and do not include other content (User content, passwords,
  //    etc.) inside /var/fluvicast. If you remove this code, YOU MUST MAKE THE FULL SOURCE CODE AVAILABLE
  //    IN SOME WAY **AND** MAKE SURE THE DOWNLOADABLE SOURCE CODE IS **ALWAYS** UP-TO-DATE.
  //    Read the AGPL (/var/fluvicast/LICENSE, or https://www.gnu.org/licenses/agpl-3.0.en.html) for more info.
  // FIXME : Requires the ZIP library to be installed on the system. Would need an alternative that wouldn't require extra installation.
  child_process.execSync(`zip -x "public/download-src.zip" -r public/download-src.zip *`, {
    cwd: "/var/fluvicast/"
  });

}
const exec = require('child_process').exec;
const readline = require('readline');
const fs = require('fs');

exports.handle = function(req, res) {

  if (req.subdomains.length == 0) {

    res.status(404).send("<p>The Fluvicast.me homepage is under construction</p>");

  } else {

    var username = req.subdomains[0];

    // Me and the boys dealing with Directory traversal
    if (username.match(/^[a-z0-9]{6,30}$/i) && fs.existsSync("/var/fluvicast/lua/users/" + username + "/")) {

      /* Valid :
       *    /file
       *    /folder/file
       *    /file.ext
       *    /file.e
       *    /s0m3_w31rd_n4m35/TO-SCREW-THINGS-UP/or_will-it.abc
       *    /_/-////-_/-/-__-///
       *    /.git
       * 
       * Invalid :
       *    /f!|£
       *    /file.0
       *    /super-duper-long-name-that-takes-way-too-much-space-even-though-it-does-not-contain-any-illegal-character/i-hope-that-makes-more-than-255-characters
       *    /this-seems-innocent-doesn't-it/
       *    /../../../etc/nginx/nginx.conf
       *    /basically-anything-with-a-point-before-the-extension/.git/file
       *    /file.extensiontoolong
       *    /.git/
       */
      if (req.url.match(/^[a-z0-9_\-/]{1,255}(\.[a-z]{1,4})?$/i)) {

        // req.url.substr(1) = make sure the first character is a slash (prevents garbage input from passing)
        var path = "/var/fluvicast/lua/users/" + username + "/" + req.url.substr(1);
        var luascript = "";

        if (fs.existsSync(path)) {
          if (fs.lstatSync(path).isDirectory()) {

            // Is a directory : get the index.lua file
            if (!path.endsWith("/")) path += "/";
            if (fs.existsSync(path + "index.lua")) {
              luascript = path + "index.lua";
            } else {
              // TODO: 404
              res.status(404).send("<p>404 : Page not found</p><!-- 1 -->");
            }

          } else {

            // Ain't no directory : we got the file!
            // Check that it isn't a Lua script and that the file has an extension
            if (!path.endsWith(".lua") && path.indexOf(".") != -1) {
              res.download(path);
            } else {
              // TODO : 404
              res.status(404).send("<p>404 : Page not found</p><!-- 2 -->");
            }

          }
        } else {

          // Try adding ".lua" if there is no extension
          if (path.indexOf(".") == -1 && (fs.existsSync(path + ".lua"))) {

            // Is a lua script
            luascript = path + ".lua";

          } else {
            // TODO : 404
            res.status(404).send("<p>404 : Page not found</p><!-- 3 -->");
          }

        }

        // Execute Lua script, if applicable
        if (luascript.length > 0 && fs.existsSync(luascript)) {

          // Remove the beginning of the path (the Lua file will re-add it after sanitization)
          luascript = luascript.substr(("/var/fluvicast/lua/users/" + username + "/").length);

          // Execute script
          var child = exec('lua /var/fluvicast/lua/master.lua ' + username + ' ' + luascript, {cwd: '/var/fluvicast/lua/'});

          child.stderr.pipe(process.stdout);

          readline.createInterface({ input: child.stdout }).on('line', function (line) {

            if (line.startsWith("Ready")) {

              // Boy I do sure love race conditions as well as the fact neither NodeJS nor Lua buffer
              // stdin which means the whole program will crash if we print stuff before Lua is ready :)
              child.stdin.setEncoding('utf-8');
              child.stdin.write('{"url":"' + req.url + '"}\r\n');
              child.stdin.end();

            } else {
                
              var response = JSON.parse(line);

              if (response.error === true) {
                console.log(response.message)
                res.status(500).send("<p>An error occured.</p>");
              } else {

                // Set response cookies
                if (response.cookies && typeof response.cookies == "object") {
                  for (key in response.cookies) {
                    console.log(key);
                    console.log(typeof key);
                    if (typeof key == "string" && key.match(/^[a-z0-9\-\._]{1,255}$/i)) {
                      if (typeof response.cookies[key] == "string") {
                        res.cookie('user_' + username + '_' + key, response.cookies[key], { maxAge: 9999999999, httpOnly: true, secure: true })
                      } // else if it's an object {
                        // TODO: set the maxAge/secure/hhtpOnly/etc. accordingly
                      /* } */ else {
                        // Warn the owner of the subsite
                      }
                    } else {
                      // Warn the owner of the subsite
                    }
                  }
                }

                // Print response
                
                if (response.response && ((typeof response.response) == "string") && response.response.length > 0) {
                  res.status(200).send(response.response);
                } else {
                  res.status(204).send();
                }

              }
            }
          });

        } // End of "execute lua script" section

      } else {
        // Same as a normal 404
        res.status(404).send("<p>404 : Page not found (Malformed URL)</p>");
      }
    } else {
      res.status(404).send("<p>This user doesn't exist!</p>");
    }
  }

}

const request = require('request');

// Exctacts basic identification information from a request object.
// Deactivatable by the user through their preference settings.
// Used notably when logging in from a new area.

// Callback : (err, info, msg)
// err is true if there has been an error at some point
// info is as described at the beginning of the function
// msg in the error message, if any; undefined if no error
exports.getInfo = (req, callback) => {

  var info = {
    os: {
      name: "", // "Windows 10", "MacOS 10.12 Sierra", "Ubuntu 18.04", "FreeBSD 9"...
      family: "", // "Windows", "Mac", "Linux", "BSD", "Other"
    },
    browser: {
      name: "", // "Firefox", "Chrome", "Opera", "Edge", "Internet Explorer"
      version: "", // "78.0" for Firefox 78.0, "83" for Chrome 83, "11" for Internet Explorer 11
    },
    ip: req.headers['x-fluvicast-forwarded-for'].split(',')[0].trim(),
    location: {
      region: "", // "New York, NY, United States"
      country: "", // "United States"
      geobytes: {}, // The object as returned by Geobytes
    }
  };

  request('https://secure.geobytes.com/GetCityDetails?key=7c756203dbb38590a66e01a5a3e1ad96&fqcn=' + info.ip, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      info.location.geobytes = JSON.parse(body);
      info.location.region = info.location.geobytes.geobytesfqcn;
      info.location.country = info.location.geobytes.geobytescountry;
      callback(false, info);
    } else {
      callback(true, info, "Could not fetch location from IP address");
    }
  });
}
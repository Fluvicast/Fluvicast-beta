const fa = require('@fortawesome/fontawesome-free')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const crypto = require('crypto');
const fs = require('fs');
const cookieParser = require('cookie-parser')

const app = express()
const port = 9176
const local_app = express()
const local_port = 23006

const db = require('./scripts/utils/db.js')
const sess = require('./scripts/utils/session.js')
const partials = require('./scripts/partials/partials.js')

var corsOptions = {
    origin: 'http://fluvicast.com/',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(bodyParser.urlencoded())
app.use(express.static('public'))
app.use(cookieParser())

local_app.use(express.json())
local_app.use(bodyParser.urlencoded())

local_app.post('/internal/streamauth', (req, res) => {
    if (req.connection.remoteAddress == "127.0.0.1"
    || req.connection.remoteAddress == "::ffff:127.0.0.1"
    || req.connection.remoteAddress == "::1") {
        var streamkey = req.body.name;

        db.findOne("streams", {streamKey: streamkey}, (success, stream) => {
            if (success && stream && stream.url) {
                res.status(302).set('Location', 'rtmp://127.0.0.1/hls/' + stream.url).send();
                console.log(stream.url)
            } else {
                res.status(404).send();
            }
        })
    }
})

// API
require('./scripts/sitefeats/quickstreams.js').bind(app, '/api/quickstream/');
//require('./scripts/sitefeats/comments.js').bind(app, '/api/comments/');
//require('./scripts/sitefeats/users.js').bind(app, '/api/users/');
app.all('/api/*', (req, res) => {
    res.status(404).send('{"msg":"This document does not exist"}');
});

// PAGE SERVICE
app.get('*', (req, res) => {
    var url = req.url.split("/");
    url.shift(); // first will always be empty because the string starts with a slash

    partials.getPartial(url, req, res);
});

// DIRECT URL REQUEST
app.use((req, res) => {
    fs.readFile("./private/html/base.html", "utf8", function(err, data){
        //if(err) throw err;
        res.status(404).send(data.replace("{{CONTENT}}", "<p>This page cannot be found.</p>"));
    });
});

// Will listen only to 127.0.0.1 because there's a proxy
app.listen(port, '127.0.0.1', () => console.log(`Example app listening on port ${port}! db is ${db.ready()}`))
local_app.listen(local_port, '127.0.0.1');
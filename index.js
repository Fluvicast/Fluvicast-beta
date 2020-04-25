const fa = require('@fortawesome/fontawesome-free')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const crypto = require('crypto');
const fs = require('fs');

const app = express()
const port = 3000
const local_app = express()
const local_port = 23006

const db = require('./scripts/utils/db.js')
const sess = require('./scripts/utils/session.js')

var corsOptions = {
    origin: 'http://192.168.56.101/',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(bodyParser.urlencoded())
app.use(express.static('public'))

local_app.use(express.json())
local_app.use(bodyParser.urlencoded())


app.get('/api/comments/:ctxId', (req, res) => {

    var ctxId = parseInt(req.params.ctxId);
    if (typeof(ctxId) === "number" && ctxId > 0 && ctxId < 999999) {

        var callback = function(success, resp) {
            if (success) {
                res.status(200).json(resp)
            } else {
                res.status(400).send('{"msg":"Cannot get message"}')
            }
        }

        db.findAll("messages_" + ctxId, {}, {projection: {_id: 0, content: 1, author: 1, id: 1, reactions: 1 }}, callback)
    } else {
        res.status(400).send('{"msg":"Malformed request"}')
    }
    
})

app.post('/api/comments/:ctxId', (req, res) => {
    var content = req.body.content;
    var ctxId = parseInt(req.params.ctxId);
    var author = sess.getUser(req);
    if (typeof(content) === "string" && content.length > 3 && content.length < 2048 && typeof(ctxId) === "number" && ctxId > 0 && ctxId < 999999 && author != null) {
        db.generateId("messages_" + ctxId, function(success, newId) {
            if (success) {
                db.insertOne("messages_" + ctxId, {content: content, author: author, id: newId}, function(success, resp) {
                    if (success) {
                        res.status(201).send('{"msg":"Success"}')
                    } else {
                        res.status(500).send('{"msg":"Cannot insert message"}')
                    }
                })
            } else {
                res.status(500).send('{"msg":"Cannot insert message"}')
            }
        })
    } else {
        res.status(400).send('{"msg":"Malformed request"}')
    }
    
})

app.post('/api/reactions/:ctxId/:messId', (req, res) => {
    var toggle = (req.body.toggle == 1);
    var emote = null;
    switch(req.body.emote) {
        case 'funny':
            emote = 'funny';
        break;
        case 'sad':
            emote = 'sad';
        break;
        case 'love':
            emote = 'love';
        break;
        case 'angry':
            emote = 'angry';
        break;
        case 'like':
            emote = 'like';
        break;
        case 'dislike':
            emote = 'dislike';
        break;
        case 'hmm':
            emote = 'hmm';
        break;
        case 'meh':
            emote = 'meh';
        break;
        case 'wtf':
            emote = 'wtf';
        break;
        case 'kidding':
            emote = 'kidding';
        break;
    }
    var ctxId = parseInt(req.params.ctxId);
    var messId = req.params.messId;
    var author = sess.getUser(req);
    if (typeof(messId) === "string" && !!messId.match(/^[0-9]{5,55}$/) && typeof(ctxId) === "number" && ctxId > 0 && ctxId < 999999 && author != null && emote != null) {
        db.updateOne("messages_" + ctxId, {id: messId}, { $set: { ["reactions." + author + "." + emote]: toggle } }, function(success, resp) {
            if (success) {
                res.status(200).send('{"msg":"Success"}')
            } else {
                res.status(500).send('{"msg":"Cannot save reaction"}')
                console.log(resp)
            }
        })
    } else {
        res.status(400).send('{"msg":"Malformed request"}')
    }
    
})

app.post('/api/users/register', (req, res) => {
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
                db.insertOne("users", {id: id, username: username, password: password, streamKey: "", email: email, phone: phone}, function(success, resp) {
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

app.post('/api/users/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;

    db.findOne("users", {username: username}, (success, user) => {
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

local_app.post('/internal/streamauth', (req, res) => {
    if (req.connection.remoteAddress == "127.0.0.1"
    || req.connection.remoteAddress == "::ffff:127.0.0.1"
    || req.connection.remoteAddress == "::1") {
        var streamkey = req.body.name;

        db.findOne("streams", {streamKey: streamkey}, (success, stream) => {
            if (success && stream && stream.url) {
                res.status(302).set('Location', 'rtmp://127.0.0.1/hls/' + stream.url).send();
            } else {
                res.status(404).send();
            }
        })

        //res.status(302).set('Location', 'rtmp://127.0.0.1/hls/user').send();
    }
})

// API
require('./scripts/sitefeats/quickstreams.js').bind(app, '/api/quickstream/');
app.all('/api/*', (req, res) => {
    res.status(404).send('{"msg":"This document does not exist"}');
});

function getPartial(req, res) {

}

// PAGE SERVICE
app.get('/partial/*', getPartial);

// DIRECT URL REQUEST
app.use((req, res) => {
    fs.readFile("./private/html/base.html", "utf8", function(err, data){
        if(err) throw err;
        data = data.replace('<div id="app">', `<div id="app"><p>This page doesn't exist.</p>`)
        res.status(404).send(data);
    });
    // TODO: Return the monopage and print in the javascript the url to fetch (req,url)
});

app.listen(port, () => console.log(`Example app listening on port ${port}! db is ${db.ready()}`))
local_app.listen(local_port, '127.0.0.1');
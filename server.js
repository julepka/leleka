var express = require('express');
var main = require('./main.js');
var fs = require('fs');
var https = require('https');

var privateKey =  fs.readFileSync(__dirname + '/ssl/server.key').toString();
var certificate = fs.readFileSync(__dirname + '/ssl/server.crt').toString();

var app = express();

app.get('/', renderPage);
app.get('/getTransactions', getTransactions);

var server = https.createServer({key: privateKey, cert: certificate}, app);
server.listen(8080);

function renderPage(req, res) {
    fs.readFile('./index.html', function (err, html) {
        if (err) {
            console.log('Error reading index.html: ' + err);
        }
        res.write(html);
    });
}

function getTransactions(req, res) {
    function callback() {
        res.sendFile(__dirname + '/output.csv');
    }
    console.log(req.query);
    //TODO: make conversion to and from GMT if needed
    //new Date(new Date(s).getTime() + new Date().getTimezoneOffset() * 60000).toJSON()
    if (checkCredentialsReq(req.query)) {
        main.makeCSV({username: req.query.username, password: req.query.password, signature: req.query.signature},
            {StartDate: req.query.date.concat(':00.000Z')}, callback());
    }
}

function checkCredentialsReq(req) {
    if (req.username === undefined || req.username.length === 0) {
        console.log('Username field is empty');
        return false;
    } else if (req.password === undefined || req.password.length === 0) {
        console.log('Password field is empty');
        return false;
    } else if (req.signature === undefined || req.signature.length === 0) {
        console.log('Signature field is empty');
        return false;
    } else if (req.date === undefined || req.date.length === 0) {
        console.log('Date field is empty');
        return false;
    } else {
        return true;
    }
}
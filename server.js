/*
* Copyright (c) 2015 Iuliia Potapenko
* Distributed under the GNU GPL v3.
* For full terms see http://www.gnu.org/licenses/gpl or LICENSE.txt file.
*/

var express = require('express');
var main = require('./main.js');
var fs = require('fs');
var https = require('https');
var http = require('http');

//var privateKey =  fs.readFileSync(__dirname + '/ssl/server.key').toString();
//var certificate = fs.readFileSync(__dirname + '/ssl/server.crt').toString();

var app = express();

app.use(express.static(__dirname));

app.get('/', renderPage);
app.get('/transactions', getTransactions);

//var server = https.createServer({key: privateKey, cert: certificate}, app);
var server = http.createServer(app);
server.listen(process.env.PORT || 5000);

function renderPage(req, res) {
    fs.readFile('./index.html', function (err, html) {
        if (err) {
            console.log('Error reading index.html: ' + err);
        }
        res.write(html);
    });
}

function getTransactions(req, res) {
    function callback(data) {
        res.status(200);
        res.header('content-type', 'text/csv');
        res.write(data);
        res.end();
        //res.sendFile(__dirname + '/output.csv');
    }
    console.log(req.query);
    //TODO: make conversion to and from GMT if needed
    //new Date(new Date(s).getTime() + new Date().getTimezoneOffset() * 60000).toJSON()
    //var t = new Date(req.query.date.concat(':00.000Z'));
    //console.log(t.getTime());
    if (checkCredentialsReq(req.query)) {
        if(req.query.sandbox == "on") {
            main.makeCSV({username: req.query.username, password: req.query.password, signature: req.query.signature},
                {StartDate: req.query.date.concat(':00.000Z'), EndDate: req.query.date2.concat(':00.000Z') }, callback);
        } else {
            main.makeCSV({username: req.query.username, password: req.query.password, signature: req.query.signature, live: true},
                {StartDate: req.query.date.concat(':00.000Z'), EndDate: req.query.date2.concat(':00.000Z') }, callback);
        }
    } else {
        res.write("Error in input fields. Go back and try again.");
        res.end();
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
var express = require('express');
var main = require('./main.js');
var fs = require('fs');

var app = express();

app.get('/', renderPage);
app.get('/getTransactions', getTransactions);

function getTransactions(req, res) {
    function callback() {
        //TODO: process req.params.field1
        res.sendFile(__dirname + '/output.csv');
    }
    main.makeCSV(callback());
}

function renderPage(req, res) {
    fs.readFile('./index.html', function (err, html) {
        if (err) {
            console.log('Error reading index.html: ' + err);
        }
        res.write(html);
    });
}


var server = app.listen(8080);
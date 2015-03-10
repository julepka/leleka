var express = require('express');
var main = require('./main.js');

var app = express();

app.get('/', getTransactions);

function getTransactions(req, res) {

    function callback() {
        res.sendFile(__dirname + '/output.csv');
    }

    main.makeCSV(callback());
}

var server = app.listen(8080);
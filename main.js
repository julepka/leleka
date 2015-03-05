/*
 * Copyright (c) 2015 Iuliia Potapenko
 * Distributed under the GNU GPL v3.
 * For full terms see http://www.gnu.org/licenses/gpl or LICENSE file
 */

var PayPal = require('paypal-classic-api');
var csv = require('fast-csv');

var credentials = {
    username: 'EMAIL.gmail.com',
    password: 'PASSWORD',
    signature: 'SIGNATURE'
};

var paypal = new PayPal(credentials);

paypal.call('TransactionSearch', {StartDate: '2015-01-28T02:27:44.681Z'}, processTransactions);

function processTransactions(error, transactions) {
    var trans = transactions;
    //console.log(transactions);
    convert(trans);
};

function convert(data) {
    var table = [];
    var headers = getHeader(data)
    table.push(headers);

    for (var i = 0; i < data.length; ++i) {
        var trans = data[i];
        var row = headers.map(function (key) {
            if (key in trans) {
                return trans[key];
            } else return "";

        });
        table.push(row);
    }
    //console.log(table);

    csv.writeToString(table, {
        headers: true
    }, function (err, data) {
        return console.log(data);
    });
}

function getHeader(data) {
    var result = Object.keys(data[0]);
    for (var i = 1; i < data.length; i++) {
        var keys = Object.keys(data[i]);
        for (var j = 0; j < keys.length; j++) {
            if (result.indexOf(keys[j]) == -1) {
                //result.push(keys[j]);
                result.splice(j,0,keys[j]);
            }

        }
    }
    return result;
}


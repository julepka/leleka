/*
 * Copyright (c) 2015 Iuliia Potapenko
 * Distributed under the GNU GPL v3.
 * For full terms see http://www.gnu.org/licenses/gpl or LICENSE.txt file.
 */

var PayPal = require('paypal-classic-api');
var csv = require('fast-csv');
var input = require('./input'); // DELETE THIS LINE

// ENTER YOUR ACCOUNT CREDENTIALS
var credentials = {
    username: input.username,
    password: input.password,
    signature: input.signature
};

var paypal = new PayPal(credentials);

// CHANGE STARTDATE, EXAMPLE: '2015-03-05T02:27:44.681Z'
paypal.call('TransactionSearch', {StartDate: input.startdate}, processTransactions);

function processTransactions(error, transactions) {
    if (error) {
        console.error('API call error: ' + error);
    } else {
        convert(clean(transactions));
    }
};

function clean (transaction) {
    var result = [];
    var flag = [];

    for (var i = transaction.length - 1; i >= 0; i--) {

        if (isOtherCurrency(transaction[i])) {
            transaction[i].NETUSD = "flag";
            flag.push(i);
            result.push(transaction[i]);

        } else if (isConvertOut(transaction[i])) {
            for (var j = 0; j < flag.length; j++) {
                if (transaction[i].AMT === -transaction[flag[j]].NETAMT &
                    transaction[i].CURRENCYCODE === transaction[flag[j]].CURRENCYCODE &
                    transaction[flag[j]].NETUSD === "flag") {
                    transaction[flag[j]].NETUSD = "flag2";
                }
            }

        } else if (isConvertIn(transaction[i])) {
            for (var j = 0; j < flag.length; j++) {
                if (transaction[flag[j]].NETUSD === "flag2") {
                    transaction[flag[j]].NETUSD = transaction[i].NETAMT;
                    flag.splice(j ,1);
                }
            }

        } else {
            transaction[i].NETUSD = transaction[i].NETAMT;
            result.push(transaction[i]);
        }
    }
    return result;
}

function isOtherCurrency(trans) {
    if (trans.CURRENCYCODE !== "USD" &
        trans.AMT > 0 & trans.NETAMT > 0 &
        trans.NAME !== "To U.S. Dollar") {
        return true;
    } else return false;
}

function isConvertOut(trans) {
    if (trans.EMAIL === undefined &
        trans.TYPE.substring(0, 9) === "Transfer " &
        trans.NAME === "To U.S. Dollar" &
        trans.AMT < 0 & trans.NETAMT < 0 &
        trans.CURRENCYCODE !== "USD") {
        return true;
    } else return false;
}

function isConvertIn(trans) {
    if (trans.EMAIL === undefined &
        trans.TYPE.substring(0, 9) === "Transfer " &
        trans.NAME.substring(0, 5) === "From " &
        trans.AMT > 0 & trans.NETAMT > 0 &
        trans.CURRENCYCODE === "USD") {
        return true;
    } else return false;
}

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
                result.splice(j,0,keys[j]);
            }

        }
    }
    return result;
}


/*
 * Copyright (c) 2015 Iuliia Potapenko
 * Distributed under the GNU GPL v3.
 * For full terms see http://www.gnu.org/licenses/gpl or LICENSE.txt file.
 */

var PayPal = require('paypal-classic-api');
var csv = require('fast-csv');
var fs = require('fs');

// CREDENTIALS EXAMPLE
//var credentials = {
//    username: 'charity_api1.mail.com',
//    password: 'QHZE9GW6LZ2GTQWQ',
//    signature: 'AQU0e5vuZCvSg-XJploSa.sGUDlpAkarGzBHs8tpshLhz1LRC8z.qaGH'
//};


function makeCSV(credentials, date, callback) {
    var paypal = new PayPal(credentials);
    //paypal.call('TransactionSearch', {StartDate: '2015-03-05T02:27:44.681Z'}, function (error, transactions) {
    paypal.call('TransactionSearch', date, function (error, transactions) {
        processTransactions(error,transactions.objects,callback);
    });
}
exports.makeCSV = makeCSV;

function processTransactions(error, transactions, callback) {
    //console.log(transactions);
    if (error) {
        console.error('Error in calling paypal-classic-api. API call error: ' + error);
    } else if (transactions === undefined) {
        console.log('Error getting transactions. Transactions list is undefined');
    } else if (transactions.length === 0) {
        console.log('Transactions list is empty');
    } else {
        convert(clean(transactions), callback);
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
            //TODO: if flag==empty || flag[n]!='flag' -> error
            //TODO: check if timerange has initial transaction for this conversion
            for (var j = 0; j < flag.length; j++) {
                if (transaction[i].AMT === -transaction[flag[j]].NETAMT &
                    transaction[i].CURRENCYCODE === transaction[flag[j]].CURRENCYCODE &
                    transaction[flag[j]].NETUSD === "flag") {
                    transaction[flag[j]].NETUSD = "flag2";
                }
            }

        } else if (isConvertIn(transaction[i])) {
            //TODO: if flag==empty || flag[n]!='flag2' -> error
            //TODO: check if timerange has initial transaction and charging one for this conversion
            for (var j = 0; j < flag.length; j++) {
                if (transaction[flag[j]].NETUSD === "flag2") {
                    transaction[flag[j]].NETUSD = transaction[i].NETAMT;
                    flag.splice(j, 1);
                }
            }

        } else if (isConvertOutNotAuto()) {
            //TODO: Currency conversion was requested by hands
            //It means that the amount can very unexpectedly

        } else if (isConvertOutNotAuto()) {

        } else {
            transaction[i].NETUSD = transaction[i].NETAMT;
            result.push(transaction[i]);
        }
    }
    //TODO: check if flag[] is empty
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
        //TODO: add processing of currency conversions that were made by hands
        //trans.TYPE.substring(0, 9) === "Transfer " &
        trans.TYPE === 'Currency Conversion (debit)' &
        trans.NAME === "To U.S. Dollar" &
        trans.AMT < 0 & trans.NETAMT < 0 &
        trans.CURRENCYCODE !== "USD") {
        return true;
    } else return false;
}

function isConvertIn(trans) {
    if (trans.EMAIL === undefined &
        //trans.TYPE.substring(0, 9) === "Transfer " &
        trans.TYPE === 'Currency Conversion (credit)' &
        trans.NAME.substring(0, 5) === "From " &
        trans.AMT > 0 & trans.NETAMT > 0 &
        trans.CURRENCYCODE === "USD") {
        return true;
    } else return false;
}

function isConvertOutNotAuto(trans) {
    if (trans.EMAIL === undefined &
        trans.TYPE.substring(0, 9) === "Transfer " &
        trans.NAME === "To U.S. Dollar" &
        trans.AMT < 0 & trans.NETAMT < 0 &
        trans.CURRENCYCODE !== "USD") {
        return true;
    } else return false;
}

function isConvertInNotAuto(trans) {
    if (trans.EMAIL === undefined &
        trans.TYPE.substring(0, 9) === "Transfer " &
        trans.NAME.substring(0, 5) === "From " &
        trans.AMT > 0 & trans.NETAMT > 0 &
        trans.CURRENCYCODE === "USD") {
        return true;
    } else return false;
}

function convert(data, callback) {
    //TODO: check if data is not empty
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

    //TODO: what error can be here?
    csv.writeToString(table, {
        headers: true
    }, function (err, data) {
        fs.writeFileSync('output.csv', data);
        return console.log(data);
        callback();
    });
}

function getHeader(data) {
    var result = Object.keys(data[0]);
    for (var i = 1; i < data.length; i++) {
        //TODO: check index to be in correct range
        var keys = Object.keys(data[i]);
        for (var j = 0; j < keys.length; j++) {
            if (result.indexOf(keys[j]) == -1) {
                result.splice(j,0,keys[j]);
            }

        }
    }
    return result;
}


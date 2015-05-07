/*
 * Copyright (c) 2015 Iuliia Potapenko
 * Distributed under the GNU GPL v3.
 * For full terms see http://www.gnu.org/licenses/gpl or LICENSE.txt file.
 */

var PayPal = require('paypal-classic-api');
var csv = require('fast-csv');
var fs = require('fs');
var tr = [];
var rules = require('./rules.js');

function makeCSV(credentials, date, callback, currency) {

    var paypal = new PayPal(credentials);
    paypal.call('TransactionSearch', date, function (error, transactions){
        createTransactions(paypal, date.StartDate, date.EndDate, function(result) {
            tr = result;
            if (result[0].ERRORCODE == '10002') {
                convert([], callback);
            } else {
                if((currency.cur == '' || currency.cur == 'undefined') & (currency.abr == '' || currency.abr == 'undefined')) {
                    convert(result, callback);
                } else {
                    processTransactions(error, result, currency, callback);
                }
            }
        });

    });

}

function createTransactions(paypal, startRaw, endRaw, callback, recursionNumber) {
    var start = new Date(startRaw);
    var end = new Date(endRaw);
    var d = {StartDate: start.toJSON(), EndDate: end.toJSON()};
    paypal.call('TransactionSearch', d, function (error, transactions) {
        if (transactions.objects.length >= 100) {
            var tasksFinished = 0;
            var result = [];
            function subCallback(subTransactions, recursionNumber) {

                console.log(subTransactions);
                if (recursionNumber == 0) {
                    result = result.concat(subTransactions);
                }
                else {
                    console.log("sub transactions:", subTransactions);
                    result = subTransactions.concat(result);
                }

                tasksFinished += 1;
                if (tasksFinished == 2) {
                    callback(result);
                }
            }
            createTransactions(paypal, start, new Date((start.getTime() + end.getTime()) / 2), subCallback, 0);
            createTransactions(paypal, new Date((start.getTime() + end.getTime()) / 2), end, subCallback, 1);
        } else {
            paypal.call('TransactionSearch', d, function (error, transactions) {
                callback(transactions.objects, recursionNumber);
            });
        }
    });
}




exports.makeCSV = makeCSV;

function processTransactions(error, transactions, currency, callback) {
    if (error) {
        console.error('Error in calling paypal-classic-api. API call error: ' + error);
    } else if (transactions === undefined) {
        console.log('Error getting transactions. Transactions list is undefined');
    } else if (transactions.length === 0) {
        console.log('Transactions list is empty');
        convert([], callback);
    } else {
        convert(clean(transactions, currency), callback);
    }
};

function clean (transaction, currency) {
    var result = [];
    var flag = [];
    var buyflag = [];

    for (var i = transaction.length - 1; i >= 0; i--) {

        if (rules.isOtherCurrency(transaction[i], currency)) {
            transaction[i].NETMAIN = "flag";
            flag.push(i);
            result.push(transaction[i]);

        } else if (rules.isConvertOut(transaction[i], currency)) {
            for (var j = 0; j < flag.length; j++) {
                if (transaction[i].AMT === -transaction[flag[j]].NETAMT &
                    transaction[i].CURRENCYCODE === transaction[flag[j]].CURRENCYCODE &
                    transaction[flag[j]].NETMAIN === "flag") {
                    transaction[flag[j]].NETMAIN = "flag2";
                    break;
                }
            }

        } else if (rules.isConvertIn(transaction[i], currency)) {
            for (var j = 0; j < flag.length; j++) {
                if (transaction[flag[j]].NETMAIN === "flag2") {
                    transaction[flag[j]].NETMAIN = transaction[i].NETAMT;
                    flag.splice(j, 1);
                    break;
                }
            }

        } else if (rules.isBuyCurrencyOut(transaction[i], currency)) {
            transaction[i].EMAIL = 'buyflag';
            buyflag.push(i);

        } else if (rules.isBuyCurrencyIn(transaction[i], currency)) {
            for (var j = 0; j < buyflag.length; j++) {
                if (transaction[buyflag[j]].EMAIL === "buyflag") {
                    transaction[buyflag[j]].EMAIL = "buyflag2";
                    transaction[buyflag[j]].NAME = transaction[i].NETAMT;

                    break;
                }
            }

        } else if (rules.isBuyOperation(transaction[i], currency)) {
            console.log('isBuyOperation');
            console.log(buyflag);
            for (var j = 0; j < buyflag.length; j++) {
                if (transaction[buyflag[j]].EMAIL === "buyflag2" &
                    transaction[buyflag[j]].NAME === -transaction[i].AMT) {
                    transaction[buyflag[j]].EMAIL = transaction[i].EMAIL;
                    transaction[buyflag[j]].TYPE = transaction[i].TYPE;
                    transaction[buyflag[j]].NAME = transaction[i].NAME;
                    flag.splice(j, 1);
                    result.push(transaction[buyflag[j]]);
                    break;
                }
            }

        } else {
            transaction[i].NETMAIN = transaction[i].NETAMT;
            result.push(transaction[i]);
        }
    }
    return result;
}

function convert(data, callback) {
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
        callback(data);
        //fs.writeFileSync('output.csv', data);
        //return console.log(data);
        //callback();
    });
}

function getHeader(data) {
    if (data.length == 0) return [];
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


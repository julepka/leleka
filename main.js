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

// CREDENTIALS EXAMPLE
//var credentials = {
//    username: 'address_api1.mail.com',
//    password: 'QHZE9GW6LZ2GTQWQ',
//    signature: 'AQU0e5vuZCvSg-XJploSa.sGUDlpAkarGzBHs8tpshLhz1LRC8z.qaGH'
//};


function makeCSV(credentials, date, callback, currency) {

    var paypal = new PayPal(credentials);
    //paypal.call('TransactionSearch', {StartDate: '2015-03-05T02:27:44.681Z'}, function (error, transactions) {
    //date.EndDate = '2015-03-20T02:27:44.681Z';
    paypal.call('TransactionSearch', date, function (error, transactions){
        //console.log(transactions);
        createTransactions(paypal, date.StartDate, date.EndDate, function(result) {
            tr = result;
            if((currency.cur == '' || currency.cur == 'undefined') & (currency.abr == '' || currency.abr == 'undefined')) {
                convert(result, callback);
            } else {
                processTransactions(error, result, currency, callback);
            }
        });

    });

}

function createTransactions(paypal, startRaw, endRaw, callback, recursionNumber) {
    var start = new Date(startRaw);
    var end = new Date(endRaw);
    var d = {StartDate: start.toJSON(), EndDate: end.toJSON()};
   // console.log('enter create: start ' + startRaw + ' end ' + endRaw);
    paypal.call('TransactionSearch', d, function (error, transactions) {
        //console.log('entered call');
        if (transactions.objects.length >= 100) {
            //console.log('before recursion');
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
            //console.log('enter create: start ' + startRaw + ' end ' + endRaw);
            paypal.call('TransactionSearch', d, function (error, transactions) {
                //console.log('before push');

                /*
                for(var i=0; i<transactions.objects.length; i++) {
                    tr.push(transactions.objects[i]);
                }
                */

                //console.log(tr);

                callback(transactions.objects, recursionNumber);
            });
        }
    });
}




exports.makeCSV = makeCSV;

function processTransactions(error, transactions, currency, callback) {
    //console.log(transactions);
    if (error) {
        console.error('Error in calling paypal-classic-api. API call error: ' + error);
    } else if (transactions === undefined) {
        console.log('Error getting transactions. Transactions list is undefined');
    } else if (transactions.length === 0) {
        console.log('Transactions list is empty');
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
            //TODO: if flag==empty || flag[n]!='flag' -> error
            //TODO: check if timerange has initial transaction for this conversion
            for (var j = 0; j < flag.length; j++) {
                if (transaction[i].AMT === -transaction[flag[j]].NETAMT &
                    transaction[i].CURRENCYCODE === transaction[flag[j]].CURRENCYCODE &
                    transaction[flag[j]].NETMAIN === "flag") {
                    transaction[flag[j]].NETMAIN = "flag2";
                    break;
                }
            }

        } else if (rules.isConvertIn(transaction[i], currency)) {
            //TODO: if flag==empty || flag[n]!='flag2' -> error
            //TODO: check if timerange has initial transaction and charging one for this conversion
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
                //console.log(transaction[buyflag[j]]);
                //console.log(transaction[i]);
                if (transaction[buyflag[j]].EMAIL === "buyflag2" &
                    transaction[buyflag[j]].NAME === -transaction[i].AMT) {
                    transaction[buyflag[j]].EMAIL = transaction[i].EMAIL;
                    transaction[buyflag[j]].TYPE = transaction[i].TYPE;
                    transaction[buyflag[j]].NAME = transaction[i].NAME;
                    flag.splice(j, 1);
                    //console.log(transaction[buyflag[j]]);
                    result.push(transaction[buyflag[j]]);
                    break;
                }
            }
            
        //} else if (isConvertOutNotAuto()) {
        //    //TODO: Currency conversion was requested by hands
        //    //It means that the amount can very unexpectedly
        //
        //} else if (isConvertOutNotAuto()) {

        } else {
            transaction[i].NETMAIN = transaction[i].NETAMT;
            result.push(transaction[i]);
        }
    }
    //TODO: check if flag[] is empty
    return result;
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
        callback(data);
        //fs.writeFileSync('output.csv', data);
        //return console.log(data);
        //callback();
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


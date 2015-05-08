# leleka - PayPal Transactions Processing

This project allows you to get your PayPal transactions easier than using a website. The main feature is that you can filter currency conversion transactions. Just launch the server and use simple web-interface. Enter your information and get .csv file as a result. It uses SSL to protect your data. GNU GPL v3 License. **[Try it now!](http://paypalprocess.herokuapp.com/)**

## Content

* [Installation](#installation)
* [User Guide](#userguide)
  * [API Credentials](#apicredentials)
  * [Dates](#dates)
  * [Settings](#settings)
    * [Filtering Transactions](#filteringtransactions)
    * [Sandbox Account](#sandboxaccount)
  * [Example](#example1)
* [Code Description](#codedescription)
  * [server.js](#serverjs)
  * [main.js](#mainjs)
  * [rules.js](#rulesjs)
  * [validate.js](#validatejs)
  * [index.html](#indexhtml)
  * [SSL](#ssl)
  * [Filter Logic](#filterlogic)
    * [Description](#description)
    * [Algorithm](#algorithm)
    * [Implementation](#implementation)
    * [Example](#example2)
* [Finding Bugs](#findingbugs)
  * [PayPal Transactions Format and API](#paypaltransactionsformatandapi)
  * ["flag" in Output File](#flaginoutputfile)
* [Related Resources](#relatedresources)

![Picture](https://github.com/julepka/leleka/blob/master/examples/app_screenshot.png)

## <a name="installation"></a>Installation

1. Install Node.js
2. Run `npm install` from application directory
3. Run `node server.js`
4. Open in browser `http://localhost:5000/` and everything is ready to work

If you have any troubles with the first or the second steps see the following links:
- [How to install Node.js](http://howtonode.org/how-to-install-nodejs)
- [Download Node.js from official website](https://nodejs.org/download/)
- [npm installation guide](https://docs.npmjs.com/getting-started/installing-node)

## <a name="userguide"></a>User Guide

### <a name="apicredentials"></a>API Credentials

Getting transactions is available for **business accounts only**. This is not the application restriction, this restriction is set by PayPal. To get transactions you need to know your API Credentials that are available for business accounts only.

[Learn how to get your PayPal API Credentials](https://developer.paypal.com/docs/classic/api/apiCredentials/)

Application supports Sandbox accounts and Sandbox API Credentials. To get Sandbox API Credentials select `Sandbox > Accounts`, then choose one of business account, click on it and go to `Profile > API Credentials`

### <a name="dates"></a>Dates

You need to enter start and end date for transaction list. Transactions information is stored in [GMT](http://en.wikipedia.org/wiki/Greenwich_Mean_Time) format on PayPal servers. That is why you need to convert your time to GMT format. You can use any time zone converter like [this one](http://www.timezoneconverter.com/cgi-bin/tzc.tzc).

Please, use Chrome, Opera, Safari or other browsers that support datetime-local field.

### <a name="settings"></a>Settings

#### <a name="filteringtransactions"></a>Filtering Transactions

Filtering transactions work very well if your account makes currency conversions automatically. It also works if you convert each transaction separately by hands. It will not work if you gather (store) some other currency on your account from several transactions and then decide to convert it.

There two fields about main currency information. 

If you *don't want to filter* currency conversion transactions just leave them empty. In that case you will get transaction list without any modifications.

If you *want to filter* currency conversion transactions you need to fill both fields. If you are not sure about name of currency and its abbreviation, please, check [currency.txt](https://github.com/julepka/leleka/blob/master/currency.txt). This file may need updates in the future, so to be 100% sure you can see [PayPal currency information](https://developer.paypal.com/docs/classic/api/currency_codes/).

#### <a name="sandboxaccount"></a>Sandbox Account

Application supports sandbox accounts. You can use sandbox account to check the work of the application with no security risks for your real account. 

[Learn more about PayPal Sandbox Accounts](https://developer.paypal.com/webapps/developer/applications/accounts)

### <a name="example1"></a>Example

![Picture](https://github.com/julepka/leleka/blob/master/examples/app_screenshot_example.png)

Here you can see some sandbox API Credentials. I needed to get the result for March 9, 2015, 19:30 (7:30 PM), PDT. So, I had to enter March 10, 2015, 2:30 (2:30 AM), GMT. I entered currency name and abbreviation to filter result.

To see how filtering of currency conversion transactions works, compare the following output file for the example above:
- [Output without filtering](https://github.com/julepka/leleka/blob/master/examples/example_no_filter.csv)
- [Output with filtering](https://github.com/julepka/leleka/blob/master/examples/example_filter.csv)

So filter converts three transactions to one transaction and adds new column to the output. If buyer payed 200 RUB, he was charged -17.8 RUB fee, seller recieved 182.2 RUB that equals 5.46 USD. So the result of converting three transactions into one has information of the first payment plus new column with main currency equivalent.

Converts this three transactions:

```
Mon Mar 09 2015 19:41:13 GMT-0700 (PDT),GMT,Payment,buyer-russia@mail.com,Makarova Anna,9T1150232C883021U,Completed,200,RUB,-17.8,182.2
Mon Mar 09 2015 19:48:38 GMT-0700 (PDT),GMT,Currency Conversion (debit),,To U.S. Dollar,19V69462UT4338919,Completed,-182.2,RUB,0,-182.2
Mon Mar 09 2015 19:48:38 GMT-0700 (PDT),GMT,Currency Conversion (credit),,From Russian Ruble,3LN58142HE173583H,Completed,5.46,USD,0,5.46
```

To this one:

```
Mon Mar 09 2015 19:41:13 GMT-0700 (PDT),GMT,Payment,buyer-russia@mail.com,Makarova Anna,9T1150232C883021U,Completed,200,RUB,-17.8,182.2,5.46
```

If you've got "flag" in the last column, it means that something went wrong. Try to change time range a little bit. This problem is extremely rare for automatic currency conversion.

When application's work is done, the result file will be downloaded automatically. If the list of transactions is empty, you will get an empty file. If you have made a mistake in API Credentials you will also get an empty file. Please, after clicking the `Submit` button wait until file is downloaded. It takes some time.

## <a name="codedescription"></a>Code Description

![Picture](https://github.com/julepka/leleka/blob/master/examples/diagram.png)

This application is written in JavaScript, HTML and CSS and it uses Express.js framework of Node.js. It uses PayPal Classic API.
To start an application you need to run `node server.js` in application folder. Some files of the project are not needed for application to work. Application files are:
- server.js
- main.js
- rules.js
- index.html
- validate.js
- style.css
- ssl derictory is needed only if you use SSL

Input data is coming from *index.html*. As a result user gets .csv file that is downloaded automatically.

### <a name="serverjs"></a>server.js

It is core file of the application. It uses *main.js* and *index.html*. It also has an option to use SSL. To use SSL uncomment three lines that are shown in code below. Server will use 5000 port. This is the main part of *server.js*:

```javascript
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
```
* **`renderPage(req, res)`** Renders index.html.
* **`getTransactions(req, res)`** Sets result output parameters and passes input data from *index.html* to *main.js*.
* **`checkCredentialsReq(req)`** Returns *false* if any of needed fields is empty.

### <a name="mainja"></a>main.js

The main data operations are described in this file, it has main business logic of the application.

* **`makeCSV(credentials, date, callback, currency)`** Gets transactions list using *paypal-classic-api* and passes it to currency convertion filter or to output depending on input data. It is called from *server.js*.
* **`createTransactions(paypal, startRaw, endRaw, callback, recursionNumber)`** Makes a request to PayPal to get transactions. Maximum number of transactions that PayPal can send in respons is 100. If the number of received transactions is 100, then function uses recursion to get all transactions and adds them to one list.
* **`processTransactions(error, transactions, currency, callback)`** Checks if transactions list is valid. If the list is empty it calls a function to create an empty output file. If there are transactions in the list, function passes them to currency conversion filter and then to output.
* **`clean (transaction, currency)`** Is currency conversion filter. It returns a filtered list of transactions. It uses *rules.js* to detect currency conversion transactions. It stores these transactions in separate lists and adds flags to NETMAIN column.
* **`convert(data, callback)`** Converts list of transactions to .csv file using `fast-csv`. 
* **`function getHeader(data)`** Return a list of table headers.

### <a name="rulesjs"></a>rules.js

This file contains 6 rules that detect currency conversion transactions. Functions check fields of transaction to detect conversions. This file is used by *main.js*.

* **`isOtherCurrency(trans, cur)`** Returns true for the first transaction in currency conversion process, when someone pays you money in other currency.
* **`isConvertOut(trans, cur)`** Returns true for currency conversion transaction, when PayPal takes away money to convert to other currency. This function is for situation when someone paid you in other currency.
* **`isConvertIn(trans, cur)`** Returns true for currency conversion transaction, when PayPal gives you back money in your currency after converting from other currency. This function is for situation when someone paid you in other currency.
* **`isBuyOperation(trans, cur)`** Returns true for the first transaction in currency conversion process, when you pay someone who accepts other currency than yours.
* **`isBuyCurrencyOut(trans, cur)`** Returns true for currency conversion transaction, when PayPal takes away money to convert to other currency. This function is for situation when you paid someone in other currency.
* **`isBuyCurrencyIn(trans, cur)`** Returns true for currency conversion transaction, when PayPal gives you back money in your currency after converting from other currency. This function is for situation when you paid someone in other currency.

If the format of PayPal fields changes in the future, these rules will have to be modified, and function that uses these rules will need modifications too.

### <a name="validatejs"></a>validate.js

Application uses .validate (jQuery Validation Plugin) to check if input data is correct:
- *Username* is not empty
- *Password* contains 16 symbols
- *Signature* contains 56 symbols
- *Start Date* and *End Date* are not empty
- *Main currency full name* and *Main currency abbreviation* should both be empty or should both be filled

```javascript
  $("#loginform").validate( {
    rules: {
      username: {
        required: true
      },
      password: {
        required: true,
        rangelength: [16,16]
      },
      signature: {
        required: true,
        rangelength: [56,56]
      },
      date: {
        required: true
      },
      date2: {
        required: true
      },
      currency: {
        required: {
          depends: function() {
            return $("#currency2").is(':filled');
      }}},
      currency2: {
        required: {
          depends: function() {
            return $("#currency").is(':filled');
          }}}},
    messages: { ... 
```

### <a name="indexhtml"></a>index.html

User interface has `<input type="datetime-local" name="date"/>` so users should use Chrome, Opera, Safari or other browsers that support `datetime-local` input.

```html
<form id="loginform" action="/transactions" method="get">
    <h4>Enter API Credentials</h4>
    <p>Username: <br><input type="text" name="username"/> </p>
    <p>Password: <br><input type="text" name="password"/></p>
    <p>Signature: <br><input type="text" name="signature"/></p>
    <h4>Enter Dates (GMT)</h4>
    <p>Start Date: <br><input type="datetime-local" name="date"/></p>
    <p>End Date: <br><input type="datetime-local" name="date2"/></p>
    <h4>Settings</h4>
    <p>To filter convertion transactions enter main currency information</p>
    <p>Main currency full name (example: U.S. Dollar): <br><input type="text" name="currency" id="currency"/></p>
    <p>Main currency abbreviation (example: USD): <br><input type="text" name="currency2" id="currency2"/></p>
    <p><input type="checkbox" name="sandbox"> Sandbox account</p>
    <p><br><input type="submit" id="button"/></p>
</form>
```

### <a name="ssl"></a>SSL

To use SLL you need to uncomment the following 3 lines in *server.js*:

```javascript
var privateKey =  fs.readFileSync(__dirname + '/ssl/server.key').toString();
var certificate = fs.readFileSync(__dirname + '/ssl/server.crt').toString();

var server = https.createServer({key: privateKey, cert: certificate}, app);
```

And comment the following line:
```javascript
var server = http.createServer(app);
```

Place you key and certificate files in *ssl* directory. You can use the same names as shown above: *server.key* and *server.crt* Files that are in this directory by default are an example. You can use them to see that everything works and then replace them with real ssl key and certificate.

### <a name="filterlogic"></a>Filter Logic

#### <a name="description"></a>Description

If you give/get money using other currency than the main currency of your account, PayPal creates 3 transactions instead of one:
- Original transaction in other currency
- PayPal system takes away money in other currency
- PayPal system gives bake the equivalent in your currency

We will take a look at the situation when someone pays you in other currency. Situation when you pay someone is solved the same way.

```
Mon Mar 09 2015 19:41:13 GMT-0700 (PDT),GMT,Payment,buyer-russia@mail.com,Makarova Anna,9T1150232C883021U,Completed,200,RUB,-17.8,182.2
Mon Mar 09 2015 19:48:38 GMT-0700 (PDT),GMT,Currency Conversion (debit),,To U.S. Dollar,19V69462UT4338919,Completed,-182.2,RUB,0,-182.2
Mon Mar 09 2015 19:48:38 GMT-0700 (PDT),GMT,Currency Conversion (credit),,From Russian Ruble,3LN58142HE173583H,Completed,5.46,USD,0,5.46
```

Lets add headers of the table and remove fields that are not used in filtering algorithm.

TYPE                        | EMAIL                 | NAME               | AMT    | CURRENCYCODE | NETAMT 
--------------------------- | --------------------- | ------------------ | ------ | ------------ | ------
Payment                     | buyer-russia@mail.com | Makarova Anna      | 200    | RUB          | 182.2
Currency Conversion (debit) |                       | To U.S. Dollar     | -182.2 | RUB          | -182.2
Currency Conversion (credit)|                       | From Russian Ruble | 5.46   | USD          | 5.46

The goal is to convert table above to the next table:

TYPE                        | EMAIL                 | NAME               | AMT    | CURRENCYCODE | NETAMT | NETMAIN
--------------------------- | --------------------- | ------------------ | ------ | ------------ | ------ | -------
Payment                     | buyer-russia@mail.com | Makarova Anna      | 200    | RUB          | 182.2  | 5.46

#### <a name="algorithm"></a>Algorithm

1. If all following conditions are true -> go to step 5
  - `CURRENCYCODE` is not a main currency
  - `TYPE` does not start with "Currency Conversion ("
  - `AMT` > 0
  - `NETAMT` > 0
  - `NAME` is not "To " + main currency name
2. If all following conditions are true -> go to step 9
  - `EMAIL` is empty
  - `TYPE` is "Currency Conversion (debit)"
  - `NAME` is "To " + main currency name
  - `AMT` < 0
  - `NETAMT` < 0
  - `CURRENCYCODE` is not the main currency
3. If all following conditions are true -> go to step 11
  - `EMAIL` is empty
  - `TYPE` is "Currency Conversion (credit)"
  - `NAME` starts with "From "
  - `AMT` > 0
  - `NETAMT` > 0
  - `CURRENCYCODE` is the main currency
4. Set `NETMAIN` = `NETAMT`
5. Add transaction to result list
6. Take new transaction and go to step 1
7. Set `NETMAIN` = "flag"
8. Put transaction index in flag list and go to step 5
9. Find in flag list the first transaction with the following features
  - `AMT` of current transaction equals `NETAMT` of flag list transaction
  - `CURRENCYCODE` of current transaction and flag list transaction is the same
  - `NETMAIN` of flag list transaction is "flag"
10. Set `NETMAIN` = "flag2" and go to step 6
11. Find in flag list the first transaction with the following feature
  -`NETMAIN` of flag list transaction is "flag2"
12. Set `NETMAIN` of flag list transaction = `NETAMT` of the following transaction
13. Delete transaction from flag list and go to step 6

#### <a name="implementation"></a>Implementation

Step 1 check (rules.js):
```javascript
function isOtherCurrency(trans, cur) {
    if (trans.CURRENCYCODE !== cur.abr &
        trans.TYPE.substring(0, 21) !== "Currency Conversion (" &
        trans.AMT > 0 & trans.NETAMT > 0 &
        trans.NAME !== "To " + cur.cur) {
        return true;
    } else return false;
}
```

Step 2 check (rules.js):
```javascript
function isConvertOut(trans, cur) {
    if (trans.EMAIL === undefined &
        trans.TYPE === 'Currency Conversion (debit)' &
        trans.NAME === "To " + cur.cur &
        trans.AMT < 0 & trans.NETAMT < 0 &
        trans.CURRENCYCODE !== cur.abr) {
        return true;
    } else return false;
}
```

Step 3 check (rules.js):
```javascript
function isConvertIn(trans, cur) {
    if (trans.EMAIL === undefined &
        trans.TYPE === 'Currency Conversion (credit)' &
        trans.NAME.substring(0, 5) === "From " &
        trans.AMT > 0 & trans.NETAMT > 0 &
        trans.CURRENCYCODE === cur.abr) {
        return true;
    } else return false;
}
```

Steps 4-5 (main.js):
```javascript
transaction[i].NETMAIN = transaction[i].NETAMT;
result.push(transaction[i]);
```

Steps 7-8 (main.js):
```javascript
transaction[i].NETMAIN = "flag";
flag.push(i);
result.push(transaction[i]);
```

Steps 9-10 (main.js):
```javascript
for (var j = 0; j < flag.length; j++) {
    if (transaction[i].AMT === -transaction[flag[j]].NETAMT &
    transaction[i].CURRENCYCODE === transaction[flag[j]].CURRENCYCODE &
    transaction[flag[j]].NETMAIN === "flag") {
         transaction[flag[j]].NETMAIN = "flag2";
         break;
    }
}
```

Steps 11-13 (main.js):
```javascript
for (var j = 0; j < flag.length; j++) {
	if (transaction[flag[j]].NETMAIN === "flag2") {
		transaction[flag[j]].NETMAIN = transaction[i].NETAMT;
        flag.splice(j, 1);
        break;
	}
}
```

#### <a name="example2"></a>Example

Incoming line [0]:

TYPE                        | EMAIL                 | NAME               | AMT    | CURRENCYCODE | NETAMT
--------------------------- | --------------------- | ------------------ | ------ | ------------ | ------ 
Payment                     | buyer@mail.com        | Makarov Victor     | 100    | USD          | 100  

Cheking conditions in step 1, 2, 3 show that it is not a currency conversion transaction. So, we add new column for it - `NETMAIN` and set `NETMAIN = NETAMT`. And then we add this transaction to result list. So, we have:

TYPE                        | EMAIL                 | NAME               | AMT    | CURRENCYCODE | NETAMT | NETMAIN
--------------------------- | --------------------- | ------------------ | ------ | ------------ | ------ | -------
Payment                     | buyer@mail.com        | Makarov Victor     | 100    | USD          | 100    | 100

Incoming line [1]:

TYPE                        | EMAIL                 | NAME               | AMT    | CURRENCYCODE | NETAMT 
--------------------------- | --------------------- | ------------------ | ------ | ------------ | ------
Payment                     | buyer-russia@mail.com | Makarova Anna      | 200    | RUB          | 182.2

Conditions of step 1 return true. So, we add index [1] to flag list. We set `NETMAIN = "flag"` and add transaction to result list. So our result list is:

TYPE                        | EMAIL                 | NAME               | AMT    | CURRENCYCODE | NETAMT | NETMAIN
--------------------------- | --------------------- | ------------------ | ------ | ------------ | ------ | -------
Payment                     | buyer@mail.com        | Makarov Victor     | 100    | USD          | 100    | 100
Payment                     | buyer-russia@mail.com | Makarova Anna      | 200    | RUB          | 182.2  | flag

Incoming line [2]:

TYPE                        | EMAIL                 | NAME               | AMT    | CURRENCYCODE | NETAMT 
--------------------------- | --------------------- | ------------------ | ------ | ------------ | ------
Currency Conversion (debit) |                       | To U.S. Dollar     | -182.2 | RUB          | -182.2

Conditions of step 2 return true. So, we check if there is a transaction with index that is stored in flag list that satisfy conditions in step 9. Our flag list is [1], so we check transaction with index [1]. We see that current transaction [2] is connected to transaction [1]. So, we set `NETMAIN` of transaction [1] = "flag2". We do not put current transaction to result table. Result table:

TYPE                        | EMAIL                 | NAME               | AMT    | CURRENCYCODE | NETAMT | NETMAIN
--------------------------- | --------------------- | ------------------ | ------ | ------------ | ------ | -------
Payment                     | buyer@mail.com        | Makarov Victor     | 100    | USD          | 100    | 100
Payment                     | buyer-russia@mail.com | Makarova Anna      | 200    | RUB          | 182.2  | flag2

Incoming line [3]:

TYPE                        | EMAIL                 | NAME               | AMT    | CURRENCYCODE | NETAMT 
--------------------------- | --------------------- | ------------------ | ------ | ------------ | ------
Currency Conversion (credit)|                       | From Russian Ruble | 5.46   | USD          | 5.46

Conditions of step 3 return true. So, we check if there is a transaction in flag list with `NETMAIN = "flag2"`. We find transaction [1]. Then, we set `NETMAIN` of transaction [1] `= NETAMT` of current transaction transaction. And we delete transaction [1] from flag list.
 As a result flag list is empty. We converted 3 transactions in one. Result table:

TYPE                        | EMAIL                 | NAME               | AMT    | CURRENCYCODE | NETAMT | NETMAIN
--------------------------- | --------------------- | ------------------ | ------ | ------------ | ------ | -------
Payment                     | buyer@mail.com        | Makarov Victor     | 100    | USD          | 100    | 100 
Payment                     | buyer-russia@mail.com | Makarova Anna      | 200    | RUB          | 182.2  | 5.46

Check examples directory - there are three files that show examples of application output.

## <a name="findingbugs"></a>Finding Bugs

### <a name="paypaltransactionsformatandapi"></a>PayPal Transactions Format and API

The main problem of filtering is that it relies on text format of incoming transactions. Of course, PayPal can change the format and some functions will need to be rewritten. This problem may occur in the following functions:
- clean (transaction, currency) in main.js
- all functions in rules.js

The other problem is that application uses PayPal Classic API that has well-done functionality, while recently PayPal introduced REST API that doesn't have functionality needed for this application at this time.

### <a name="flaginoutputfile"></a>"flag" in Output File

This situation may occur when application tries to filter list of transaction where at least one currency conversion transaction has less that 2 conversion transactions that are connected to it. So changing time interval a little bit will solve this problem. This  situation is extremely rare if your account has automated currency conversion because automated conversion takes less than a millisecond.

## <a name="relatedresources"></a>Related Resources

* [Try application online](http://paypalprocess.herokuapp.com/)
* [Learn more about Heroku](https://www.heroku.com/about)
* [Learn more about Node.js](https://nodejs.org/)
* [Find usefull npm modules](https://www.npmjs.com/)
* [Learn more about Express.js framework](https://www.npmjs.com/package/express)
* [Learn more about fast-csv library](https://www.npmjs.com/package/fast-csv)
* [Learn more about paypal-classic-api module](https://www.npmjs.com/package/paypal-classic-api)
* [Read official PayPal Classic API documentation](https://developer.paypal.com/docs/classic/)
* [Learn more about API Credentials](https://developer.paypal.com/docs/classic/api/apiCredentials/)
* [Learn more about PayPal currency support](https://developer.paypal.com/docs/classic/api/currency_codes/)
* [Create your PayPal Developer Account](https://developer.paypal.com/developer)
* [Create diagrams with gliffy.com](https://www.gliffy.com)
* [Learn more about SSL](http://en.wikipedia.org/wiki/Transport_Layer_Security)

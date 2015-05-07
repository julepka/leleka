# leleka - PayPal Transactions Processing

This project allows you to get your PayPal transactions easier than using a website. The main feature is that you can filter currency conversion transactions. Just launch the server and use simple web-interface. Enter your information and get .csv file as a result. **[Try it now!](http://paypalprocess.herokuapp.com/)**

## Content

* [Installation](#installation)
* [User Guide](#userguide)
* [Code Description](#codedescription)
* [Finding Bugs](#findingbugs)
* [Related Resources](#relatedresources)

![Picture](https://github.com/julepka/leleka/blob/master/examples/app_screenshot.png)

## <a name="installation"></a>Installation

1. Install Node.js
2. Run `npm install` from application directory
3. Run `node server.js`
4. Open in browser `http://localhost:5000/` and everything is ready to work

If you have any troubles with the first or the second steps see the following links:
- [How to install Node.js](http://howtonode.org/how-to-install-nodejs)
- [npm installation guide](https://docs.npmjs.com/getting-started/installing-node)

## <a name="userguide"></a>User Guide

### API Credentials

Getting transactions is available for **business accounts only**. This is not the application restriction, this restriction is set by PayPal. To get transactions you need to know your API Credentials that are avaliable for business accounts only.

[Learn how to get your PayPal API Credentials](https://developer.paypal.com/docs/classic/api/apiCredentials/)

Application supports Sandbox accounts and Sandbox API Credentials. To get Sandbox API Credentials select `Sandbox > Accounts`, then choose one of business account, click on it and go to `Profile > API Credentials`

### Dates

You need to enter start and end date for transaction list. Transactions information is stored in [GMT](http://en.wikipedia.org/wiki/Greenwich_Mean_Time) format on PayPal servers. That is why you need to convert your time to GMT format. You can use any time zone converter like [this one](http://www.timezoneconverter.com/cgi-bin/tzc.tzc).

Please, use Chrome, Opera, Safari or other browsers that support datetime-local field.

### Settings

#### Filtering transactions

Filtering transactions work very well if your account make currency convertions automatically. It also works if you convert each transactions separately by hands. It will not work if you gather (store) some other currency on your account from several transactions and then decide to convert it.

There two fields about main currency information. 

If you *don't want to filter* currency convertion transactions just leave them empty. In that case you will get transaction list without any modifications.

If you *want to filter* currency convertion transactions you need to fill both fields. If you are not sure about name of currency and its abbreviation, please, check [currency.txt](https://github.com/julepka/leleka/blob/master/currency.txt). This file may need updates in future, so to be 100% sure you can see [PayPal currency information](https://developer.paypal.com/docs/classic/api/currency_codes/).

#### Sandbox account

Application supports sandbox accounts. You can use sandbox account to check the work of the application with no security risks for your real account. 

[Learn more about PayPal Sandbox Accounts](https://developer.paypal.com/webapps/developer/applications/accounts)

### Example

![Picture](https://github.com/julepka/leleka/blob/master/examples/app_screenshot_example.png)

Here you can see some sandbox API Credentials. I needed to get the result for March 9, 2015, 19:30 (7:30 PM), PDT. So I had to enter March 10, 2015, 2:30 (2:30 AM), GMT. I entered currency name and abbreviation to filter result.

To see how filtering of currency convertion transactions works, compare the following output file for the example above:
- [Output without filtering](https://github.com/julepka/leleka/blob/master/examples/example_no_filter.csv)
- [Output with filtering](https://github.com/julepka/leleka/blob/master/examples/example_filter.csv)

So filter converts three transactions to one transaction and adds new column to the output. If buyer payed 200 RUB, he was charched -17.8 RUB fee, seller recieves 182.2 RUB that equals 5.46 USD. So the result of converting three transactions into one has information of the first payment plus new column with main currency equivalent.

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

If you've got "flag" in the last column, it means that something went wrong. Try to change time range a little bit. This problem is extremely rare for automatic currency convertion.

When application's work is done, the result file will be downloaded automatically. If the list of transactions is empty, you will get an empty file. If you have made a mistake in API Credentials you will also get an empty file. Please, after clicking the `Submit` button wait until file is downloaded. It takes some time.
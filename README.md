# leleka - PayPal Transactions Processing

This project allows you to get your PayPal transactions easier than using a website. The main feature is that you can filter currency conversion transactions. Just launch the server and use simple web-interface. Enter your information and get .csv file as a result. [Try it now!](http://paypalprocess.herokuapp.com/)

## Content

* [Installation](#installation)
* [User Guide](#userguide)
* [Code Description](#codedescription)
* [Finding Bugs](#findingbugs)
* [Related Resources](#relatedresources)

![Picture](https://github.com/julepka/leleka/blob/master/app_screenshot.png)

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

There two fields about main currency information. 

If you *don't want to filter* currency convertion transactions just leave them empty. In that case you will get transaction list without any modifications.

If you *want to filter* currency convertion transactions you need to fill both fields. If you are not sure about name of currency and its abbreviation, please, check [currency.txt](https://github.com/julepka/leleka/blob/master/currency.txt). This file may need updates in future, so to be 100% sure you can see [PayPal currency information](https://developer.paypal.com/docs/classic/api/currency_codes/).

#### Sandbox account

Application supports sandbox accounts. You can use sandbox account to check the work of the application with no security risks for your real account. 

[Learn more about PayPal Sandbox Accounts](https://developer.paypal.com/webapps/developer/applications/accounts)

### Example

![Picture](https://github.com/julepka/leleka/blob/master/app_screenshot_example.png)

#### Output example

Take a look at output file output.csv. Github opens it in readable form. The first transactions is typycal one when you create an account in Paypal sandbox. Here is an example of output file:

```
TIMESTAMP,TIMEZONE,TYPE,EMAIL,NAME,TRANSACTIONID,STATUS,AMT,CURRENCYCODE,FEEAMT,NETAMT,NETMAIN
Mon Mar 09 2015 19:04:00 GMT-0700 (PDT),GMT,Transfer,,PayPal,9YW45438SY271923M,Completed,1000,USD,0,1000,1000
Mon Mar 09 2015 19:25:21 GMT-0700 (PDT),GMT,Payment,buyer-australia@mail.com,Jim Smith,1H133144P76734012,Completed,200,AUD,-8.1,191.9,172.78
Mon Mar 09 2015 19:29:11 GMT-0700 (PDT),GMT,Payment,buyer-usa-1@mail.com,Bill Forest,73X14788UW6300353,Completed,100,USD,-3.2,96.8,96.8
Mon Mar 09 2015 19:30:55 GMT-0700 (PDT),GMT,Payment,buyer-turkey@mail.com,Zaur Aliev,5D667625DJ142730X,Completed,100,USD,-4.2,95.8,95.8
Mon Mar 09 2015 19:32:21 GMT-0700 (PDT),GMT,Payment,buyer-usa-2@mail.com,Donna Nelton,3XP0992236919601T,Completed,200,USD,0,200,200
Mon Mar 09 2015 19:34:27 GMT-0700 (PDT),GMT,Payment,buyer-mexico@mail.com,Oscar Mendoza,8YU99125TN2711312,Completed,800,MXN,-35.2,764.8,57.06
Mon Mar 09 2015 19:35:34 GMT-0700 (PDT),GMT,Payment,buyer-usa-3@mail.com,Tim Person,81535355733575420,Completed,300,USD,-9,291,291
Mon Mar 09 2015 19:37:45 GMT-0700 (PDT),GMT,Payment,buyer-austria@mail.com,Thomas Mall,46P885982X544652G,Completed,100,EUR,0,100,129.36
Mon Mar 09 2015 19:38:38 GMT-0700 (PDT),GMT,Payment,buyer-brazil@mail.com,Pera Tarra,2XJ92299UJ3426725,Completed,300,BRL,-12.1,287.9,122.74
Mon Mar 09 2015 19:40:00 GMT-0700 (PDT),GMT,Payment,buyer-malaysia@mail.com,Idea Mako,1AR663506K054802C,Completed,70,USD,-3.03,66.97,66.97
Mon Mar 09 2015 19:41:13 GMT-0700 (PDT),GMT,Payment,buyer-russia@mail.com,Makarova Anna,9T1150232C883021U,Completed,200,RUB,-17.8,182.2,5.46
Mon Mar 09 2015 19:42:00 GMT-0700 (PDT),GMT,Payment,buyer-usa-1@mail.com,Bill Forest,8M9456729W876990H,Completed,110,USD,0,110,110
Mon Mar 09 2015 19:42:38 GMT-0700 (PDT),GMT,Payment,buyer-usa-2@mail.com,Donna Nelton,3RP250868W624473L,Completed,210,USD,-6.39,203.61,203.61
Mon Mar 09 2015 19:44:24 GMT-0700 (PDT),GMT,Payment,buyer-canada@mail.com,Emma Kholt,13T44442AS599440D,Completed,400,CAD,-15.9,384.1,361.84
Mon Mar 09 2015 19:45:16 GMT-0700 (PDT),GMT,Payment,buyer-japan@mail.com,Izumi Tamako,5P351626EW861452N,Completed,100,JPY,-44,56,0.54
Mon Mar 09 2015 19:47:21 GMT-0700 (PDT),GMT,Payment,buyer-israel@mail.com,Makh Asu,69P206210K0014213,Completed,900,ILS,-36.3,863.7,235.43
Mon Mar 09 2015 19:48:09 GMT-0700 (PDT),GMT,Payment,buyer-usa-3@mail.com,Tim Person,4YP5038868719023S,Completed,310,USD,0,310,310
Mon Mar 09 2015 19:50:02 GMT-0700 (PDT),GMT,Payment,seller-usa@mail.com,"Gabriella Beltham's Test Store",43J07666KT393161U,Completed,-1000,USD,0,-1000,-1000
Mon Mar 09 2015 19:51:00 GMT-0700 (PDT),GMT,Payment,buyer-usa-1@mail.com,Bill Forest,9BN151456D4075828,Completed,120,USD,-3.78,116.22,116.22
Mon Mar 09 2015 19:51:51 GMT-0700 (PDT),GMT,Payment,buyer-austria@mail.com,Thomas Mall,4TR746271A852364F,Completed,450,EUR,0,450,582.13
Mon Mar 09 2015 19:53:21 GMT-0700 (PDT),GMT,Payment,seller-spain@mail.com,"Fernando Horlonzola's Test Store",5MW80652TS8631036,Completed,-1000,USD,0,-1000,-1000
Mon Mar 09 2015 19:54:19 GMT-0700 (PDT),GMT,Payment,buyer-canada@mail.com,Emma Kholt,06M93127SH4827501,Completed,450,CAD,-17.85,432.15,407.11
Mon Mar 09 2015 19:55:15 GMT-0700 (PDT),GMT,Payment,buyer-australia@mail.com,Jim Smith,8CC30633NU038083D,Completed,250,AUD,0,250,225.09
Mon Mar 09 2015 19:55:59 GMT-0700 (PDT),GMT,Payment,buyer-usa-2@mail.com,Donna Nelton,7KF59618TR0061705,Completed,225,USD,0,225,225
Mon Mar 09 2015 19:56:35 GMT-0700 (PDT),GMT,Payment,buyer-usa-3@mail.com,Tim Person,5K319446S05858224,Completed,130,USD,0,130,130
```
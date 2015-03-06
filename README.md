# leleka
<h3>New version</h3>
<p>Combines not-USD transactions and converting to USD transactions in a single transaction. Adds new column NETUSD for USD equivalent of each transaction.</p>
<p>No error processing yet.</p>
<h5>Output example:</h5>
```
TIMESTAMP,TIMEZONE,TYPE,EMAIL,NAME,TRANSACTIONID,STATUS,AMT,CURRENCYCODE,FEEAMT,NETAMT,NETUSD
Thu Mar 05 2015 17:15:57 GMT-0800 (PST),GMT,Payment,buyer@gmail.com,test buyer,9AJ293798E847840B,Completed,140,USD,0,140,140
Thu Mar 05 2015 17:17:08 GMT-0800 (PST),GMT,Payment,buyer@gmail.com,test buyer,1TF06214GY283364B,Completed,-10,USD,0,-10,-10
Thu Mar 05 2015 17:17:31 GMT-0800 (PST),GMT,Payment,buyer-japan@gmail.com,Pota I,2WP27192A1998350K,Completed,-15,USD,-0.08,-15.08,-15.08
Thu Mar 05 2015 17:18:48 GMT-0800 (PST),GMT,Payment,buyer-japan@gmail.com,Pota I,25229977L42350035,Completed,450,JPY,-58,392,3.84
Thu Mar 05 2015 17:21:33 GMT-0800 (PST),GMT,Payment,buyer@gmail.com,test buyer,2D083245F3777525B,Completed,55,USD,0,55,55
Thu Mar 05 2015 17:27:30 GMT-0800 (PST),GMT,Payment,buyer2@gmail.com,Kim Sutton,8MB28355F7181061T,Completed,320,USD,0,320,320
```
<p>You can download this output example in project files - output.csv</p>

<h3>Previous version</h3>
<p>The following fields should be changed according to account information.</p>

```js
var credentials = {
    username: 'EMAIL.mail.com',
    password: 'PASSWORD',
    signature: 'SIGNATURE'
};
```
<h5>How to find credentials information?</h5>
<p>PayPal developer account -> Dashboard -> Accounts -> Choose user -> Profile -> API Credentials</p>

<p>Change the next code if you need to set other start date.</p>
```js
{StartDate: '2015-01-28T02:27:44.681Z'}
```

<h5>Output example</h5>
```
TIMESTAMP,TIMEZONE,TYPE,EMAIL,NAME,TRANSACTIONID,STATUS,AMT,CURRENCYCODE,FEEAMT,NETAMT
Tue Mar 03 2015 19:56:26 GMT-0800 (PST),GMT,Transfer (credit),,From Japanese Yen,8C8061047G215512E,Completed,2.04,USD,0,2.04
Tue Mar 03 2015 19:56:26 GMT-0800 (PST),GMT,Transfer (debit),,To U.S. Dollar,6VX27482DC953890F,Completed,-208,JPY,0,-208
Tue Mar 03 2015 19:53:21 GMT-0800 (PST),GMT,Payment,buyjapan@m.com,Sun Kim,9F081575VG311020N,Completed,200,JPY,-48,152
Thu Feb 26 2015 20:00:01 GMT-0800 (PST),GMT,Payment,buyjapan@m.com,Sun Kim,0JL138973J4267114,Completed,100,JPY,-44,56
Thu Feb 26 2015 19:53:21 GMT-0800 (PST),GMT,Payment,buyjapan@m.com,Sun Kim,0Y730605XS335043T,Completed,-12,USD,-0.06,-12.06
Thu Feb 26 2015 19:41:24 GMT-0800 (PST),GMT,Transfer,,PayPal,65L489117V5191606,Completed,500,USD,0,500
```

<h5>Output example in readable form</h5>

TIMESTAMP (shortened) | TIMEZONE | TYPE | EMAIL | NAME | TRANSACTIONID | STATUS | AMT | CURRENCYCODE | FEEAMT | NETAMT
--------------------- | -------- | ---- | ----- | ---- | ------------- | ------ | --- | ------------ | ------ | ------
Mar 03 2015 19:56:26|GMT|Transfer (credit)||From Japanese Yen|8C8061047G215512E|Completed|2.04|USD|0|2.04
Mar 03 2015 19:56:26|GMT|Transfer (debit)||To U.S. Dollar|6VX27482DC953890F|Completed|-208|JPY|0|-208
Mar 03 2015 19:53:21|GMT|Payment|buyjapan@m.com|Sun Kim|9F081575VG311020N|Completed|200|JPY|-48|152
Feb 26 2015 20:00:01|GMT|Payment|buyjapan@m.com|Sun Kim|0JL138973J4267114|Completed|100|JPY|-44|56
Feb 26 2015 19:53:21|GMT|Payment|buyjapan@m.com|Sun Kim|0Y730605XS335043T|Completed|-12|USD|-0.06|-12.06
Feb 26 2015 19:41:24|GMT|Transfer||PayPal|65L489117V5191606|Completed|500|USD|0|500

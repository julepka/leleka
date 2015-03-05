# leleka
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

<h5>Output example</h5>
```
TIMESTAMP,TIMEZONE,TYPE,NAME,TRANSACTIONID,STATUS,AMT,CURRENCYCODE,FEEAMT,NETAMT
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

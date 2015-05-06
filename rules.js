exports.isOtherCurrency = isOtherCurrency;
exports.isConvertOut = isConvertOut;
exports.isConvertIn = isConvertIn;
exports.isBuyCurrencyOut = isBuyCurrencyOut;
exports.isBuyCurrencyIn = isBuyCurrencyIn;
exports.isBuyOperation = isBuyOperation;

function isOtherCurrency(trans, cur) {
    if (trans.CURRENCYCODE !== cur.abr &
        trans.TYPE.substring(0, 21) !== "Currency Conversion (" &
        trans.AMT > 0 & trans.NETAMT > 0 &
        trans.NAME !== "To " + cur.cur) {
        return true;
    } else return false;
}

function isConvertOut(trans, cur) {
    if (trans.EMAIL === undefined &
        //TODO: add processing of currency conversions that were made by hands
        //trans.TYPE.substring(0, 9) === "Transfer " &
        trans.TYPE === 'Currency Conversion (debit)' &
        trans.NAME === "To " + cur.cur &
        trans.AMT < 0 & trans.NETAMT < 0 &
        trans.CURRENCYCODE !== cur.abr) {
        return true;
    } else return false;
}

function isConvertIn(trans, cur) {
    if (trans.EMAIL === undefined &
        //trans.TYPE.substring(0, 9) === "Transfer " &
        trans.TYPE === 'Currency Conversion (credit)' &
        trans.NAME.substring(0, 5) === "From " &
        trans.AMT > 0 & trans.NETAMT > 0 &
        trans.CURRENCYCODE === cur.abr) {
        return true;
    } else return false;
}

function isBuyCurrencyOut(trans, cur) {
    if (trans.EMAIL === undefined &
        trans.TYPE === 'Currency Conversion (debit)' &
        trans.NAME.substring(0, 3) === "To " &
        trans.CURRENCYCODE === cur.abr &
        trans.AMT < 0 & trans.NETAMT < 0 &
        trans.NAME !== "To " + cur.cur) {
        return true;
    } else return false;
}

function isBuyCurrencyIn(trans, cur) {
    if (trans.EMAIL === undefined &
            //trans.TYPE.substring(0, 9) === "Transfer " &
        trans.TYPE === 'Currency Conversion (credit)' &
        trans.NAME === "From " + cur.cur &
        trans.AMT > 0 & trans.NETAMT > 0 &
        trans.CURRENCYCODE !== cur.abr) {
        return true;
    } else return false;
}

function isBuyOperation(trans, cur) {
    if (trans.CURRENCYCODE !== cur.abr &
    trans.TYPE.substring(0, 21) !== "Currency Conversion (" &
    trans.AMT < 0 & trans.NETAMT < 0) {
        return true;
    } else return false;
}

//function isConvertOutNotAuto(trans) {
//    if (trans.EMAIL === undefined &
//        trans.TYPE.substring(0, 9) === "Transfer " &
//        trans.NAME === "To U.S. Dollar" &
//        trans.AMT < 0 & trans.NETAMT < 0 &
//        trans.CURRENCYCODE !== "USD") {
//        return true;
//    } else return false;
//}
//
//function isConvertInNotAuto(trans) {
//    if (trans.EMAIL === undefined &
//        trans.TYPE.substring(0, 9) === "Transfer " &
//        trans.NAME.substring(0, 5) === "From " &
//        trans.AMT > 0 & trans.NETAMT > 0 &
//        trans.CURRENCYCODE === "USD") {
//        return true;
//    } else return false;
//}
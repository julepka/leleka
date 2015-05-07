/*
* Copyright (c) 2015 Iuliia Potapenko
* Distributed under the GNU GPL v3.
* For full terms see http://www.gnu.org/licenses/gpl or LICENSE.txt file.
*/

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
        trans.TYPE === 'Currency Conversion (debit)' &
        trans.NAME === "To " + cur.cur &
        trans.AMT < 0 & trans.NETAMT < 0 &
        trans.CURRENCYCODE !== cur.abr) {
        return true;
    } else return false;
}

function isConvertIn(trans, cur) {
    if (trans.EMAIL === undefined &
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
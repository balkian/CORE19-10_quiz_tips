/*
  Common utilities for all assignments
 */

const _ = require("underscore");
const Utils = {};
const Browser = require('zombie');

const REG_URL = /(\b(http|ftp|https|ftps):\/\/[-A-ZáéíóúÁÉÍÓÚ0-9+&@#\/%?=~_|!:,.;]*[-A-ZáéíóúÁÉÍÓÚ0-9+&@#\/%=~_|])/ig;

Utils.getURL = (string) => {
    const urls = string.match(REG_URL);
    let url = null;
    if (urls instanceof Array) {
        url = urls[0];
    }
    return url;
};

Utils.exists = (thing) => {
    return !_.isUndefined(thing) && !_.isNull(thing);
};

Utils.isString = (thing) => {
    return _.isString(thing);
};

Utils.isObject = (thing) => {
    return _.isObject(thing);
};

Utils.isNumber = (thing) => {
    let number = false;
    if (Utils.exists(thing)) {
        number = typeof parseInt(thing) === "number";
    }
    return number
};

Utils.isArray = (thing) => {
    return _.isArray(thing);
};

Utils.isURL = (thing) => {
    if (Utils.isString(thing)) {
        return REG_URL.test(thing);
    }
};

Utils.isRegExp = (thing) => {
    return (thing instanceof RegExp);
};

Utils.isJSON = (thing) => {
    try {
        JSON.parse(thing);
        return true;
    } catch (e) {
        return false;
    }
};

Utils.search = (b, a) => {
    if (Utils.isRegExp(b)) {
        if (Utils.isString(a) && a.length > 0) {
            return b.test(a);
        } else {
            return false;
        }
    } else {
        if (Utils.isArray(a)) {
            let result = false;
            for (let item in a) {
                if (Utils.search(b, a[item])) {
                    result = true;
                }
            }
            return result;
        } else {
            if (Utils.isString(a.toString())) {
                return (a.toString().toLowerCase().indexOf(b.toLowerCase()) > -1);
            }
        }
    }
};


Utils.wrap = async function(promise, msg){
    return promise
        .then(data => {return data})
        .catch(err => {throw new Error(`${msg}`)});
}

Utils.assert_in_url = async function(expected, url, msg, browser) {
    let error_nav;
    browser = await Utils.assert_up(url, browser);
    msg = `${msg}\n\tExpected: ${expected}\n\tFound: '${browser.text('body')}'\n`;
    if(!Utils.search(expected, browser.text('body'))) {
        throw new Error(msg)
    }
}

Utils.assert_up = async function(url, browser) {
    if (typeof(browser) === 'undefined') {
        browser = new Browser();
    }
    let err
    [err, resp] = await Utils.to(browser.visit(url));
    if(err || !browser.success) {
        Utils.debug(`\n\tRequesting: ${url}\n\tResponse: ${browser.text()}\n\tStatus code: ${browser.statusCode}`);
        err = new Error(`Could not visit ${url} Status: ${browser.statusCode}`);
        throw err
    }
    return browser;
}

Utils.to = function(promise) {
    return promise
        .then(data => {
            return [null, data];
        })
        .catch(err => [err]);
};

Utils.debug = () => {}

if(process.env.DEBUG) {
    Utils.debug = console.log.bind(null, "DEBUG: ");
}

module.exports = Utils;

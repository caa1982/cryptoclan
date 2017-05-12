const User = require("../models/user");
const Coin = require("../models/coin");
const PortfolioHistory = require("../models/portfolio_history");
const Bittrex = require('../node_modules/node.bittrex.api');
const Poloniex = require('../node_modules/poloniex-api-node');
const async = require("async");
const config = require("../configuration");
const calculatePortfolio = require("./calculate-portfolio");


module.exports = {
    runInterval: function () {
        setInterval(()=>{getAPIs(()=>{})}, config.portfolioInterval);
    },
    getAPIs
}

function getAPIs(callback) {
    async.series([
        updatePoloniex, 
        updateBittrex,
        calculateAndLogPortfolio
    ], callback);
}

function calculateAndLogPortfolio(callbackMain) {
    let time = Date.now();

    User.find({ "portfolio.coins": { $exists: true, $not: { $size: 0 } } }, (err, users) => {
        async.each(users, (user,callback)=>{
            calculatePortfolio(user.id, total => {
                User.findOneAndUpdate({ "_id": user.id }, { "portfolio.total": total }, err => {
                    let log = new PortfolioHistory({
                        time,
                        userId: user.id,
                        total,
                        portfolio: user.portfolio
                    });
                    log.save(err => {
                        if (err) console.log(err)               
                        return callback();
                    })
                });
            })
        }, err=>{
            return callbackMain();
        })

    })
}

function updateBittrex(callbackMain) {
    User.find({
        $and: [
            { "bittrex.apikey": { $exists: true } },
            { "bittrex.apikey": { $ne: "" } }
        ]
    }, (err, users) => {
         async.each(users, (user, callback)=>{
             getBittrex(user, coins => {
                updateExchangeCoins(user, coins, "bittrex", () => {
                    callback();
                })
            })
        }, err=>{
            return callbackMain();
        });
    });
}

function updatePoloniex(callbackMain) {
    User.find({
        $and: [
            { "poloniex.apikey": { $exists: true } },
            { "poloniex.apikey": { $ne: "" } }
        ]
    }, (err, users) => {
        async.each(users, (user, callback)=>{
             getPoloniex(user, coins => {
                updateExchangeCoins(user, coins, "poloniex", () => {
                    callback();
                })
            })
        }, err=>{
            return callbackMain();
            
        });
    });
}


function updateExchangeCoins(user, coins, exchange, callback) {


    if (coins) {
        let coinIds = coins.map(coin => coin.id).filter(coin => coin);
        coins = coins.filter(coin => coin.id);
        User.findOneAndUpdate({ "_id": user.id }, { $pull: { "portfolio.coins": { exchange } } }, err => {
            User.findOneAndUpdate({ "_id": user.id }, {
                $addToSet: { coins: { $each: coinIds } },
                $push: { "portfolio.coins": { $each: coins } }
            },
                (err, user) => {
                    callback(err);
                });
        })
    } else {
        callback();
    }
}

function getBittrex(user, callBack) {
    let bittrexCoins = [];
    Bittrex.options({ 'apikey': user.bittrex.apikey, 'apisecret': user.bittrex.apisecret });
    Bittrex.getbalances(function (bittrexData) {

        bittrexData = bittrexData.result;
        if (bittrexData) {
            bittrexData.forEach(coin => {
                if (coin.Balance > 0)
                    bittrexCoins.push({ symbol: coin.Currency, balance: coin.Balance, exchange: "bittrex" })
            })
            async.each(bittrexCoins, function (coin, callback) {
                Coin.findOne({ "symbol": coin.symbol }, (err, coinData) => {
                    coin.id = coinData ? coinData.id : "";
                    callback();
                })
            }, function (err) {
                callBack(bittrexCoins)
            });
        }
    });
}

function getPoloniex(user, callBack) {
    let poloniexCoins = [];

    let poloniex = new Poloniex(user.poloniex.apikey, user.poloniex.apisecret);

    poloniex.returnBalances(function (err, poloniexData) {
        if (err) { console.log("Error: " + err); return callBack()}
        for (let symbol in poloniexData) {
            if (poloniexData[symbol] > 0) {
                poloniexCoins.push({ symbol: symbol, balance: poloniexData[symbol], exchange: "poloniex" })
            }
        }

        async.each(poloniexCoins, function (coin, callback) {
            Coin.findOne({ "symbol": coin.symbol }, (err, coinData) => {
                coin.id = coinData ? coinData.id : "";
                callback();
            })
        }, function (err) {
            callBack(poloniexCoins)
        });
    });
}
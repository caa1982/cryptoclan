const User = require("../models/user");
const Coin = require("../models/coin");
const PortfolioHistory = require("../models/portfolio_history");
const Bittrex = require('../node_modules/node.bittrex.api');
const Poloniex = require('../node_modules/poloniex-api-node');
const async = require("async");
const config = require("../configuration");


module.exports =
    function () {
   //  setInterval(function () {

        User.find({
            $and: [
                { "poloniex.apikey": { $exists: true } },
                { "poloniex.apikey": { $ne: "" } },
                { "bittrex.apikey": { $exists: true } },
                { "bittrex.apikey": { $ne: "" } }
            ]
        }, (err, users) => {
            users.forEach(user => {
                getPoloniex(user, (poloniexCoins, poloniexTotal) => {
                    getBittrex(user, (bittrexCoins, bittrexTotal) => {
                        updateUserPortfolio(user, poloniexCoins.concat(bittrexCoins), bittrexTotal + poloniexTotal, (err) => {
                            if (err) console.log(err);
                        })
                    })
                })
            });
        });
        User.find({
            $and: [
                { "poloniex.apikey": { $exists: true } },
                { "poloniex.apikey": { $ne: "" } },
                { "bittrex.apikey": { $exists: false } }
            ]
        }, (err, users) => {
            users.forEach(user => {
                getPoloniex(user, (poloniexCoins, poloniexTotal) => {
                    updateUserPortfolio(user, poloniexCoins, poloniexTotal, (err) => {
                        if (err) console.log(err);
                    })
                })
            });
        });
        User.find({
            $and: [
                { "poloniex.apikey": { $exists: false } },
                { "bittrex.apikey": { $exists: true } },
                { "bittrex.apikey": { $ne: "" } }
            ]
        }, (err, users) => {
            users.forEach(user => {
                getBittrex(user, (bittrexCoins, bittrexTotal) => {
                    updateUserPortfolio(user, bittrexCoins, bittrexTotal, (err) => {
                        if (err) console.log(err);
                    })
                })
            });
        });
   //  }, config.portfolioInterval);
    };



function updateUserPortfolio(user, coins, total, callback) {
    let time = Date.now();

    let coinIds  = coins.map(coin=>coin.id).filter(coin=>coin);
    User.findOneAndUpdate({ "_id": user.id }, {$addToSet:{coins:{$each:coinIds}}, portfolio: { coins, total, time } }, (err, user) => {
            let portfolioHistory = new PortfolioHistory({
                userId:user.id,
                portfolio: coins,
                total,
                time
            });
            portfolioHistory.save((err)=>{
                if(err) console.log(err);
            })

            callback(err);
        })
}

function getBittrex(user, callBack) {
    let bittrexCoins = [];
    let totalValue = 0;
    Bittrex.options({ 'apikey': user.bittrex.apikey, 'apisecret': user.bittrex.apisecret });
    Bittrex.getbalances(function (bittrexData) {

        bittrexData = bittrexData.result;
        bittrexData.forEach(coin => {
            if (coin.Balance > 0)
                bittrexCoins.push({ symbol: coin.Currency, balance: coin.Balance, exchange: "bittrex" })
        })
        async.each(bittrexCoins, function (coin, callback) {
            Coin.findOne({ "symbol": coin.symbol }, (err, coinData) => {
                totalValue += coinData ? coinData.price_usd * coin.balance : 0;
                coin.id =  coinData ? coinData.id : "";
                callback();
            })
        }, function (err) {
            callBack(bittrexCoins, totalValue)
        });
    });
}

function getPoloniex(user, callBack) {
    let poloniexCoins = [];
    let totalValue = 0;
    let poloniex = new Poloniex(user.poloniex.apikey, user.poloniex.apisecret);

    poloniex.returnBalances(function (err, poloniexData) {
        for (let symbol in poloniexData) {
            if (poloniexData[symbol] > 0) {
                poloniexCoins.push({ symbol: symbol, balance: poloniexData[symbol], exchange: "poloniex" })
            }
        }

        async.each(poloniexCoins, function (coin, callback) {
            Coin.findOne({ "symbol": coin.symbol }, (err, coinData) => {
                totalValue += coinData ? coinData.price_usd * coin.balance : 0;
                coin.id =  coinData ? coinData.id : "";
                callback();
            })
        }, function (err) {
            callBack(poloniexCoins, totalValue)
        });
    });
}
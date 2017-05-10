const User = require("../models/user");
const Coin = require("../models/coin");
const PortfolioHistory = require("../models/portfolio_history");
const Bittrex = require('../node_modules/node.bittrex.api');
const Poloniex = require('../node_modules/poloniex-api-node');
const async = require("async");
const config = require("../configuration");
const calculatePortfolio = require("./calculate-portfolio");


module.exports =
    function () {

     //   setInterval(function () {
            async.series([
                updatePoloniex,
                updateBittrex,
                calculateAndLogPortfolio
            ]);
     //   }, config.portfolioInterval);
    }


function calculateAndLogPortfolio(callback) {
    let time = Date.now();

    User.find({ "portfolio.coins": { $exists: true, $not: { $size: 0 } } }, (err, users) => {
        users.forEach(user => {
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
                       // callbackK();

                    })
                });

            })
        })
    })
}
// User.find({
//     $and: [
//         { "poloniex.apikey": { $exists: true } },
//         { "poloniex.apikey": { $ne: "" } },
//         { "bittrex.apikey": { $exists: true } },
//         { "bittrex.apikey": { $ne: "" } }
//     ]
// }, (err, users) => {
//     users.forEach(user => {
//         getPoloniex(user, (poloniexCoins, poloniexTotal) => {
//             getBittrex(user, (bittrexCoins, bittrexTotal) => {
//                 updateUserPortfolio(user, poloniexCoins.concat(bittrexCoins), bittrexTotal + poloniexTotal, (err) => {
//                     if (err) console.log(err);
//                 })
//             })
//         })
//     });
// });

// User.find({
//     $and: [
//         { "poloniex.apikey": { $exists: true } },
//         { "poloniex.apikey": { $ne: "" } },
//         { "bittrex.apikey": { $exists: false } }
//     ]
// }, (err, users) => {
//     users.forEach(user => {
//         getPoloniex(user, (poloniexCoins, poloniexTotal) => {
//             updateUserPortfolio(user, poloniexCoins, poloniexTotal, (err) => {
//                 if (err) console.log(err);
//             })
//         })
//     });
// });
function updateBittrex(callback) {
    User.find({
        $and: [
            { "bittrex.apikey": { $exists: true } },
            { "bittrex.apikey": { $ne: "" } }
        ]
    }, (err, users) => {
        users.forEach(user => {
            getBittrex(user, coins => {
                updateExchangeCoins(user, coins, "bittrex", () => {
                    callback();
                })
            })
        });
    });
}

function updatePoloniex(callback) {
    User.find({
        $and: [
            { "poloniex.apikey": { $exists: true } },
            { "poloniex.apikey": { $ne: "" } }
        ]
    }, (err, users) => {
        users.forEach(user => {
            getPoloniex(user, coins => {
                updateExchangeCoins(user, coins, "poloniex", () => {
                    callback();
                })
            })
        });
    });
}


function updateExchangeCoins(user, coins, exchange, callback) {

    let coinIds = coins.map(coin => coin.id).filter(coin => coin);
    coins = coins.filter(coin=>coin.id);
    User.findOneAndUpdate({ "_id": user.id }, { $pull: { "portfolio.coins": { exchange } } }, err => {
        User.findOneAndUpdate({ "_id": user.id }, {
            $addToSet: { coins: { $each: coinIds } },
            $push: { "portfolio.coins": {$each:coins} }
        },
            (err, user) => {
                callback(err);
            });
    })
}

function getBittrex(user, callBack) {
    let bittrexCoins = [];
    Bittrex.options({ 'apikey': user.bittrex.apikey, 'apisecret': user.bittrex.apisecret });
    Bittrex.getbalances(function (bittrexData) {

        bittrexData = bittrexData.result;
        if (bittrexData.length) {
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
        if (err) { console.log("Error: " + err); return }
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
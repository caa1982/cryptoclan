const User = require("../models/user");
const Coin = require("../models/coin");
const async = require("async")

module.exports = function (userId, moduleCallback) {
  User.findOne({ "_id": userId }, (err, user) => {
    if (user.portfolio && user.portfolio.coins) {
      let coins = user.portfolio.coins;
      let totalValue = 0;

      async.each(coins, function (coin, callback) {
        Coin.findOne({ "id": coin.id }, (err, coinData) => {
          totalValue += coinData ? coinData.price_usd * coin.balance : 0;
          callback();
        })
      }, function (err) {
        moduleCallback(totalValue)
      });


    } else {
      moduleCallback(0);
    }
  })

}